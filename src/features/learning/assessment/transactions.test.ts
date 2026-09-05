import { describe, expect, it, vi, beforeEach } from "vitest";
import { submitQuizAttempt } from "./service";
import { awardXp } from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";
import * as xpLedger from "@/features/xp/ledger";
import { AssessmentConflictError } from "./errors";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    lesson: {
      findFirst: vi.fn(),
    },
    userLessonProgress: {
      findMany: vi.fn(),
    },
    assessmentAttempt: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    quizAttempt: {
      create: vi.fn(),
    },
    userXpLedger: {
      findUnique: vi.fn(),
      create: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

vi.mock("@/features/commerce/access", () => ({
  requireLearningPathAccess: vi.fn().mockResolvedValue(undefined),
}));

describe("Assessment & XP Concurrency & Idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockLesson = {
    id: "lesson-1-id",
    slug: "intro-to-networking",
    title: "Pengenalan Jaringan",
    moduleId: "mod-1",
    module: { path: { slug: "network-foundations" } },
    prerequisites: [],
    userProgress: [],
  };

  it("handles race condition where AssessmentAttempt.create throws P2002 unique constraint", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValue(mockLesson as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValue([]);

    // 1st findUnique check returns null (both requests started simultaneously)
    vi.mocked(prisma.assessmentAttempt.findUnique)
      .mockResolvedValueOnce(null)
      // 2nd findUnique check in catch block returns the attempt saved by competitor
      .mockResolvedValueOnce({
        id: "att-winner",
        userId: "user-1",
        assessmentId: "quiz-wn-l1-q1",
        passed: true,
        score: 10,
        answersJson: "opt-b",
        requestId: "req-race-1",
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // create throws P2002 (Prisma unique constraint violation)
    const p2002Error = new Error("Unique constraint failed on the fields: (`userId`,`requestId`)");
    (p2002Error as any).code = "P2002"; // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.assessmentAttempt.create).mockRejectedValueOnce(p2002Error);

    const res = await submitQuizAttempt({
      userId: "user-1",
      lessonId: "intro-to-networking",
      quizId: "quiz-wn-l1-q1",
      answer: "opt-b",
      requestId: "req-race-1",
    });

    expect(res.isIdempotentReplay).toBe(true);
    expect(res.passed).toBe(true);
    expect(res.score).toBe(10);
  });

  it("does not award XP if attempt persistence fails with fatal database error", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValue(mockLesson as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValue([]);
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValue(null);

    // Fatal database connection failure
    vi.mocked(prisma.assessmentAttempt.create).mockRejectedValueOnce(
      new Error("FATAL: database connection lost")
    );

    const spyAwardXp = vi.spyOn(xpLedger, "awardXp");

    await expect(
      submitQuizAttempt({
        userId: "user-1",
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-b", // correct answer
        requestId: "req-fail-1",
      })
    ).rejects.toThrow("FATAL: database connection lost");

    // XP must NOT have been called or awarded
    expect(spyAwardXp).not.toHaveBeenCalled();
  });

  it("rejects request if requestId was already used with a different answer payload (409 Conflict)", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValue(mockLesson as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValue([]);

    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce({
      id: "att-existing",
      userId: "user-1",
      assessmentId: "quiz-wn-l1-q1",
      passed: true,
      score: 10,
      answersJson: "opt-b",
      requestId: "req-clash",
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await expect(
      submitQuizAttempt({
        userId: "user-1",
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-a", // Different answer!
        requestId: "req-clash",
      })
    ).rejects.toThrow(AssessmentConflictError);

    expect(prisma.assessmentAttempt.create).not.toHaveBeenCalled();
  });

  it("awardXp safely handles P2002 race condition on concurrent ledger insertion", async () => {
    // 1st findUnique returns null (competitor check)
    vi.mocked(prisma.userXpLedger.findUnique).mockResolvedValueOnce(null);

    // create throws P2002
    const p2002Error = new Error("Unique constraint failed on userId_eventType_referenceId");
    (p2002Error as any).code = "P2002"; // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userXpLedger.create).mockRejectedValueOnce(p2002Error);

    vi.mocked(prisma.userXpLedger.aggregate).mockResolvedValueOnce({
      _sum: { amount: 50 },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const result = await awardXp("user-1", 50, "QUIZ_PASS", "quiz-wn-l1-q1");

    expect(result.awarded).toBe(false);
    expect(result.totalXp).toBe(50);
    expect(result.message).toContain("XP has already been awarded");
  });
});
