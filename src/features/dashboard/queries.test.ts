import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardContinuationData } from "./queries";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learningPath: {
      findMany: vi.fn(),
    },
    userLessonProgress: {
      findMany: vi.fn(),
    },
    assessmentAttempt: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/learning/queries", () => ({
  getCurriculumGraph: vi.fn(),
}));

vi.mock("@/features/learning/remediation-queries", () => ({
  getLearnerRemediationPlan: vi.fn().mockResolvedValue({
    totalNeedsReviewOutcomes: 0,
    totalRemediationLessons: 0,
    lessons: [],
  }),
}));

vi.mock("@/features/learning/review-service", () => ({
  getLearnerDueReviewItems: vi.fn().mockResolvedValue([]),
}));

import { prisma } from "@/lib/db/client";
import { getCurriculumGraph } from "@/features/learning/queries";

const mockGetCurriculumGraph = vi.mocked(getCurriculumGraph);
const mockProgressFindMany = prisma.userLessonProgress
  .findMany as unknown as ReturnType<typeof vi.fn>;
const mockAttemptFindMany = prisma.assessmentAttempt
  .findMany as unknown as ReturnType<typeof vi.fn>;

const mockCurriculumGraph = {
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
          assessmentId: "assessment-welcome",
          lessons: [
            {
              id: "les-1",
              slug: "intro-to-networking",
              title: "Apa Itu Jaringan Komputer?",
              orderIndex: 0,
              prerequisiteLessonIds: [],
            },
            {
              id: "les-2",
              slug: "network-devices",
              title: "Perangkat Jaringan",
              orderIndex: 1,
              prerequisiteLessonIds: ["les-1"],
            },
          ],
        },
      ],
    },
  ],
};

describe("getDashboardContinuationData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurriculumGraph.mockResolvedValue(mockCurriculumGraph);
  });

  it("returns initial next lesson when userId is null/undefined", async () => {
    const data = await getDashboardContinuationData(null);

    expect(data.primaryAction).not.toBeNull();
    expect(data.primaryAction?.kind).toBe("NEXT_LESSON");
    expect(data.primaryAction?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/intro-to-networking"
    );
    expect(data.isComplete).toBe(false);
  });

  it("prioritizes RESUME when user has an in-progress lesson", async () => {
    mockProgressFindMany.mockResolvedValue([
      { lessonId: "les-1", status: "IN_PROGRESS" },
    ]);
    mockAttemptFindMany.mockResolvedValue([]);

    const data = await getDashboardContinuationData("user-1");

    expect(data.primaryAction?.kind).toBe("RESUME");
    expect(data.primaryAction?.title).toBe("Apa Itu Jaringan Komputer?");
    expect(data.primaryAction?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/intro-to-networking"
    );
  });

  it("prioritizes REMEDIATION over in-progress lessons when assessment has failed", async () => {
    mockProgressFindMany.mockResolvedValue([
      { lessonId: "les-1", status: "COMPLETED" },
      { lessonId: "les-2", status: "IN_PROGRESS" },
    ]);
    mockAttemptFindMany.mockResolvedValue([
      {
        moduleId: "mod-1",
        assessmentId: "assessment-welcome",
        passed: false,
        score: 60,
        createdAt: new Date("2026-09-10T10:00:00Z"),
      },
    ]);

    const data = await getDashboardContinuationData("user-1");

    expect(data.primaryAction?.kind).toBe("REMEDIATION");
    expect(data.primaryAction?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/assessment"
    );
    expect(data.queue[0].kind).toBe("REMEDIATION");
    expect(data.queue[1].kind).toBe("RESUME");
  });

  it("suggests ASSESSMENT when all module lessons are completed", async () => {
    mockProgressFindMany.mockResolvedValue([
      { lessonId: "les-1", status: "COMPLETED" },
      { lessonId: "les-2", status: "COMPLETED" },
    ]);
    mockAttemptFindMany.mockResolvedValue([]);

    const data = await getDashboardContinuationData("user-1");

    expect(data.primaryAction?.kind).toBe("ASSESSMENT");
    expect(data.primaryAction?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/assessment"
    );
  });

  it("returns isComplete: true and empty queue when all lessons are completed and assessment passed", async () => {
    mockProgressFindMany.mockResolvedValue([
      { lessonId: "les-1", status: "COMPLETED" },
      { lessonId: "les-2", status: "COMPLETED" },
    ]);
    mockAttemptFindMany.mockResolvedValue([
      {
        moduleId: "mod-1",
        assessmentId: "assessment-welcome",
        passed: true,
        score: 100,
        createdAt: new Date("2026-09-10T10:00:00Z"),
      },
    ]);

    const data = await getDashboardContinuationData("user-1");

    expect(data.isComplete).toBe(true);
    expect(data.queue).toHaveLength(0);
    expect(data.primaryAction).toBeNull();
  });
});
