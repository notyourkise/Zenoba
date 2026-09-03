import { prisma as defaultPrisma } from "@/lib/db/client";
import type { PrismaClient } from "@/generated/prisma/client";

export interface CatalogCourseCard {
  id: string;
  slug: string;
  title: string;
  track: string;
  accessTier: "FREE" | "PREMIUM";
  catalogStatus: "COMING_SOON" | "AVAILABLE" | "RETIRED";
  description: string | null;
  orderIndex: number;
  accessLabel: string;
  availabilityLabel: string;
  priceLabel: string;
  canCheckout: boolean;
  isOwned: boolean;
}

export interface CatalogPackageCard {
  id: string;
  slug: string;
  title: string;
  kind: "SINGLE" | "COMBO";
  catalogStatus: "COMING_SOON" | "AVAILABLE" | "RETIRED";
  description: string | null;
  amountIdr: number | null;
  currency: string;
  orderIndex: number;
  availabilityLabel: string;
  priceLabel: string;
  canCheckout: boolean;
  courses: Array<{ slug: string; title: string }>;
}

export interface CatalogView {
  courses: CatalogCourseCard[];
  packages: CatalogPackageCard[];
}

export async function getCatalogForLearner(
  userId?: string,
  prisma: PrismaClient = defaultPrisma,
): Promise<CatalogView> {
  const [courses, packages, userEntitlements] = await Promise.all([
    prisma.course.findMany({
      orderBy: { orderIndex: "asc" },
    }),
    prisma.package.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        packageCourses: {
          orderBy: { orderIndex: "asc" },
          include: {
            course: {
              select: { slug: true, title: true },
            },
          },
        },
      },
    }),
    userId
      ? prisma.entitlement.findMany({
          where: { userId, state: "ACTIVE" },
          select: { courseId: true },
        })
      : Promise.resolve([]),
  ]);

  const ownedCourseIds = new Set(userEntitlements.map((e) => e.courseId));

  const courseCards: CatalogCourseCard[] = courses.map((course) => {
    const isFree = course.accessTier === "FREE";
    const isOwned = isFree || ownedCourseIds.has(course.id);
    const isComingSoon = course.catalogStatus === "COMING_SOON";

    const accessLabel = isFree ? "Gratis" : "Premium";
    const availabilityLabel = isComingSoon ? "Coming soon" : "Tersedia";
    const priceLabel = isFree
      ? "Gratis"
      : isComingSoon
        ? "Price announced at launch"
        : "Hubungi Admin";
    const canCheckout = !isFree && !isComingSoon && !isOwned;

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      track: course.track,
      accessTier: course.accessTier as "FREE" | "PREMIUM",
      catalogStatus: course.catalogStatus as "COMING_SOON" | "AVAILABLE" | "RETIRED",
      description: course.description,
      orderIndex: course.orderIndex,
      accessLabel,
      availabilityLabel,
      priceLabel,
      canCheckout,
      isOwned,
    };
  });

  const packageCards: CatalogPackageCard[] = packages.map((pkg) => {
    const isComingSoon = pkg.catalogStatus === "COMING_SOON";
    const availabilityLabel = isComingSoon ? "Coming soon" : "Tersedia";
    const priceLabel = isComingSoon
      ? "Price announced at launch"
      : pkg.amountIdr
        ? `Rp ${pkg.amountIdr.toLocaleString("id-ID")}`
        : "Gratis";
    const canCheckout = !isComingSoon && pkg.amountIdr !== null;

    return {
      id: pkg.id,
      slug: pkg.slug,
      title: pkg.title,
      kind: pkg.kind as "SINGLE" | "COMBO",
      catalogStatus: pkg.catalogStatus as "COMING_SOON" | "AVAILABLE" | "RETIRED",
      description: pkg.description,
      amountIdr: pkg.amountIdr,
      currency: pkg.currency,
      orderIndex: pkg.orderIndex,
      availabilityLabel,
      priceLabel,
      canCheckout,
      courses: pkg.packageCourses.map((pc) => ({
        slug: pc.course.slug,
        title: pc.course.title,
      })),
    };
  });

  return {
    courses: courseCards,
    packages: packageCards,
  };
}
