import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLearnerMasteryOverview } from "./mastery-queries";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    assessmentAttempt: {
      findMany: vi.fn(),
    },
    userLessonProgress: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("./queries", () => ({
  getCurriculumGraph: vi.fn(),
}));

import { prisma } from "@/lib/db/client";
import { getCurriculumGraph } from "./queries";
import type { LearningGraph } from "./continuation";

const mockFindManyAttempts = vi.mocked(prisma.assessmentAttempt.findMany);
const mockFindManyProgress = vi.mocked(prisma.userLessonProgress.findMany);
const mockGetCurriculumGraph = vi.mocked(getCurriculumGraph);

describe("getLearnerMasteryOverview", () => {
  const sampleCurriculum: LearningGraph = {
    paths: [
      {
        id: "path-1",
        slug: "network-fundamentals",
        title: "Network Fundamentals",
        orderIndex: 0,
        modules: [
          {
            id: "mod-1",
            slug: "welcome-to-networking",
            title: "Selamat Datang di Dunia Jaringan",
            orderIndex: 0,
            lessons: [
              {
                id: "les-intro",
                slug: "intro-to-networking",
                title: "Pengenalan Jaringan",
                orderIndex: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurriculumGraph.mockResolvedValue(sampleCurriculum);
    mockFindManyAttempts.mockResolvedValue([]);
    mockFindManyProgress.mockResolvedValue([]);
  });

  it("returns clean overview when user has no attempts or progress", async () => {
    const overview = await getLearnerMasteryOverview("user-1");

    expect(overview.totalOutcomes).toBeGreaterThan(0);
    expect(overview.masteredCount).toBe(0);
    expect(overview.needsReviewCount).toBe(0);
    expect(overview.notStartedCount).toBe(overview.totalOutcomes);
    expect(overview.masteryPercentage).toBe(0);
    expect(overview.modules).toHaveLength(1);
    expect(overview.modules[0].moduleSlug).toBe("welcome-to-networking");
  });

  it("calculates mastered outcomes when passed attempts and completed lessons exist", async () => {
    // Lesson progress completed
    mockFindManyProgress.mockResolvedValue([
      {
        lessonId: "les-intro",
        status: "COMPLETED",
        completedAt: new Date(),
      } as never,
    ]);

    // Passed formative assessment
    mockFindManyAttempts.mockResolvedValue([
      {
        id: "att-1",
        userId: "user-1",
        assessmentId: "welcome-quiz-1",
        moduleId: "mod-1",
        lessonId: "les-intro",
        version: "1.0",
        score: 100,
        passed: true,
        createdAt: new Date(),
      } as never,
    ]);

    const overview = await getLearnerMasteryOverview("user-1");

    expect(overview.masteredCount).toBeGreaterThan(0);
    expect(overview.masteryPercentage).toBeGreaterThan(0);
  });
});
