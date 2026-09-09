import { prisma as defaultPrisma } from "@/lib/db/client";
import type { PrismaClient } from "@/generated/prisma/client";

export class CourseAccessDeniedError extends Error {
  code = "COURSE_ACCESS_DENIED";
  constructor(message = "Akses kursus premium diperlukan") {
    super(message);
    this.name = "CourseAccessDeniedError";
  }
}

/**
 * Server-side entitlement guard for learning path content and actions.
 * - Allows access if path is uncommercialized or linked course is FREE.
 * - Requires active entitlement if linked to a PREMIUM course.
 */
export async function requireLearningPathAccess(
  { userId, pathSlug }: { userId: string; pathSlug: string },
  prisma: PrismaClient = defaultPrisma,
): Promise<void> {
  const path = await prisma.learningPath.findUnique({
    where: { slug: pathSlug },
    include: { commerceCourse: true },
  });

  if (!path || !path.commerceCourse) {
    // Uncommercialized path: free to access in current MVP scope
    return;
  }

  const course = path.commerceCourse;
  if (course.accessTier === "FREE") {
    return;
  }

  // Internal learners receive access to all courses without requiring entitlements
  const user = prisma.user
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      })
    : null;

  if (user?.role === "INTERNAL_LEARNER") {
    return;
  }

  // Premium course requires active entitlement
  const entitlement = await prisma.entitlement.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    select: { state: true },
  });

  if (!entitlement || entitlement.state !== "ACTIVE") {
    throw new CourseAccessDeniedError();
  }
}
