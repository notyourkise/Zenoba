import { prisma } from "@/lib/db/client";

export interface DeveloperPackageOption {
  id: string;
  slug: string;
  title: string;
  kind: string;
  catalogStatus: string;
  courseCount: number;
}

/**
 * Retrieves packages and their course composition for developer access management.
 */
export async function getAvailablePackagesForAccess(): Promise<DeveloperPackageOption[]> {
  const packages = await prisma.package.findMany({
    include: {
      packageCourses: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  return packages.map((pkg) => ({
    id: pkg.id,
    slug: pkg.slug,
    title: pkg.title,
    kind: pkg.kind,
    catalogStatus: pkg.catalogStatus,
    courseCount: pkg.packageCourses.length,
  }));
}
