import { describe, it, expect } from "vitest";
import {
  calculateMedian,
  filterAnalyticsCohort,
  aggregateAssessmentHealth,
  summarizeAssessmentHealth,
  MIN_COHORT_SIZE,
  type RawAssessmentRecord,
} from "./assessment-analytics";
import type { DeclaredOutcome } from "@/features/learning/mastery";

describe("assessment-analytics", () => {
  describe("calculateMedian", () => {
    it("returns null for empty arrays", () => {
      expect(calculateMedian([])).toBeNull();
    });

    it("calculates median for odd-length arrays", () => {
      expect(calculateMedian([3])).toBe(3);
      expect(calculateMedian([5, 1, 3])).toBe(3);
      expect(calculateMedian([9, 1, 2, 4, 7])).toBe(4);
    });

    it("calculates median for even-length arrays", () => {
      expect(calculateMedian([1, 2])).toBe(1.5);
      expect(calculateMedian([10, 20, 30, 40])).toBe(25);
    });
  });

  describe("filterAnalyticsCohort", () => {
    it("includes standard LEARNER role and excludes INTERNAL_LEARNER / DEVELOPER", () => {
      const records: RawAssessmentRecord[] = [
        {
          id: "att-1",
          userId: "user-1",
          userRole: "LEARNER",
          assessmentId: "quiz-net-1",
          version: "1.0",
          score: 80,
          passed: true,
          createdAt: new Date("2026-09-01"),
        },
        {
          id: "att-2",
          userId: "user-internal",
          userRole: "INTERNAL_LEARNER",
          assessmentId: "quiz-net-1",
          version: "1.0",
          score: 100,
          passed: true,
          createdAt: new Date("2026-09-01"),
        },
        {
          id: "att-3",
          userId: "user-dev",
          userRole: "DEVELOPER",
          assessmentId: "quiz-net-1",
          version: "1.0",
          score: 100,
          passed: true,
          createdAt: new Date("2026-09-01"),
        },
      ];

      const filtered = filterAnalyticsCohort(records);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].userId).toBe("user-1");
    });
  });

  describe("aggregateAssessmentHealth", () => {
    const mockOutcomes: DeclaredOutcome[] = [
      {
        id: "out-subnet-1",
        text: "Mampu menghitung subnet mask",
        moduleId: "mod-subnet",
        moduleSlug: "subnetting",
        moduleTitle: "Subnetting Dasar",
        pathId: "path-net",
        pathSlug: "networking",
        pathTitle: "Jaringan Komputer",
        assessmentItemIds: ["quiz-subnet-1"],
      },
    ];

    it("suppresses metrics when cohort size is below MIN_COHORT_SIZE", () => {
      const attempts: RawAssessmentRecord[] = [
        {
          id: "1",
          userId: "u1",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 100,
          passed: true,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
        {
          id: "2",
          userId: "u2",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 80,
          passed: true,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
        {
          id: "3",
          userId: "u3",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 40,
          passed: false,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
        {
          id: "4",
          userId: "u4",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 100,
          passed: true,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
      ];

      expect(attempts.length).toBeLessThan(MIN_COHORT_SIZE);

      const results = aggregateAssessmentHealth(attempts, mockOutcomes);
      expect(results).toHaveLength(1);
      const item = results[0];

      expect(item.assessmentId).toBe("quiz-subnet-1");
      expect(item.outcomeId).toBe("out-subnet-1");
      expect(item.attemptCount).toBe(4);
      expect(item.distinctLearners).toBe(4);
      expect(item.isSuppressed).toBe(true);
      expect(item.suppressionReason).toBe("COHORT_TOO_SMALL");
      expect(item.firstAttemptPassRate).toBeNull();
      expect(item.retryPassRate).toBeNull();
      expect(item.medianAttemptsToPass).toBeNull();
    });

    it("calculates accurate metrics when cohort meets or exceeds MIN_COHORT_SIZE", () => {
      const attempts: RawAssessmentRecord[] = [
        // u1: passed attempt 1 (attempts to pass = 1)
        {
          id: "1",
          userId: "u1",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 100,
          passed: true,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
        // u2: passed attempt 1 (attempts to pass = 1)
        {
          id: "2",
          userId: "u2",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 90,
          passed: true,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
        // u3: failed attempt 1, passed attempt 2 (attempts to pass = 2)
        {
          id: "3a",
          userId: "u3",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 40,
          passed: false,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
        {
          id: "3b",
          userId: "u3",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 80,
          passed: true,
          createdAt: new Date("2026-09-01T11:00:00Z"),
        },
        // u4: failed attempt 1, failed attempt 2, passed attempt 3 (attempts to pass = 3)
        {
          id: "4a",
          userId: "u4",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 30,
          passed: false,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
        {
          id: "4b",
          userId: "u4",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 50,
          passed: false,
          createdAt: new Date("2026-09-01T11:00:00Z"),
        },
        {
          id: "4c",
          userId: "u4",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 85,
          passed: true,
          createdAt: new Date("2026-09-01T12:00:00Z"),
        },
        // u5: failed attempt 1, no retries
        {
          id: "5",
          userId: "u5",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 40,
          passed: false,
          createdAt: new Date("2026-09-01T10:00:00Z"),
        },
      ];

      const results = aggregateAssessmentHealth(attempts, mockOutcomes);
      expect(results).toHaveLength(1);
      const item = results[0];

      expect(item.isSuppressed).toBe(false);
      expect(item.suppressionReason).toBeNull();
      expect(item.attemptCount).toBe(8);
      expect(item.distinctLearners).toBe(5);

      // First attempt pass rate: 2 of 5 passed attempt 1 -> 0.4 (40%)
      expect(item.firstAttemptPassRate).toBe(0.4);

      // Retry pass rate: 2 retried (u3, u4), both passed on retry -> 2/2 = 1.0 (100%)
      expect(item.retryPassRate).toBe(1.0);

      // Attempts to pass: [1, 1, 2, 3] -> median = (1 + 2) / 2 = 1.5
      expect(item.medianAttemptsToPass).toBe(1.5);
    });

    it("separates different content versions to preserve curriculum change analysis", () => {
      const attempts: RawAssessmentRecord[] = [];
      // 5 users on version 1.0
      for (let i = 1; i <= 5; i++) {
        attempts.push({
          id: `v1-${i}`,
          userId: `u${i}`,
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 50,
          passed: false,
          createdAt: new Date("2026-09-01"),
        });
      }
      // 5 users on version 2.0
      for (let i = 6; i <= 10; i++) {
        attempts.push({
          id: `v2-${i}`,
          userId: `u${i}`,
          assessmentId: "quiz-subnet-1",
          version: "2.0",
          score: 90,
          passed: true,
          createdAt: new Date("2026-09-02"),
        });
      }

      const results = aggregateAssessmentHealth(attempts, mockOutcomes);
      expect(results).toHaveLength(2);

      const v1 = results.find((r) => r.contentVersion === "1.0");
      const v2 = results.find((r) => r.contentVersion === "2.0");

      expect(v1).toBeDefined();
      expect(v1?.firstAttemptPassRate).toBe(0);

      expect(v2).toBeDefined();
      expect(v2?.firstAttemptPassRate).toBe(1.0);
    });

    it("strictly preserves learner privacy and never exposes answersJson or PII", () => {
      const attempts: RawAssessmentRecord[] = [
        {
          id: "1",
          userId: "secret-learner-1",
          assessmentId: "quiz-subnet-1",
          version: "1.0",
          score: 100,
          passed: true,
          createdAt: new Date("2026-09-01"),
        },
      ];

      const results = aggregateAssessmentHealth(attempts, mockOutcomes);
      const serialized = JSON.stringify(results);

      expect(serialized).not.toContain("secret-learner-1");
      expect(serialized).not.toContain("answersJson");
      expect(serialized).not.toContain("selectedChoice");
    });
  });

  describe("summarizeAssessmentHealth", () => {
    it("produces high level metrics for developer dashboard", () => {
      const items = [
        {
          assessmentId: "a1",
          outcomeId: "o1",
          contentVersion: "1.0",
          attemptCount: 10,
          distinctLearners: 10,
          firstAttemptPassRate: 0.8,
          retryPassRate: 1.0,
          medianAttemptsToPass: 1,
          failureRate: 0.2,
          isSuppressed: false,
          suppressionReason: null,
        },
        {
          assessmentId: "a2",
          outcomeId: "o2",
          contentVersion: "1.0",
          attemptCount: 20,
          distinctLearners: 10,
          firstAttemptPassRate: 0.3,
          retryPassRate: 0.5,
          medianAttemptsToPass: 3,
          failureRate: 0.7,
          isSuppressed: false,
          suppressionReason: null,
        },
        {
          assessmentId: "a3",
          outcomeId: "o3",
          contentVersion: "1.0",
          attemptCount: 3,
          distinctLearners: 3,
          firstAttemptPassRate: null,
          retryPassRate: null,
          medianAttemptsToPass: null,
          failureRate: null,
          isSuppressed: true,
          suppressionReason: "COHORT_TOO_SMALL" as const,
        },
      ];

      const summary = summarizeAssessmentHealth(items);
      expect(summary.totalAssessments).toBe(3);
      expect(summary.totalAttempts).toBe(33);
      expect(summary.healthyCount).toBe(1); // >= 0.7
      expect(summary.needsReviewCount).toBe(1); // < 0.5
      expect(summary.suppressedCount).toBe(1);
    });
  });
});
