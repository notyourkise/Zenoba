import type { DeclaredOutcome } from "@/features/learning/mastery";
import { isAnalyticsLearner } from "@/features/analytics/cohort";

export const MIN_COHORT_SIZE = 5;

export interface RawAssessmentRecord {
  id: string;
  userId: string;
  userRole?: string;
  assessmentId: string;
  moduleId?: string | null;
  lessonId?: string | null;
  version: string;
  score: number;
  passed: boolean;
  createdAt: Date | string;
}

export type AssessmentHealth = {
  assessmentId: string;
  outcomeId: string;
  outcomeText?: string;
  moduleId?: string;
  moduleSlug?: string;
  moduleTitle?: string;
  lessonId?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  contentVersion: string;
  attemptCount: number;
  distinctLearners: number;
  firstAttemptPassRate: number | null;
  retryPassRate: number | null;
  medianAttemptsToPass: number | null;
  failureRate: number | null;
  isSuppressed: boolean;
  suppressionReason: "COHORT_TOO_SMALL" | null;
};

export type AssessmentAnalyticsSummary = {
  totalAssessments: number;
  totalAttempts: number;
  healthyCount: number;
  needsReviewCount: number;
  suppressedCount: number;
  items: AssessmentHealth[];
};

/**
 * Calculates deterministic median of a numbers array.
 * Returns null if the array is empty.
 */
export function calculateMedian(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

/**
 * Filters raw assessment records to standard learners only,
 * excluding internal test accounts (INTERNAL_LEARNER) and operators (DEVELOPER).
 */
export function filterAnalyticsCohort(records: RawAssessmentRecord[]): RawAssessmentRecord[] {
  return records.filter((r) => isAnalyticsLearner(r.userRole ?? "LEARNER"));
}

/**
 * Aggregates assessment records into privacy-safe AssessmentHealth metrics.
 * - Suppresses tiny cohorts (distinct learners < MIN_COHORT_SIZE) to protect individual identity (k-anonymity).
 * - Never includes individual user answers, options, or PII.
 * - Distinguishes content versions so curriculum revisions don't conflate difficulty metrics.
 */
export function aggregateAssessmentHealth(
  attempts: RawAssessmentRecord[],
  declaredOutcomes: DeclaredOutcome[],
  options?: { minCohortSize?: number }
): AssessmentHealth[] {
  const minCohort = options?.minCohortSize ?? MIN_COHORT_SIZE;
  const filtered = filterAnalyticsCohort(attempts);

  // Group by assessmentId and version
  const groupMap = new Map<string, RawAssessmentRecord[]>();
  for (const record of filtered) {
    const key = `${record.assessmentId}:::${record.version}`;
    const existing = groupMap.get(key) || [];
    existing.push(record);
    groupMap.set(key, existing);
  }

  const results: AssessmentHealth[] = [];

  for (const [key, records] of groupMap.entries()) {
    const [assessmentId, version] = key.split(":::");

    // Find mapped outcome(s)
    const matchingOutcomes = declaredOutcomes.filter((o) =>
      o.assessmentItemIds?.includes(assessmentId) || o.id === assessmentId
    );

    const targetOutcome = matchingOutcomes[0];

    // Group attempts by learner
    const learnerAttempts = new Map<string, RawAssessmentRecord[]>();
    for (const r of records) {
      const existing = learnerAttempts.get(r.userId) || [];
      existing.push(r);
      learnerAttempts.set(r.userId, existing);
    }

    const distinctLearners = learnerAttempts.size;
    const attemptCount = records.length;

    let firstAttemptPassCount = 0;
    let retriersCount = 0;
    let retriersPassedCount = 0;
    const attemptsToPassList: number[] = [];

    for (const [, userRecords] of learnerAttempts.entries()) {
      // Sort chronologically
      const sorted = [...userRecords].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const firstAttempt = sorted[0];
      const passedFirst = Boolean(firstAttempt.passed);

      if (passedFirst) {
        firstAttemptPassCount++;
      } else {
        // Failed on attempt 1: check if retried
        if (sorted.length > 1) {
          retriersCount++;
          const subsequentPassed = sorted.slice(1).some((a) => a.passed);
          if (subsequentPassed) {
            retriersPassedCount++;
          }
        }
      }

      // Check if eventually passed to compute attempts to pass
      const firstPassingIndex = sorted.findIndex((a) => a.passed);
      if (firstPassingIndex !== -1) {
        attemptsToPassList.push(firstPassingIndex + 1);
      }
    }

    const isSuppressed = distinctLearners < minCohort;

    let firstAttemptPassRate: number | null = null;
    let retryPassRate: number | null = null;
    let medianAttemptsToPass: number | null = null;
    let failureRate: number | null = null;

    if (!isSuppressed && distinctLearners > 0) {
      firstAttemptPassRate = Math.round((firstAttemptPassCount / distinctLearners) * 100) / 100;
      failureRate = Math.round((1 - firstAttemptPassRate) * 100) / 100;

      if (retriersCount > 0) {
        retryPassRate = Math.round((retriersPassedCount / retriersCount) * 100) / 100;
      }

      if (attemptsToPassList.length > 0) {
        medianAttemptsToPass = calculateMedian(attemptsToPassList);
      }
    }

    results.push({
      assessmentId,
      outcomeId: targetOutcome?.id ?? assessmentId,
      outcomeText: targetOutcome?.text,
      moduleId: targetOutcome?.moduleId ?? records[0]?.moduleId ?? undefined,
      moduleSlug: targetOutcome?.moduleSlug,
      moduleTitle: targetOutcome?.moduleTitle,
      lessonId: targetOutcome?.lessonId ?? records[0]?.lessonId ?? undefined,
      lessonSlug: targetOutcome?.lessonSlug,
      lessonTitle: targetOutcome?.lessonTitle,
      contentVersion: version,
      attemptCount,
      distinctLearners,
      firstAttemptPassRate,
      retryPassRate,
      medianAttemptsToPass,
      failureRate,
      isSuppressed,
      suppressionReason: isSuppressed ? "COHORT_TOO_SMALL" : null,
    });
  }

  // Sort by module / assessmentId
  return results.sort((a, b) => {
    if (a.contentVersion !== b.contentVersion) {
      return a.contentVersion.localeCompare(b.contentVersion);
    }
    return a.assessmentId.localeCompare(b.assessmentId);
  });
}

/**
 * Summarizes assessment health metrics for developer overview panels.
 */
export function summarizeAssessmentHealth(items: AssessmentHealth[]): AssessmentAnalyticsSummary {
  const totalAssessments = items.length;
  const totalAttempts = items.reduce((acc, item) => acc + item.attemptCount, 0);

  const healthyCount = items.filter(
    (item) => !item.isSuppressed && item.firstAttemptPassRate !== null && item.firstAttemptPassRate >= 0.7
  ).length;

  const needsReviewCount = items.filter(
    (item) => !item.isSuppressed && item.firstAttemptPassRate !== null && item.firstAttemptPassRate < 0.5
  ).length;

  const suppressedCount = items.filter((item) => item.isSuppressed).length;

  return {
    totalAssessments,
    totalAttempts,
    healthyCount,
    needsReviewCount,
    suppressedCount,
    items,
  };
}
