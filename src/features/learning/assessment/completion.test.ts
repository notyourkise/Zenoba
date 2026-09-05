import { describe, expect, it, vi, beforeEach } from "vitest";
import { getLessonCompletionDecision } from "./completion";
import { completeLessonProgress } from "@/features/learning/progress";
import { prisma } from "@/lib/db/client";
import * as xpLedger from "@/features/xp/ledger";
import { AssessmentIncompleteError } from "./errors";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    lesson: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    userLessonProgress: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    assessmentAttempt: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/xp/ledger", () => ({
  awardXp: vi.fn().mockImplementation((userId, amount) =>
    Promise.resolve({ awarded: true, amount, totalXp: amount, message: "OK" })
  ),
  getUserTotalXp: vi.fn().mockResolvedValue(100),
}));

vi.mock("@/features/commerce/access", () => ({
  requireLearningPathAccess: vi.fn().mockResolvedValue(undefined),
}));

describe("Assessment Completion Logic - getLessonCompletionDecision", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws error when lesson does not exist", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce(null);

    await expect(
      getLessonCompletionDecision("user-1", "non-existent")
    ).rejects.toThrow("Materi 'non-existent' tidak ditemukan.");
  });

  it("preserves completed status for legacy completed records (legacy bridge)", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      userProgress: [{ status: "COMPLETED" }],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const decision = await getLessonCompletionDecision("user-1", "intro-to-networking");

    expect(decision.canComplete).toBe(true);
    expect(decision.isAlreadyCompleted).toBe(true);
    expect(prisma.assessmentAttempt.findMany).not.toHaveBeenCalled();
  });

  it("allows completion if lesson has no formative questions defined", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-other-id",
      slug: "some-future-lesson",
      userProgress: [{ status: "IN_PROGRESS" }],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const decision = await getLessonCompletionDecision("user-1", "some-future-lesson");

    expect(decision.canComplete).toBe(true);
    expect(decision.totalRequired).toBe(0);
  });

  it("denies completion when user has 0 of 3 formative questions passed", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      userProgress: [{ status: "IN_PROGRESS" }],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // User has 0 passed attempts
    vi.mocked(prisma.assessmentAttempt.findMany).mockResolvedValueOnce([]);

    const decision = await getLessonCompletionDecision("user-1", "intro-to-networking");

    expect(decision.canComplete).toBe(false);
    expect(decision.totalRequired).toBe(3);
    expect(decision.passedCount).toBe(0);
    expect(decision.missingQuestionIds).toEqual([
      "quiz-wn-l1-q1",
      "quiz-wn-l1-q2",
      "quiz-wn-l1-q3",
    ]);
  });

  it("denies completion when user has passed only 2 of 3 formative questions", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      userProgress: [{ status: "IN_PROGRESS" }],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // Passed q1 and q2, but missing q3
    vi.mocked(prisma.assessmentAttempt.findMany).mockResolvedValueOnce([
      { assessmentId: "quiz-wn-l1-q1" },
      { assessmentId: "quiz-wn-l1-q2" },
    ] as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const decision = await getLessonCompletionDecision("user-1", "intro-to-networking");

    expect(decision.canComplete).toBe(false);
    expect(decision.totalRequired).toBe(3);
    expect(decision.passedCount).toBe(2);
    expect(decision.missingQuestionIds).toEqual(["quiz-wn-l1-q3"]);
  });

  it("allows completion when user has passed all 3 formative questions", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      userProgress: [{ status: "IN_PROGRESS" }],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // Passed all 3 questions
    vi.mocked(prisma.assessmentAttempt.findMany).mockResolvedValueOnce([
      { assessmentId: "quiz-wn-l1-q1" },
      { assessmentId: "quiz-wn-l1-q2" },
      { assessmentId: "quiz-wn-l1-q3" },
    ] as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const decision = await getLessonCompletionDecision("user-1", "intro-to-networking");

    expect(decision.canComplete).toBe(true);
    expect(decision.totalRequired).toBe(3);
    expect(decision.passedCount).toBe(3);
    expect(decision.missingQuestionIds).toEqual([]);
  });
});

describe("Enforce Assessment Gate in completeLessonProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks completeLessonProgress when formative criteria are unmet", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      title: "Pengenalan Jaringan",
      moduleId: "mod-1",
      xpReward: 50,
      module: { path: { slug: "network-foundations" } },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // In getLessonCompletionDecision:
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      userProgress: [{ status: "IN_PROGRESS" }],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // 0 passed attempts
    vi.mocked(prisma.assessmentAttempt.findMany).mockResolvedValueOnce([]);

    await expect(
      completeLessonProgress("user-1", "lesson-1-id")
    ).rejects.toThrow(AssessmentIncompleteError);

    // Upsert and XP award should not be called!
    expect(prisma.userLessonProgress.upsert).not.toHaveBeenCalled();
    expect(xpLedger.awardXp).not.toHaveBeenCalled();
  });

  it("successfully completes lesson when all formative assessments are passed", async () => {
    vi.mocked(prisma.lesson.findUnique).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      title: "Pengenalan Jaringan",
      moduleId: "mod-1",
      xpReward: 50,
      module: { path: { slug: "network-foundations" } },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // In getLessonCompletionDecision:
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      userProgress: [{ status: "IN_PROGRESS" }],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // 3 passed attempts
    vi.mocked(prisma.assessmentAttempt.findMany).mockResolvedValueOnce([
      { assessmentId: "quiz-wn-l1-q1" },
      { assessmentId: "quiz-wn-l1-q2" },
      { assessmentId: "quiz-wn-l1-q3" },
    ] as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    vi.mocked(prisma.userLessonProgress.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.userLessonProgress.upsert).mockResolvedValueOnce({
      id: "prog-1",
      userId: "user-1",
      lessonId: "lesson-1-id",
      status: "COMPLETED",
      completedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const result = await completeLessonProgress("user-1", "lesson-1-id");

    expect(result.status).toBe("COMPLETED");
    expect(result.xpAwarded).toBe(50);
    expect(prisma.userLessonProgress.upsert).toHaveBeenCalled();
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "user-1",
      50,
      "LESSON_COMPLETION",
      "lesson-1-id"
    );
  });
});
