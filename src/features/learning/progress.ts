import { prisma } from "@/lib/db/client";
import { resolveLessonStatus } from "./prerequisites";
import { LessonStatus } from "./types";
import { awardXp, getUserTotalXp } from "@/features/xp/ledger";
import { requireLearningPathAccess } from "@/features/commerce/access";
import { getLessonCompletionDecision } from "@/features/learning/assessment/completion";
import { AssessmentIncompleteError } from "@/features/learning/assessment/errors";

/**
 * Starts a lesson for a user, marking it as IN_PROGRESS if prerequisites are met.
 */
export async function startLessonProgress(
  userId: string,
  lessonId: string
): Promise<{
  id: string;
  status: LessonStatus;
}> {
  // Fetch lesson prerequisites
  const lesson =
    (await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            path: true,
          },
        },
        prerequisites: {
          include: {
            prerequisite: {
              include: {
                module: true,
              },
            },
          },
        },
        userProgress: {
          where: { userId },
        },
      },
    })) ||
    (await prisma.lesson.findFirst?.({
      where: { slug: lessonId },
      include: {
        module: {
          include: {
            path: true,
          },
        },
        prerequisites: {
          include: {
            prerequisite: {
              include: {
                module: true,
              },
            },
          },
        },
        userProgress: {
          where: { userId },
        },
      },
    }));

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // Check entitlement access for the parent learning path
  if (lesson.module?.path?.slug) {
    await requireLearningPathAccess({
      userId,
      pathSlug: lesson.module.path.slug,
    });
  }

  // Get user's completed lessons
  const completedProgress = await prisma.userLessonProgress.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    select: { lessonId: true },
  });

  const completedSet = new Set(completedProgress.map((p) => p.lessonId));
  const currentStatus = (lesson.userProgress[0]?.status as LessonStatus) || null;

  // Check status using prerequisite domain logic
  const resolved = resolveLessonStatus(
    lesson.prerequisites,
    completedSet,
    currentStatus
  );

  if (resolved.status === "LOCKED") {
    throw new Error("Cannot start a locked lesson. Prerequisite required.");
  }

  if (resolved.status === "COMPLETED") {
    return {
      id: lesson.userProgress[0]?.id || "",
      status: "COMPLETED",
    };
  }

  // Upsert progress to IN_PROGRESS
  const progress = await prisma.userLessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: lesson.id,
      },
    },
    update: {
      status: "IN_PROGRESS",
    },
    create: {
      userId,
      lessonId: lesson.id,
      status: "IN_PROGRESS",
    },
  });

  return {
    id: progress.id,
    status: progress.status as LessonStatus,
  };
}

/**
 * Completes a lesson for a user (Idempotent).
 */
export async function completeLessonProgress(
  userId: string,
  lessonId: string
): Promise<{
  id: string;
  status: LessonStatus;
  completedAt: Date;
  xpAwarded: number;
  totalXp: number;
}> {
  const lesson =
    (await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            path: true,
          },
        },
      },
    })) ||
    (await prisma.lesson.findFirst?.({
      where: { slug: lessonId },
      include: {
        module: {
          include: {
            path: true,
          },
        },
      },
    }));

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // Check entitlement access for the parent learning path
  if (lesson.module?.path?.slug) {
    await requireLearningPathAccess({
      userId,
      pathSlug: lesson.module.path.slug,
    });
  }

  // Enforce authoritative assessment completion gate
  const decision = await getLessonCompletionDecision(userId, lesson.id);
  if (!decision.canComplete) {
    throw new AssessmentIncompleteError(decision.reason);
  }

  const existing = await prisma.userLessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId: lesson.id,
      },
    },
  });

  const isFirstCompletion = existing?.status !== "COMPLETED";
  const completedAt = existing?.completedAt || new Date();

  const progress = await prisma.userLessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: lesson.id,
      },
    },
    update: {
      status: "COMPLETED",
      completedAt,
    },
    create: {
      userId,
      lessonId: lesson.id,
      status: "COMPLETED",
      completedAt,
    },
  });

  // Award XP via auditable idempotent ledger
  let xpAwarded = 0;
  if (isFirstCompletion && lesson.xpReward > 0) {
    const xpResult = await awardXp(
      userId,
      lesson.xpReward,
      "LESSON_COMPLETION",
      lessonId
    );
    xpAwarded = xpResult.awarded ? xpResult.amount : 0;
  }

  const totalXp = await getUserTotalXp(userId);

  return {
    id: progress.id,
    status: "COMPLETED",
    completedAt,
    xpAwarded,
    totalXp,
  };
}

/**
 * Gets aggregated learning progress statistics for a user.
 */
export async function getUserProgressSummary(userId: string) {
  const [totalPublishedLessons, userProgressList, totalXp] = await Promise.all([
    prisma.lesson.count({
      where: { published: true },
    }),
    prisma.userLessonProgress.findMany({
      where: { userId },
    }),
    getUserTotalXp(userId),
  ]);

  const completedCount = userProgressList.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const inProgressCount = userProgressList.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;

  const percentage =
    totalPublishedLessons > 0
      ? Math.round((completedCount / totalPublishedLessons) * 100)
      : 0;

  return {
    totalLessons: totalPublishedLessons,
    completedCount,
    inProgressCount,
    completionPercentage: Math.min(100, Math.max(0, percentage)),
    totalXp,
  };
}
