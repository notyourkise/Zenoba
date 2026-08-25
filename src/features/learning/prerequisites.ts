import { LessonStatus, PrerequisiteInfo } from "./types";

export interface LessonPrerequisiteItem {
  id: string;
  lessonId: string;
  prerequisiteId: string;
  prerequisite?: {
    id: string;
    title: string;
    slug: string;
    module?: {
      slug: string;
    } | null;
  } | null;
}

/**
 * Resolves the effective status of a lesson for a user.
 *
 * Rules:
 * 1. If user has existing progress marked as COMPLETED, status is COMPLETED.
 * 2. If user has existing progress marked as IN_PROGRESS, check if prerequisites are satisfied. If so, IN_PROGRESS.
 * 3. Check all prerequisites:
 *    - If any prerequisite is NOT in completedLessonIds set, status is LOCKED.
 *    - If all prerequisites are in completedLessonIds set (or no prerequisites exist), status is AVAILABLE (or IN_PROGRESS if started).
 */
export function resolveLessonStatus(
  prerequisites: LessonPrerequisiteItem[],
  completedLessonIds: Set<string>,
  existingStatus?: LessonStatus | null
): {
  status: LessonStatus;
  unmetPrerequisites: PrerequisiteInfo[];
} {
  // If already completed, it remains COMPLETED
  if (existingStatus === "COMPLETED") {
    return {
      status: "COMPLETED",
      unmetPrerequisites: [],
    };
  }

  // Find any unmet prerequisites
  const unmetPrerequisites: PrerequisiteInfo[] = [];

  for (const prereq of prerequisites) {
    if (!completedLessonIds.has(prereq.prerequisiteId)) {
      unmetPrerequisites.push({
        id: prereq.prerequisiteId,
        title: prereq.prerequisite?.title || "Prerequisite Lesson",
        slug: prereq.prerequisite?.slug || "",
        moduleSlug: prereq.prerequisite?.module?.slug || "",
      });
    }
  }

  // If there are unmet prerequisites, the lesson is strictly LOCKED
  if (unmetPrerequisites.length > 0) {
    return {
      status: "LOCKED",
      unmetPrerequisites,
    };
  }

  // If user previously started the lesson, return IN_PROGRESS, otherwise AVAILABLE
  if (existingStatus === "IN_PROGRESS") {
    return {
      status: "IN_PROGRESS",
      unmetPrerequisites: [],
    };
  }

  return {
    status: "AVAILABLE",
    unmetPrerequisites: [],
  };
}

/**
 * Computes completion percentage from total and completed counts.
 */
export function calculateProgressPercentage(
  completedCount: number,
  totalCount: number
): number {
  if (!totalCount || totalCount <= 0) return 0;
  const percent = Math.round((completedCount / totalCount) * 100);
  return Math.min(100, Math.max(0, percent));
}
