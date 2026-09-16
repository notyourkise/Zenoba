/**
 * Continuation and Learning Queue Domain Engine
 *
 * Deterministically resolves a learner's next learning action and ordered queue
 * with strict priority:
 * 1. REMEDIATION (failed module assessment requiring recovery)
 * 2. RESUME (in-progress lessons that have not been completed)
 * 3. ASSESSMENT (modules where all lessons are completed but assessment not passed)
 * 4. NEXT_LESSON (unlocked next lessons based on prerequisite satisfaction)
 */

export type LearningQueueItemKind =
  | "REMEDIATION"
  | "RESUME"
  | "ASSESSMENT"
  | "NEXT_LESSON";

export interface LearningQueueItem {
  kind: LearningQueueItemKind;
  href: string;
  title: string;
  moduleTitle?: string;
  pathTitle?: string;
  pathSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
  reason: string;
  priority: number;
}

export interface GraphLesson {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  prerequisiteLessonIds?: string[];
}

export interface GraphModule {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  assessmentId?: string | null;
  lessons: GraphLesson[];
}

export interface GraphPath {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  modules: GraphModule[];
}

export interface LearningGraph {
  paths: GraphPath[];
}

export interface ModuleAssessmentEvidence {
  moduleId?: string | null;
  assessmentId: string;
  passed: boolean;
  score: number;
  submittedAt?: Date | string;
}

export interface RemediationQueueInput {
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  moduleId: string;
  moduleSlug: string;
  moduleTitle: string;
  pathSlug: string;
  pathTitle: string;
  href: string;
  reason: string;
}

export interface LearnerEvidenceSnapshot {
  completedLessonIds: string[] | Set<string>;
  inProgressLessonIds: string[] | Set<string>;
  moduleAssessments: ModuleAssessmentEvidence[];
  remediationLessons?: RemediationQueueInput[];
}

/**
 * Resolves the prioritized learning queue based on authoritative evidence.
 */
export function resolveLearningQueue(
  curriculum: LearningGraph,
  evidence: LearnerEvidenceSnapshot,
): LearningQueueItem[] {
  const completed =
    evidence.completedLessonIds instanceof Set
      ? evidence.completedLessonIds
      : new Set(evidence.completedLessonIds);

  const inProgress =
    evidence.inProgressLessonIds instanceof Set
      ? evidence.inProgressLessonIds
      : new Set(evidence.inProgressLessonIds);

  // Map latest assessment state per module
  const latestAttemptsByModuleId = new Map<string, ModuleAssessmentEvidence>();
  for (const attempt of evidence.moduleAssessments) {
    if (attempt.moduleId) {
      const existing = latestAttemptsByModuleId.get(attempt.moduleId);
      if (!existing) {
        latestAttemptsByModuleId.set(attempt.moduleId, attempt);
      } else {
        if (!existing.passed && attempt.passed) {
          latestAttemptsByModuleId.set(attempt.moduleId, attempt);
        } else if (existing.passed === attempt.passed && attempt.submittedAt && existing.submittedAt) {
          if (new Date(attempt.submittedAt) > new Date(existing.submittedAt)) {
            latestAttemptsByModuleId.set(attempt.moduleId, attempt);
          }
        }
      }
    }
  }

  const remediationItems: LearningQueueItem[] = [];

  // 1. Prioritize active lesson-level remediation from unmet outcomes
  if (evidence.remediationLessons && evidence.remediationLessons.length > 0) {
    for (const rem of evidence.remediationLessons) {
      remediationItems.push({
        kind: "REMEDIATION",
        href: rem.href,
        title: `Remediasi: ${rem.lessonTitle}`,
        moduleTitle: rem.moduleTitle,
        pathTitle: rem.pathTitle,
        pathSlug: rem.pathSlug,
        moduleSlug: rem.moduleSlug,
        lessonSlug: rem.lessonSlug,
        reason: rem.reason,
        priority: 1,
      });
    }
  }

  const resumeItems: LearningQueueItem[] = [];
  const assessmentItems: LearningQueueItem[] = [];
  const nextLessonItems: LearningQueueItem[] = [];

  // Sort paths and modules deterministically
  const sortedPaths = [...curriculum.paths].sort((a, b) => a.orderIndex - b.orderIndex);

  for (const path of sortedPaths) {
    const sortedModules = [...path.modules].sort((a, b) => a.orderIndex - b.orderIndex);

    for (const currModule of sortedModules) {
      const sortedLessons = [...currModule.lessons].sort((a, b) => a.orderIndex - b.orderIndex);

      // 1. Check REMEDIATION (Priority 1)
      const attempt =
        (currModule.id ? latestAttemptsByModuleId.get(currModule.id) : undefined) ||
        (currModule.slug ? latestAttemptsByModuleId.get(currModule.slug) : undefined);
      if (attempt && !attempt.passed) {
        remediationItems.push({
          kind: "REMEDIATION",
          href: `/learn/${path.slug}/${currModule.slug}/assessment`,
          title: `Uji Kompetensi: ${currModule.title}`,
          moduleTitle: currModule.title,
          pathTitle: path.title,
          pathSlug: path.slug,
          moduleSlug: currModule.slug,
          reason: `Perlu perbaikan uji kompetensi (skor sebelumnya: ${attempt.score}%)`,
          priority: 1,
        });
      }

      // 2. Check RESUME (Priority 2)
      for (const lesson of sortedLessons) {
        if (inProgress.has(lesson.id) && !completed.has(lesson.id)) {
          resumeItems.push({
            kind: "RESUME",
            href: `/learn/${path.slug}/${currModule.slug}/${lesson.slug}`,
            title: lesson.title,
            moduleTitle: currModule.title,
            pathTitle: path.title,
            pathSlug: path.slug,
            moduleSlug: currModule.slug,
            lessonSlug: lesson.slug,
            reason: "Lanjutkan pelajaran yang sedang berlangsung",
            priority: 2,
          });
        }
      }

      // 3. Check ASSESSMENT (Priority 3)
      const allLessonsCompleted =
        sortedLessons.length > 0 && sortedLessons.every((l) => completed.has(l.id));

      if (allLessonsCompleted && currModule.assessmentId) {
        if (!attempt) {
          assessmentItems.push({
            kind: "ASSESSMENT",
            href: `/learn/${path.slug}/${currModule.slug}/assessment`,
            title: `Uji Kompetensi: ${currModule.title}`,
            moduleTitle: currModule.title,
            pathTitle: path.title,
            pathSlug: path.slug,
            moduleSlug: currModule.slug,
            reason: "Semua pelajaran modul telah selesai, siap untuk uji kompetensi",
            priority: 3,
          });
        }
      }

      // 4. Check NEXT_LESSON (Priority 4)
      for (const lesson of sortedLessons) {
        if (!completed.has(lesson.id) && !inProgress.has(lesson.id)) {
          const prereqsSatisfied =
            !lesson.prerequisiteLessonIds ||
            lesson.prerequisiteLessonIds.length === 0 ||
            lesson.prerequisiteLessonIds.every((pid) => completed.has(pid));

          if (prereqsSatisfied) {
            nextLessonItems.push({
              kind: "NEXT_LESSON",
              href: `/learn/${path.slug}/${currModule.slug}/${lesson.slug}`,
              title: lesson.title,
              moduleTitle: currModule.title,
              pathTitle: path.title,
              pathSlug: path.slug,
              moduleSlug: currModule.slug,
              lessonSlug: lesson.slug,
              reason: "Pelajaran berikutnya yang siap dipelajari",
              priority: 4,
            });
          }
        }
      }
    }
  }

  return [...remediationItems, ...resumeItems, ...assessmentItems, ...nextLessonItems];
}

/**
 * Returns the single most authoritative action for the primary CTA button, or null if complete.
 */
export function resolvePrimaryContinuation(
  queue: LearningQueueItem[],
): LearningQueueItem | null {
  return queue.length > 0 ? queue[0] : null;
}
