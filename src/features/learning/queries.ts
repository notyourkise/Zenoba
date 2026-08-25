import { prisma } from "@/lib/db/client";
import {
  calculateProgressPercentage,
  resolveLessonStatus,
} from "./prerequisites";
import {
  LearningPathDetail,
  LessonStatus,
  LessonWithStatus,
  ModuleWithLessons,
} from "./types";

/**
 * Get all published learning paths with user progress.
 */
export async function getLearningPathsWithProgress(
  userId?: string | null
): Promise<
  Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    icon?: string | null;
    orderIndex: number;
    modulesCount: number;
    totalLessonsCount: number;
    completedLessonsCount: number;
    progressPercent: number;
  }>
> {
  const paths = await prisma.learningPath.findMany({
    where: { published: true },
    orderBy: { orderIndex: "asc" },
    include: {
      modules: {
        where: { published: true },
        include: {
          lessons: {
            where: { published: true },
            select: { id: true },
          },
        },
      },
    },
  });

  const userProgress = userId
    ? await prisma.userLessonProgress.findMany({
        where: {
          userId,
          status: "COMPLETED",
        },
        select: { lessonId: true },
      })
    : [];

  const completedLessonIdSet = new Set(userProgress.map((p) => p.lessonId));

  return paths.map((path) => {
    const allLessonIds = path.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );
    const totalLessonsCount = allLessonIds.length;
    const completedLessonsCount = allLessonIds.filter((id) =>
      completedLessonIdSet.has(id)
    ).length;

    return {
      id: path.id,
      slug: path.slug,
      title: path.title,
      description: path.description,
      icon: path.icon,
      orderIndex: path.orderIndex,
      modulesCount: path.modules.length,
      totalLessonsCount,
      completedLessonsCount,
      progressPercent: calculateProgressPercentage(
        completedLessonsCount,
        totalLessonsCount
      ),
    };
  });
}

/**
 * Get full learning path detail with ordered modules, lessons, and resolved statuses.
 */
export async function getLearningPathDetail(
  pathSlug: string,
  userId?: string | null
): Promise<LearningPathDetail | null> {
  const path = await prisma.learningPath.findUnique({
    where: { slug: pathSlug, published: true },
    include: {
      modules: {
        where: { published: true },
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            where: { published: true },
            orderBy: { orderIndex: "asc" },
            include: {
              prerequisites: {
                include: {
                  prerequisite: {
                    include: {
                      module: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!path) {
    return null;
  }

  // Fetch all user progress records if logged in
  const userProgressRecords = userId
    ? await prisma.userLessonProgress.findMany({
        where: { userId },
      })
    : [];

  const completedSet = new Set(
    userProgressRecords
      .filter((p) => p.status === "COMPLETED")
      .map((p) => p.lessonId)
  );

  const progressStatusMap = new Map<string, LessonStatus>(
    userProgressRecords.map((p) => [p.lessonId, p.status as LessonStatus])
  );

  let totalLessons = 0;
  let totalCompleted = 0;

  const modulesWithLessons: ModuleWithLessons[] = path.modules.map((mod) => {
    let modCompleted = 0;

    const lessonsWithStatus: LessonWithStatus[] = mod.lessons.map((lesson) => {
      totalLessons++;
      const existingStatus = progressStatusMap.get(lesson.id);

      const resolved = resolveLessonStatus(
        lesson.prerequisites,
        completedSet,
        existingStatus
      );

      if (resolved.status === "COMPLETED") {
        totalCompleted++;
        modCompleted++;
      }

      return {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        orderIndex: lesson.orderIndex,
        xpReward: lesson.xpReward,
        status: resolved.status,
        prerequisites: lesson.prerequisites.map((p) => ({
          id: p.prerequisiteId,
          title: p.prerequisite?.title || "",
          slug: p.prerequisite?.slug || "",
          moduleSlug: p.prerequisite?.module?.slug || "",
        })),
        unmetPrerequisites: resolved.unmetPrerequisites,
      };
    });

    return {
      id: mod.id,
      slug: mod.slug,
      title: mod.title,
      description: mod.description,
      orderIndex: mod.orderIndex,
      lessons: lessonsWithStatus,
      progressPercent: calculateProgressPercentage(
        modCompleted,
        mod.lessons.length
      ),
      completedCount: modCompleted,
      totalCount: mod.lessons.length,
    };
  });

  return {
    id: path.id,
    slug: path.slug,
    title: path.title,
    description: path.description,
    icon: path.icon,
    orderIndex: path.orderIndex,
    modules: modulesWithLessons,
    progressPercent: calculateProgressPercentage(totalCompleted, totalLessons),
    completedLessonsCount: totalCompleted,
    totalLessonsCount: totalLessons,
  };
}

/**
 * Get lesson runner view detail with previous and next lesson links.
 */
export async function getLessonDetail(
  pathSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  userId?: string | null
) {
  const pathDetail = await getLearningPathDetail(pathSlug, userId);
  if (!pathDetail) return null;

  const currentModule = pathDetail.modules.find((m) => m.slug === moduleSlug);
  if (!currentModule) return null;

  const allLessons = pathDetail.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      ...l,
      pathSlug: pathDetail.slug,
      moduleSlug: m.slug,
      moduleTitle: m.title,
    }))
  );

  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  if (currentIndex === -1) return null;

  const currentLesson = allLessons[currentIndex];
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return {
    path: {
      id: pathDetail.id,
      slug: pathDetail.slug,
      title: pathDetail.title,
    },
    module: {
      id: currentModule.id,
      slug: currentModule.slug,
      title: currentModule.title,
    },
    lesson: currentLesson,
    prevLesson: prevLesson
      ? {
          slug: prevLesson.slug,
          title: prevLesson.title,
          moduleSlug: prevLesson.moduleSlug,
        }
      : null,
    nextLesson: nextLesson
      ? {
          slug: nextLesson.slug,
          title: nextLesson.title,
          moduleSlug: nextLesson.moduleSlug,
          status: nextLesson.status,
        }
      : null,
  };
}
