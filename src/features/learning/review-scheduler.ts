/**
 * Deterministic Spaced-Review Scheduler Engine
 *
 * Provides pure, deterministic interval calculations for learner review schedules.
 * Principles:
 * 1. Non-black-box: Uses documented, discrete interval tables instead of opaque floating-point decay.
 * 2. Injected clock: Every time calculation accepts an optional `now: Date` parameter for 100% testability.
 * 3. Zero mutation: All calculations return new state instances.
 */

export type ReviewRating = "AGAIN" | "HARD" | "GOOD";

export interface ReviewScheduleState {
  outcomeId: string;
  dueAt: Date;
  intervalDays: number;
  consecutiveSuccesses: number;
  lastReviewedAt?: Date | null;
}

export const REVIEW_INTERVAL_TABLE = {
  AGAIN_INTERVAL: 1,
  HARD_STEPS: [1, 2, 4, 7, 14, 21] as const,
  GOOD_STEPS: [1, 3, 7, 14, 30, 60] as const,
} as const;

/**
 * Adds integer days to a date safely.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculates initial review schedule upon outcome mastery.
 */
export function calculateInitialSchedule(
  outcomeId: string,
  options?: {
    masteredAt?: Date;
    now?: Date;
  }
): ReviewScheduleState {
  const now = options?.now ?? new Date();
  const baseDate = options?.masteredAt ?? now;

  return {
    outcomeId,
    dueAt: addDays(baseDate, REVIEW_INTERVAL_TABLE.AGAIN_INTERVAL),
    intervalDays: REVIEW_INTERVAL_TABLE.AGAIN_INTERVAL,
    consecutiveSuccesses: 0,
    lastReviewedAt: null,
  };
}

/**
 * Computes the next review schedule state after learner recall rating.
 */
export function calculateNextSchedule(
  current: ReviewScheduleState,
  rating: ReviewRating,
  now: Date = new Date()
): ReviewScheduleState {
  if (rating === "AGAIN") {
    const intervalDays = REVIEW_INTERVAL_TABLE.AGAIN_INTERVAL;
    return {
      outcomeId: current.outcomeId,
      dueAt: addDays(now, intervalDays),
      intervalDays,
      consecutiveSuccesses: 0,
      lastReviewedAt: now,
    };
  }

  const nextSuccesses = current.consecutiveSuccesses + 1;

  if (rating === "HARD") {
    const steps = REVIEW_INTERVAL_TABLE.HARD_STEPS;
    const index = Math.min(nextSuccesses - 1, steps.length - 1);
    const intervalDays = steps[index];

    return {
      outcomeId: current.outcomeId,
      dueAt: addDays(now, intervalDays),
      intervalDays,
      consecutiveSuccesses: nextSuccesses,
      lastReviewedAt: now,
    };
  }

  // GOOD rating
  const steps = REVIEW_INTERVAL_TABLE.GOOD_STEPS;
  const index = Math.min(nextSuccesses - 1, steps.length - 1);
  const intervalDays = steps[index];

  return {
    outcomeId: current.outcomeId,
    dueAt: addDays(now, intervalDays),
    intervalDays,
    consecutiveSuccesses: nextSuccesses,
    lastReviewedAt: now,
  };
}

/**
 * Evaluates whether a schedule is currently due.
 */
export function isScheduleDue(dueAt: Date, now: Date = new Date()): boolean {
  return dueAt.getTime() <= now.getTime();
}

/**
 * Calculates calendar days remaining until review is due.
 * Returns 0 if already due or overdue.
 */
export function calculateDaysRemaining(dueAt: Date, now: Date = new Date()): number {
  if (isScheduleDue(dueAt, now)) {
    return 0;
  }
  const diffMs = dueAt.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
