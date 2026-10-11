import { describe, expect, it, vi, beforeEach } from "vitest";
import { getDeveloperOverview, getAssessmentAnalyticsOverview } from "./queries";
import { prisma } from "@/lib/db/client";
import { requireDeveloperActor } from "@/lib/auth";
import { AuthorizationError } from "@/features/authorization/types";
import { UserRole } from "@/generated/prisma/client";

vi.mock("@/lib/auth", () => ({
  requireDeveloperActor: vi.fn(),
}));

vi.mock("@/features/learning/queries", () => ({
  getCurriculumGraph: vi.fn().mockResolvedValue({
    paths: [
      {
        id: "p1",
        slug: "networking",
        title: "Jaringan",
        modules: [
          {
            id: "m1",
            slug: "mod-1",
            title: "Modul 1",
            lessons: [{ id: "l1", slug: "les-1", title: "Pelajaran 1" }],
          },
        ],
      },
    ],
  }),
}));

vi.mock("@/features/learning/mastery-queries", () => ({
  buildDeclaredOutcomesRegistry: vi.fn().mockReturnValue([
    {
      id: "out-1",
      text: "Outcome 1",
      moduleId: "m1",
      moduleSlug: "mod-1",
      moduleTitle: "Modul 1",
      pathId: "p1",
      pathSlug: "networking",
      pathTitle: "Jaringan",
      assessmentItemIds: ["quiz-1"],
    },
  ]),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      count: vi.fn(),
    },
    learningPath: {
      count: vi.fn(),
    },
    module: {
      count: vi.fn(),
    },
    lesson: {
      count: vi.fn(),
    },
    assessmentAttempt: {
      findMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

describe("Developer Overview Read Model (getDeveloperOverview)", () => {
  const mockDeveloperActor = {
    id: "dev-1",
    email: "dev@zenoba.tech",
    name: "Developer One",
    role: UserRole.DEVELOPER,
    authVersion: 1,
    twoFactorEnabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws AuthorizationError when caller is not an authorized developer", async () => {
    vi.mocked(requireDeveloperActor).mockRejectedValueOnce(
      new AuthorizationError("FORBIDDEN", "Developer workspace access required")
    );

    await expect(getDeveloperOverview()).rejects.toThrow(
      "Developer workspace access required"
    );
  });

  it("returns overview metrics excluding internal learners from ordinary metrics", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

    // Mock count calls:
    // 1. ordinaryLearners
    // 2. internalLearners
    // 3. newLearners7d
    // 4. newLearners30d
    // 5. activeLearners7d
    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(150) // ordinaryLearners
      .mockResolvedValueOnce(5)   // internalLearners
      .mockResolvedValueOnce(20)  // newLearners7d
      .mockResolvedValueOnce(45)  // newLearners30d
      .mockResolvedValueOnce(35); // activeLearners7d

    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ "?column?": 1 }]);
    vi.mocked(prisma.learningPath.count).mockResolvedValueOnce(6);
    vi.mocked(prisma.module.count).mockResolvedValueOnce(31);
    vi.mocked(prisma.lesson.count).mockResolvedValueOnce(65);

    const fixedNow = new Date("2026-09-13T00:00:00.000Z");
    const overview = await getDeveloperOverview(fixedNow);

    expect(overview.ordinaryLearners).toBe(150);
    expect(overview.internalLearners).toBe(5);
    expect(overview.newLearners7d).toBe(20);
    expect(overview.newLearners30d).toBe(45);
    expect(overview.activeLearners7d).toBe(35);
    expect(overview.database.status).toBe("healthy");
    expect(typeof overview.database.latencyMs).toBe("number");
    expect(overview.curriculum.paths).toBe(6);
    expect(overview.curriculum.modules).toBe(31);
    expect(overview.curriculum.lessons).toBe(65);
    expect(overview.curriculum.assessments).toBe(6);
    expect(overview.curriculum.capstones).toBe(6);

    // Verify first count call uses ORDINARY_LEARNER_FILTER (role: "LEARNER")
    expect(vi.mocked(prisma.user.count)).toHaveBeenNthCalledWith(1, {
      where: { role: "LEARNER" },
    });
    // Verify second count call uses role: "INTERNAL_LEARNER"
    expect(vi.mocked(prisma.user.count)).toHaveBeenNthCalledWith(2, {
      where: { role: "INTERNAL_LEARNER" },
    });
  });

  it("handles database latency query failure gracefully with degraded status", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(4);

    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error("Connection timeout"));
    vi.mocked(prisma.learningPath.count).mockResolvedValueOnce(6);
    vi.mocked(prisma.module.count).mockResolvedValueOnce(31);
    vi.mocked(prisma.lesson.count).mockResolvedValueOnce(65);

    const overview = await getDeveloperOverview();

    expect(overview.database.status).toBe("degraded");
    expect(overview.database.latencyMs).toBeNull();
  });

  it("never includes sensitive user fields in the overview output", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
    vi.mocked(prisma.user.count).mockResolvedValue(0);
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([]);
    vi.mocked(prisma.learningPath.count).mockResolvedValueOnce(6);
    vi.mocked(prisma.module.count).mockResolvedValueOnce(31);
    vi.mocked(prisma.lesson.count).mockResolvedValueOnce(65);

    const overview = await getDeveloperOverview();
    const serialized = JSON.stringify(overview);

    expect(serialized).not.toContain("passwordHash");
    expect(serialized).not.toContain("twoFactorSecret");
    expect(serialized).not.toContain("twoFactorBackupCodes");
    expect(serialized).not.toContain("tokenHash");
  });
});

describe("Assessment Analytics Query (getAssessmentAnalyticsOverview)", () => {
  const mockDeveloperActor = {
    id: "dev-1",
    email: "dev@zenoba.tech",
    name: "Developer One",
    role: UserRole.DEVELOPER,
    authVersion: 1,
    twoFactorEnabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws AuthorizationError when caller is not an authorized developer", async () => {
    vi.mocked(requireDeveloperActor).mockRejectedValueOnce(
      new AuthorizationError("FORBIDDEN", "Developer workspace access required")
    );

    await expect(getAssessmentAnalyticsOverview()).rejects.toThrow(
      "Developer workspace access required"
    );
  });

  it("filters ordinary learners, excludes sensitive answers, and returns aggregated analytics", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

    // Mock 5 attempts from 5 distinct ordinary learners
    const mockAttempts = [
      {
        id: "att-1",
        userId: "u1",
        assessmentId: "quiz-1",
        moduleId: "m1",
        lessonId: "l1",
        version: "1.0",
        score: 100,
        passed: true,
        createdAt: new Date("2026-09-01T10:00:00Z"),
      },
      {
        id: "att-2",
        userId: "u2",
        assessmentId: "quiz-1",
        moduleId: "m1",
        lessonId: "l1",
        version: "1.0",
        score: 90,
        passed: true,
        createdAt: new Date("2026-09-01T10:00:00Z"),
      },
      {
        id: "att-3",
        userId: "u3",
        assessmentId: "quiz-1",
        moduleId: "m1",
        lessonId: "l1",
        version: "1.0",
        score: 80,
        passed: true,
        createdAt: new Date("2026-09-01T10:00:00Z"),
      },
      {
        id: "att-4",
        userId: "u4",
        assessmentId: "quiz-1",
        moduleId: "m1",
        lessonId: "l1",
        version: "1.0",
        score: 85,
        passed: true,
        createdAt: new Date("2026-09-01T10:00:00Z"),
      },
      {
        id: "att-5",
        userId: "u5",
        assessmentId: "quiz-1",
        moduleId: "m1",
        lessonId: "l1",
        version: "1.0",
        score: 75,
        passed: true,
        createdAt: new Date("2026-09-01T10:00:00Z"),
      },
    ];

    vi.mocked(prisma.assessmentAttempt.findMany).mockResolvedValueOnce(
      mockAttempts as unknown as Awaited<ReturnType<typeof prisma.assessmentAttempt.findMany>>
    );

    const result = await getAssessmentAnalyticsOverview();

    expect(prisma.assessmentAttempt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          user: { role: "LEARNER" },
        }),
      })
    );

    expect(result.totalAssessments).toBe(1);
    expect(result.totalAttempts).toBe(5);
    expect(result.healthyCount).toBe(1);
    expect(result.suppressedCount).toBe(0);

    const first = result.items[0];
    expect(first.assessmentId).toBe("quiz-1");
    expect(first.firstAttemptPassRate).toBe(1.0);
    expect(first.isSuppressed).toBe(false);

    // Verify answersJson is never present
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("answersJson");
  });
});
