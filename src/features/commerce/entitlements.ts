import { prisma as defaultPrisma } from "@/lib/db/client";
import type { PrismaClient } from "@/generated/prisma/client";

export interface MyLearningCourseItem {
  id: string;
  slug: string;
  title: string;
  track: string;
  accessTier: "FREE" | "PREMIUM";
  learningPathSlug?: string;
  description: string | null;
}

export interface MyLearningView {
  courses: MyLearningCourseItem[];
}

export interface MyPackageItem {
  id: string;
  courseTitle: string;
  courseSlug: string;
  grantedAt: Date;
  sourceType: string;
  orderReference?: string | null;
}

export interface MyOrderItem {
  id: string;
  reference: string;
  state: string;
  totalAmountIdr: number;
  currency: string;
  createdAt: Date;
  expiresAt: Date;
  packageTitle: string;
  packageKind: string;
}

export async function resolveCourseAccess(
  { userId, courseId }: { userId: string; courseId: string },
  prisma: PrismaClient = defaultPrisma,
): Promise<"FREE" | "ENTITLED" | "DENIED"> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, accessTier: true },
  });

  if (!course) return "DENIED";
  if (course.accessTier === "FREE") return "FREE";

  const entitlement = await prisma.entitlement.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: { state: true },
  });

  if (entitlement && entitlement.state === "ACTIVE") {
    return "ENTITLED";
  }

  return "DENIED";
}

export async function getMyLearning(
  userId: string,
  prisma: PrismaClient = defaultPrisma,
): Promise<MyLearningView> {
  const [freeCourses, userEntitlements] = await Promise.all([
    prisma.course.findMany({
      where: { accessTier: "FREE", catalogStatus: "AVAILABLE" },
      include: { learningPath: { select: { slug: true } } },
      orderBy: { orderIndex: "asc" },
    }),
    prisma.entitlement.findMany({
      where: { userId, state: "ACTIVE" },
      include: {
        course: {
          include: { learningPath: { select: { slug: true } } },
        },
      },
      orderBy: { grantedAt: "desc" },
    }),
  ]);

  const items: MyLearningCourseItem[] = [
    ...freeCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      track: c.track,
      accessTier: "FREE" as const,
      learningPathSlug: c.learningPath?.slug,
      description: c.description,
    })),
    ...userEntitlements.map((e) => ({
      id: e.course.id,
      slug: e.course.slug,
      title: e.course.title,
      track: e.course.track,
      accessTier: "PREMIUM" as const,
      learningPathSlug: e.course.learningPath?.slug,
      description: e.course.description,
    })),
  ];

  return { courses: items };
}

export async function getMyPackages(
  userId: string,
  prisma: PrismaClient = defaultPrisma,
): Promise<MyPackageItem[]> {
  const entitlements = await prisma.entitlement.findMany({
    where: { userId, state: "ACTIVE" },
    include: {
      course: { select: { title: true, slug: true } },
      order: { select: { reference: true } },
    },
    orderBy: { grantedAt: "desc" },
  });

  return entitlements.map((e) => ({
    id: e.id,
    courseTitle: e.course.title,
    courseSlug: e.course.slug,
    grantedAt: e.grantedAt,
    sourceType: e.sourceType,
    orderReference: e.order?.reference ?? null,
  }));
}

export async function getMyOrders(
  userId: string,
  prisma: PrismaClient = defaultPrisma,
): Promise<MyOrderItem[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      package: { select: { title: true, kind: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((o) => ({
    id: o.id,
    reference: o.reference,
    state: o.state,
    totalAmountIdr: o.totalAmountIdr,
    currency: o.currency,
    createdAt: o.createdAt,
    expiresAt: o.expiresAt,
    packageTitle: o.package.title,
    packageKind: o.package.kind,
  }));
}
