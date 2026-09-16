import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ensureMasteredOutcomesScheduled,
  getLearnerReviewSession,
  rateOutcomeReview,
  getLearnerDueReviewItems,
} from "./review-service";
import { prisma } from "@/lib/db/client";
import { getCurriculumGraph } from "./queries";
import { getLearnerMasteryOverview } from "./mastery-queries";
import type { LearningGraph } from "./continuation";
import type { DeclaredOutcome } from "./mastery";
import type { ReviewSchedule } from "@/generated/prisma/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    reviewSchedule: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("./queries", () => ({
  getCurriculumGraph: vi.fn(),
}));

vi.mock("./mastery-queries", () => ({
  getLearnerMasteryOverview: vi.fn(),
  buildDeclaredOutcomesRegistry: vi.fn(),
}));

describe("Review Service Integration & Idempotency (Sprint 39 / Task 39.1)", () => {
  const fixedNow = new Date("2026-09-16T10:00:00.000Z");

  const mockCurriculum: LearningGraph = {
    paths: [
      {
        id: "path-1",
        slug: "network-foundations",
        title: "Network Foundations",
        orderIndex: 0,
        modules: [
          {
            id: "mod-1",
            slug: "welcome-to-networking",
            title: "Welcome to Networking",
            orderIndex: 0,
            lessons: [
              {
                id: "les-1",
                slug: "orientasi-platform",
                title: "Orientasi Platform",
                orderIndex: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  const mockDeclaredOutcomes: DeclaredOutcome[] = [
    {
      id: "PLAN-L1-A",
      text: "Memahami konsep dasar jaringan",
      description: "Menjelaskan fungsi dan peran jaringan komputer",
      moduleId: "mod-1",
      moduleSlug: "welcome-to-networking",
      moduleTitle: "Welcome to Networking",
      pathId: "path-1",
      pathSlug: "network-foundations",
      pathTitle: "Network Foundations",
      lessonId: "les-1",
      lessonSlug: "orientasi-platform",
      lessonTitle: "Orientasi Platform",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurriculumGraph).mockResolvedValue(mockCurriculum);
  });

  describe("ensureMasteredOutcomesScheduled", () => {
    it("creates review schedule for mastered outcomes that do not exist yet", async () => {
      vi.mocked(getLearnerMasteryOverview).mockResolvedValue({
        totalOutcomes: 1,
        masteredCount: 1,
        needsReviewCount: 0,
        inProgressCount: 0,
        notStartedCount: 0,
        masteryPercentage: 100,
        modules: [
          {
            moduleId: "mod-1",
            moduleSlug: "welcome-to-networking",
            moduleTitle: "Welcome to Networking",
            pathId: "path-1",
            pathSlug: "network-foundations",
            pathTitle: "Network Foundations",
            totalOutcomes: 1,
            masteredCount: 1,
            needsReviewCount: 0,
            inProgressCount: 0,
            notStartedCount: 0,
            outcomes: [
              {
                outcomeId: "PLAN-L1-A",
                text: "Memahami konsep dasar jaringan",
                state: "MASTERED",
                pathId: "path-1",
                pathSlug: "network-foundations",
                pathTitle: "Network Foundations",
                moduleId: "mod-1",
                moduleSlug: "welcome-to-networking",
                moduleTitle: "Welcome to Networking",
                latestAttemptAt: new Date("2026-09-15T08:00:00.000Z"),
                evidenceVersion: "1.0",
                remediationLessonIds: [],
              },
            ],
          },
        ],
      });

      vi.mocked(prisma.reviewSchedule.findMany).mockResolvedValue([]);
      vi.mocked(prisma.reviewSchedule.create).mockResolvedValue({} as unknown as ReviewSchedule);

      await ensureMasteredOutcomesScheduled("user-1", fixedNow);

      expect(prisma.reviewSchedule.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-1",
          outcomeId: "PLAN-L1-A",
          intervalDays: 1,
          consecutiveSuccesses: 0,
        }),
      });
    });

    it("does not create duplicates if schedule already exists", async () => {
      vi.mocked(getLearnerMasteryOverview).mockResolvedValue({
        totalOutcomes: 1,
        masteredCount: 1,
        needsReviewCount: 0,
        inProgressCount: 0,
        notStartedCount: 0,
        masteryPercentage: 100,
        modules: [
          {
            moduleId: "mod-1",
            moduleSlug: "welcome-to-networking",
            moduleTitle: "Welcome to Networking",
            pathId: "path-1",
            pathSlug: "network-foundations",
            pathTitle: "Network Foundations",
            totalOutcomes: 1,
            masteredCount: 1,
            needsReviewCount: 0,
            inProgressCount: 0,
            notStartedCount: 0,
            outcomes: [
              {
                outcomeId: "PLAN-L1-A",
                text: "Memahami konsep dasar jaringan",
                state: "MASTERED",
                pathId: "path-1",
                pathSlug: "network-foundations",
                pathTitle: "Network Foundations",
                moduleId: "mod-1",
                moduleSlug: "welcome-to-networking",
                moduleTitle: "Welcome to Networking",
                latestAttemptAt: null,
                evidenceVersion: "1.0",
                remediationLessonIds: [],
              },
            ],
          },
        ],
      });

      vi.mocked(prisma.reviewSchedule.findMany).mockResolvedValue([
        { outcomeId: "PLAN-L1-A" } as unknown as ReviewSchedule,
      ]);

      await ensureMasteredOutcomesScheduled("user-1", fixedNow);

      expect(prisma.reviewSchedule.create).not.toHaveBeenCalled();
    });
  });

  describe("getLearnerReviewSession", () => {
    it("partitions schedules into due and upcoming with accurate counts", async () => {
      vi.mocked(getLearnerMasteryOverview).mockResolvedValue({
        totalOutcomes: 0,
        masteredCount: 0,
        needsReviewCount: 0,
        inProgressCount: 0,
        notStartedCount: 0,
        masteryPercentage: 0,
        modules: [],
      });

      const { buildDeclaredOutcomesRegistry } = await import("./mastery-queries");
      vi.mocked(buildDeclaredOutcomesRegistry).mockReturnValue(mockDeclaredOutcomes);

      // 1 due item, 1 upcoming item
      vi.mocked(prisma.reviewSchedule.findMany).mockResolvedValue([
        {
          id: "sched-1",
          userId: "user-1",
          outcomeId: "PLAN-L1-A",
          dueAt: new Date("2026-09-15T10:00:00.000Z"), // Past -> Due
          intervalDays: 1,
          consecutiveSuccesses: 0,
          lastReviewedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "sched-2",
          userId: "user-1",
          outcomeId: "PLAN-L1-B",
          dueAt: new Date("2026-09-20T10:00:00.000Z"), // Future -> Upcoming
          intervalDays: 4,
          consecutiveSuccesses: 2,
          lastReviewedAt: new Date("2026-09-16T08:00:00.000Z"), // Today
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as unknown as ReviewSchedule[]);

      const session = await getLearnerReviewSession("user-1", fixedNow);

      expect(session.dueReviews.length).toBe(1);
      expect(session.dueReviews[0].outcomeId).toBe("PLAN-L1-A");
      expect(session.dueReviews[0].isDue).toBe(true);

      expect(session.upcomingReviews.length).toBe(1);
      expect(session.upcomingReviews[0].outcomeId).toBe("PLAN-L1-B");
      expect(session.upcomingReviews[0].isDue).toBe(false);

      expect(session.stats.dueCount).toBe(1);
      expect(session.stats.completedTodayCount).toBe(1);
      expect(session.stats.totalTrackedCount).toBe(2);
    });
  });

  describe("rateOutcomeReview", () => {
    it("updates schedule server-authoritatively and advances consecutive successes", async () => {
      const { buildDeclaredOutcomesRegistry } = await import("./mastery-queries");
      vi.mocked(buildDeclaredOutcomesRegistry).mockReturnValue(mockDeclaredOutcomes);

      vi.mocked(prisma.reviewSchedule.findUnique).mockResolvedValue({
        id: "sched-1",
        userId: "user-1",
        outcomeId: "PLAN-L1-A",
        dueAt: new Date("2026-09-16T08:00:00.000Z"),
        intervalDays: 1,
        consecutiveSuccesses: 0,
        lastReviewedAt: new Date("2026-09-10T10:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.reviewSchedule.upsert).mockResolvedValue({
        id: "sched-1",
        userId: "user-1",
        outcomeId: "PLAN-L1-A",
        dueAt: new Date("2026-09-19T10:00:00.000Z"), // GOOD -> 3 days
        intervalDays: 3,
        consecutiveSuccesses: 1,
        lastReviewedAt: fixedNow,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await rateOutcomeReview(
        "user-1",
        { outcomeId: "PLAN-L1-A", rating: "GOOD" },
        fixedNow
      );

      expect(result.outcomeId).toBe("PLAN-L1-A");
      expect(result.consecutiveSuccesses).toBe(1);
      expect(result.intervalDays).toBe(3);
      expect(prisma.reviewSchedule.upsert).toHaveBeenCalled();
    });

    it("prevents double-advance when request is repeated within idempotency window", async () => {
      const { buildDeclaredOutcomesRegistry } = await import("./mastery-queries");
      vi.mocked(buildDeclaredOutcomesRegistry).mockReturnValue(mockDeclaredOutcomes);

      // Last reviewed 1 second ago
      const recentReview = new Date(fixedNow.getTime() - 1000);

      vi.mocked(prisma.reviewSchedule.findUnique).mockResolvedValue({
        id: "sched-1",
        userId: "user-1",
        outcomeId: "PLAN-L1-A",
        dueAt: new Date("2026-09-19T10:00:00.000Z"),
        intervalDays: 3,
        consecutiveSuccesses: 1,
        lastReviewedAt: recentReview,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await rateOutcomeReview(
        "user-1",
        { outcomeId: "PLAN-L1-A", rating: "GOOD" },
        fixedNow
      );

      expect(prisma.reviewSchedule.upsert).not.toHaveBeenCalled();
      expect(result.outcomeId).toBe("PLAN-L1-A");
      expect(result.consecutiveSuccesses).toBe(1);
    });
  });

  describe("getLearnerDueReviewItems", () => {
    it("returns due items formatted for learning continuation queue", async () => {
      vi.mocked(getLearnerMasteryOverview).mockResolvedValue({
        totalOutcomes: 0,
        masteredCount: 0,
        needsReviewCount: 0,
        inProgressCount: 0,
        notStartedCount: 0,
        masteryPercentage: 0,
        modules: [],
      });

      const { buildDeclaredOutcomesRegistry } = await import("./mastery-queries");
      vi.mocked(buildDeclaredOutcomesRegistry).mockReturnValue(mockDeclaredOutcomes);

      vi.mocked(prisma.reviewSchedule.findMany).mockResolvedValue([
        {
          id: "sched-1",
          userId: "user-1",
          outcomeId: "PLAN-L1-A",
          dueAt: new Date("2026-09-15T10:00:00.000Z"), // Past -> Due
          intervalDays: 1,
          consecutiveSuccesses: 0,
          lastReviewedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const items = await getLearnerDueReviewItems("user-1", fixedNow);

      expect(items.length).toBe(1);
      expect(items[0]).toEqual({
        outcomeId: "PLAN-L1-A",
        text: "Memahami konsep dasar jaringan",
        moduleTitle: "Welcome to Networking",
        pathTitle: "Network Foundations",
        pathSlug: "network-foundations",
        moduleSlug: "welcome-to-networking",
        lessonSlug: "orientasi-platform",
        href: "/learn/review?outcome=PLAN-L1-A",
        reason: "Review terjadwal untuk memperkuat penguasaan kompetensi",
      });
    });
  });
});
