import { prisma } from "@/lib/db/client";
import { getCurriculumGraph } from "./queries";
import {
  buildDeclaredOutcomesRegistry,
  getLearnerMasteryOverview,
} from "./mastery-queries";
import {
  calculateInitialSchedule,
  calculateNextSchedule,
  isScheduleDue,
  calculateDaysRemaining,
  type ReviewRating,
  type ReviewScheduleState,
} from "./review-scheduler";

export interface ReviewItemView {
  outcomeId: string;
  text: string;
  description?: string;
  moduleId: string;
  moduleSlug: string;
  moduleTitle: string;
  pathSlug: string;
  pathTitle: string;
  lessonId?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  dueAt: string;
  intervalDays: number;
  consecutiveSuccesses: number;
  daysRemaining: number;
  isDue: boolean;
  lastReviewedAt?: string | null;
}

export interface ReviewSessionData {
  dueReviews: ReviewItemView[];
  upcomingReviews: ReviewItemView[];
  stats: {
    dueCount: number;
    completedTodayCount: number;
    totalTrackedCount: number;
  };
}

export interface ReviewQueueInput {
  outcomeId: string;
  text: string;
  moduleTitle: string;
  pathTitle: string;
  pathSlug: string;
  moduleSlug: string;
  lessonSlug?: string;
  href: string;
  reason: string;
}

/**
 * Ensures that all currently MASTERED outcomes for a learner have an initialized review schedule.
 */
export async function ensureMasteredOutcomesScheduled(
  userId: string,
  now: Date = new Date()
): Promise<void> {
  const masterySummary = await getLearnerMasteryOverview(userId);
  const masteredOutcomes = masterySummary.modules
    .flatMap((m) => m.outcomes)
    .filter((o) => o.state === "MASTERED");

  if (masteredOutcomes.length === 0) {
    return;
  }

  const existingSchedules = await prisma.reviewSchedule.findMany({
    where: { userId },
    select: { outcomeId: true },
  });

  const existingOutcomeIds = new Set(existingSchedules.map((s) => s.outcomeId));

  const missing = masteredOutcomes.filter((o) => !existingOutcomeIds.has(o.outcomeId));

  if (missing.length === 0) {
    return;
  }

  for (const item of missing) {
    const initial = calculateInitialSchedule(item.outcomeId, {
      masteredAt: item.latestAttemptAt ? new Date(item.latestAttemptAt) : now,
      now,
    });

    try {
      await prisma.reviewSchedule.create({
        data: {
          userId,
          outcomeId: initial.outcomeId,
          dueAt: initial.dueAt,
          intervalDays: initial.intervalDays,
          consecutiveSuccesses: initial.consecutiveSuccesses,
          lastReviewedAt: null,
        },
      });
    } catch {
      // Ignore unique constraint collision from race conditions
    }
  }
}

/**
 * Resolves the complete review session data for an authenticated learner.
 */
export async function getLearnerReviewSession(
  userId: string,
  now: Date = new Date()
): Promise<ReviewSessionData> {
  await ensureMasteredOutcomesScheduled(userId, now);

  const [schedules, curriculum] = await Promise.all([
    prisma.reviewSchedule.findMany({
      where: { userId },
      orderBy: { dueAt: "asc" },
    }),
    getCurriculumGraph(),
  ]);

  const declaredOutcomes = buildDeclaredOutcomesRegistry(curriculum);
  const outcomeMetaMap = new Map(declaredOutcomes.map((o) => [o.id, o]));

  const dueReviews: ReviewItemView[] = [];
  const upcomingReviews: ReviewItemView[] = [];

  // Start of today (00:00:00 local time relative to `now`)
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  let completedTodayCount = 0;

  for (const record of schedules) {
    const meta = outcomeMetaMap.get(record.outcomeId);
    const isDue = isScheduleDue(record.dueAt, now);
    const daysRemaining = calculateDaysRemaining(record.dueAt, now);

    if (record.lastReviewedAt && new Date(record.lastReviewedAt) >= startOfToday) {
      completedTodayCount++;
    }

    const itemView: ReviewItemView = {
      outcomeId: record.outcomeId,
      text: meta?.text || `Sasaran ${record.outcomeId}`,
      description: meta?.description,
      moduleId: meta?.moduleId || "",
      moduleSlug: meta?.moduleSlug || "",
      moduleTitle: meta?.moduleTitle || "Modul Jaringan",
      pathSlug: meta?.pathSlug || "network-foundations",
      pathTitle: meta?.pathTitle || "Fondasi Jaringan",
      lessonId: meta?.lessonId,
      lessonSlug: meta?.lessonSlug,
      lessonTitle: meta?.lessonTitle,
      dueAt: record.dueAt.toISOString(),
      intervalDays: record.intervalDays,
      consecutiveSuccesses: record.consecutiveSuccesses,
      daysRemaining,
      isDue,
      lastReviewedAt: record.lastReviewedAt?.toISOString() || null,
    };

    if (isDue) {
      dueReviews.push(itemView);
    } else {
      upcomingReviews.push(itemView);
    }
  }

  return {
    dueReviews,
    upcomingReviews,
    stats: {
      dueCount: dueReviews.length,
      completedTodayCount,
      totalTrackedCount: schedules.length,
    },
  };
}

/**
 * Server-authoritative evaluation and submission of a review rating.
 * Idempotent: rejects duplicate rapid updates within 3 seconds.
 */
export async function rateOutcomeReview(
  userId: string,
  input: {
    outcomeId: string;
    rating: ReviewRating;
    clientRequestId?: string;
  },
  now: Date = new Date()
): Promise<ReviewItemView> {
  const existing = await prisma.reviewSchedule.findUnique({
    where: {
      userId_outcomeId: {
        userId,
        outcomeId: input.outcomeId,
      },
    },
  });

  const currentSchedule: ReviewScheduleState = existing
    ? {
        outcomeId: existing.outcomeId,
        dueAt: existing.dueAt,
        intervalDays: existing.intervalDays,
        consecutiveSuccesses: existing.consecutiveSuccesses,
        lastReviewedAt: existing.lastReviewedAt,
      }
    : calculateInitialSchedule(input.outcomeId, { now });

  // Idempotency: If last reviewed less than 3 seconds ago, return current without double mutation
  if (
    currentSchedule.lastReviewedAt &&
    Math.abs(now.getTime() - new Date(currentSchedule.lastReviewedAt).getTime()) < 3000
  ) {
    const curriculum = await getCurriculumGraph();
    const declaredOutcomes = buildDeclaredOutcomesRegistry(curriculum);
    const meta = declaredOutcomes.find((o) => o.id === input.outcomeId);

    return {
      outcomeId: currentSchedule.outcomeId,
      text: meta?.text || `Sasaran ${currentSchedule.outcomeId}`,
      description: meta?.description,
      moduleId: meta?.moduleId || "",
      moduleSlug: meta?.moduleSlug || "",
      moduleTitle: meta?.moduleTitle || "Modul Jaringan",
      pathSlug: meta?.pathSlug || "network-foundations",
      pathTitle: meta?.pathTitle || "Fondasi Jaringan",
      lessonId: meta?.lessonId,
      lessonSlug: meta?.lessonSlug,
      lessonTitle: meta?.lessonTitle,
      dueAt: currentSchedule.dueAt.toISOString(),
      intervalDays: currentSchedule.intervalDays,
      consecutiveSuccesses: currentSchedule.consecutiveSuccesses,
      daysRemaining: calculateDaysRemaining(currentSchedule.dueAt, now),
      isDue: isScheduleDue(currentSchedule.dueAt, now),
      lastReviewedAt: currentSchedule.lastReviewedAt.toISOString(),
    };
  }

  const next = calculateNextSchedule(currentSchedule, input.rating, now);

  const updated = await prisma.reviewSchedule.upsert({
    where: {
      userId_outcomeId: {
        userId,
        outcomeId: input.outcomeId,
      },
    },
    create: {
      userId,
      outcomeId: next.outcomeId,
      dueAt: next.dueAt,
      intervalDays: next.intervalDays,
      consecutiveSuccesses: next.consecutiveSuccesses,
      lastReviewedAt: next.lastReviewedAt,
    },
    update: {
      dueAt: next.dueAt,
      intervalDays: next.intervalDays,
      consecutiveSuccesses: next.consecutiveSuccesses,
      lastReviewedAt: next.lastReviewedAt,
    },
  });

  const curriculum = await getCurriculumGraph();
  const declaredOutcomes = buildDeclaredOutcomesRegistry(curriculum);
  const meta = declaredOutcomes.find((o) => o.id === input.outcomeId);

  return {
    outcomeId: updated.outcomeId,
    text: meta?.text || `Sasaran ${updated.outcomeId}`,
    description: meta?.description,
    moduleId: meta?.moduleId || "",
    moduleSlug: meta?.moduleSlug || "",
    moduleTitle: meta?.moduleTitle || "Modul Jaringan",
    pathSlug: meta?.pathSlug || "network-foundations",
    pathTitle: meta?.pathTitle || "Fondasi Jaringan",
    lessonId: meta?.lessonId,
    lessonSlug: meta?.lessonSlug,
    lessonTitle: meta?.lessonTitle,
    dueAt: updated.dueAt.toISOString(),
    intervalDays: updated.intervalDays,
    consecutiveSuccesses: updated.consecutiveSuccesses,
    daysRemaining: calculateDaysRemaining(updated.dueAt, now),
    isDue: isScheduleDue(updated.dueAt, now),
    lastReviewedAt: updated.lastReviewedAt?.toISOString() || null,
  };
}

/**
 * Returns due review items formatted for the learning continuation queue.
 */
export async function getLearnerDueReviewItems(
  userId: string,
  now: Date = new Date()
): Promise<ReviewQueueInput[]> {
  const session = await getLearnerReviewSession(userId, now);

  return session.dueReviews.map((item) => ({
    outcomeId: item.outcomeId,
    text: item.text,
    moduleTitle: item.moduleTitle,
    pathTitle: item.pathTitle,
    pathSlug: item.pathSlug,
    moduleSlug: item.moduleSlug,
    lessonSlug: item.lessonSlug,
    href: `/learn/review?outcome=${encodeURIComponent(item.outcomeId)}`,
    reason: `Review terjadwal untuk memperkuat penguasaan kompetensi`,
  }));
}
