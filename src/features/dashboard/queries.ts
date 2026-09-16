import { prisma } from "@/lib/db/client";
import {
  resolveLearningQueue,
  resolvePrimaryContinuation,
  LearningQueueItem,
  LearnerEvidenceSnapshot,
} from "@/features/learning/continuation";
import { getCurriculumGraph } from "@/features/learning/queries";
import { getLearnerRemediationPlan } from "@/features/learning/remediation-queries";
import { getLearnerDueReviewItems } from "@/features/learning/review-service";

export interface DashboardContinuationData {
  primaryAction: LearningQueueItem | null;
  queue: LearningQueueItem[];
  isComplete: boolean;
}

/**
 * Server query adapter for dashboard continuation and prioritized learning queue.
 *
 * Gathers authoritative learner evidence from Prisma, passes it with the curriculum graph
 * to the deterministic continuation resolver, and returns the primary action, queue, and completion status.
 */
export async function getDashboardContinuationData(
  userId?: string | null
): Promise<DashboardContinuationData> {
  const graph = await getCurriculumGraph();

  if (!userId) {
    const emptyEvidence: LearnerEvidenceSnapshot = {
      completedLessonIds: new Set(),
      inProgressLessonIds: new Set(),
      moduleAssessments: [],
    };
    const queue = resolveLearningQueue(graph, emptyEvidence);
    return {
      primaryAction: resolvePrimaryContinuation(queue),
      queue,
      isComplete: false,
    };
  }

  // Fetch learner's lesson progress, assessment attempts, remediation plan, and due reviews in parallel
  const [progressRecords, assessmentAttempts, remediationPlan, dueReviews] = await Promise.all([
    prisma.userLessonProgress.findMany({
      where: { userId },
      select: { lessonId: true, status: true },
    }),
    prisma.assessmentAttempt.findMany({
      where: { userId },
      select: {
        moduleId: true,
        assessmentId: true,
        passed: true,
        score: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    getLearnerRemediationPlan(userId),
    getLearnerDueReviewItems(userId).catch(() => []),
  ]);

  const completedLessonIds = new Set<string>();
  const inProgressLessonIds = new Set<string>();

  for (const record of progressRecords) {
    if (record.status === "COMPLETED") {
      completedLessonIds.add(record.lessonId);
    } else if (record.status === "IN_PROGRESS") {
      inProgressLessonIds.add(record.lessonId);
    }
  }

  const moduleAssessments = assessmentAttempts.map((attempt) => ({
    moduleId: attempt.moduleId,
    assessmentId: attempt.assessmentId,
    passed: attempt.passed,
    score: attempt.score,
    submittedAt: attempt.createdAt,
  }));

  const evidence: LearnerEvidenceSnapshot = {
    completedLessonIds,
    inProgressLessonIds,
    moduleAssessments,
    remediationLessons: remediationPlan.lessons.map((l) => ({
      lessonId: l.lessonId,
      lessonSlug: l.lessonSlug,
      lessonTitle: l.lessonTitle,
      moduleId: l.moduleId,
      moduleSlug: l.moduleSlug,
      moduleTitle: l.moduleTitle,
      pathSlug: l.pathSlug,
      pathTitle: l.pathTitle,
      href: l.href,
      reason: l.reasons[0] || "Penguatan konsep sasaran kompetensi",
    })),
    dueReviews,
  };

  const queue = resolveLearningQueue(graph, evidence);
  const primaryAction = resolvePrimaryContinuation(queue);

  const totalLessonsInCurriculum = graph.paths.reduce(
    (acc, p) => acc + p.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
    0
  );

  const isComplete =
    totalLessonsInCurriculum > 0 &&
    queue.length === 0 &&
    completedLessonIds.size >= totalLessonsInCurriculum;

  return {
    primaryAction,
    queue,
    isComplete,
  };
}
