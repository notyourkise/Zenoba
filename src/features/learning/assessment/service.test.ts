import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  submitQuizAttempt,
  submitModuleFinalAssessment,
  findFormativeQuestion,
} from "./service";
import { prisma } from "@/lib/db/client";
import * as xpLedger from "@/features/xp/ledger";
import {
  AssessmentNotFoundError,
  AssessmentMismatchError,
  AssessmentLockedError,
  AssessmentConflictError,
} from "./errors";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    lesson: {
      findFirst: vi.fn(),
    },
    module: {
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
  },
}));

vi.mock("@/features/xp/ledger", () => ({
  awardXp: vi.fn(),
}));

vi.mock("@/features/commerce/access", () => ({
  requireLearningPathAccess: vi.fn().mockResolvedValue(undefined),
}));

describe("Assessment Service - submitQuizAttempt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("finds a formative question correctly", () => {
    const q1 = findFormativeQuestion("quiz-wn-l1-q1");
    expect(q1).not.toBeNull();
    expect(q1?.correctAnswer).toBe("opt-b");

    const nonExistent = findFormativeQuestion("quiz-unknown-999");
    expect(nonExistent).toBeNull();
  });

  it("throws AssessmentNotFoundError when quiz does not exist", async () => {
    await expect(
      submitQuizAttempt({
        userId: "user-1",
        lessonId: "intro-to-networking",
        quizId: "non-existent-quiz",
        answer: "opt-a",
        requestId: "req-1",
      })
    ).rejects.toThrow(AssessmentNotFoundError);
  });

  it("throws AssessmentNotFoundError when lesson does not exist in DB", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce(null);

    await expect(
      submitQuizAttempt({
        userId: "user-1",
        lessonId: "ghost-lesson",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-b",
        requestId: "req-2",
      })
    ).rejects.toThrow(AssessmentNotFoundError);
  });

  it("throws AssessmentMismatchError when quiz belongs to a different lesson", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-2-id",
      slug: "everyday-networks",
      title: "Jaringan Komputer di Sekitar Kita",
      moduleId: "mod-1",
      module: { path: { slug: "network-foundations" } },
      prerequisites: [],
      userProgress: [],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // quiz-wn-l1-q1 belongs to intro-to-networking, not everyday-networks
    await expect(
      submitQuizAttempt({
        userId: "user-1",
        lessonId: "everyday-networks",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-b",
        requestId: "req-3",
      })
    ).rejects.toThrow(AssessmentMismatchError);
  });

  it("throws AssessmentLockedError if lesson has unmet prerequisites", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-2-id",
      slug: "everyday-networks",
      title: "Jaringan Komputer di Sekitar Kita",
      moduleId: "mod-1",
      module: { path: { slug: "network-foundations" } },
      prerequisites: [
        {
          id: "p-1",
          lessonId: "lesson-2-id",
          prerequisiteId: "lesson-1-id",
          prerequisite: {
            id: "lesson-1-id",
            title: "Intro",
            slug: "intro-to-networking",
            module: { slug: "welcome" },
          },
        },
      ],
      userProgress: [],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // User has not completed lesson-1-id
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);

    await expect(
      submitQuizAttempt({
        userId: "user-1",
        lessonId: "everyday-networks",
        quizId: "quiz-wn-l2-q1",
        answer: "opt-a",
        requestId: "req-4",
      })
    ).rejects.toThrow(AssessmentLockedError);
  });

  it("returns cached result on exact idempotent retry", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      title: "Pengenalan Jaringan",
      moduleId: "mod-1",
      module: { path: { slug: "network-foundations" } },
      prerequisites: [],
      userProgress: [],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);

    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce({
      id: "att-1",
      userId: "user-1",
      assessmentId: "quiz-wn-l1-q1",
      passed: true,
      score: 10,
      answersJson: "opt-b",
      requestId: "req-same",
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    const res = await submitQuizAttempt({
      userId: "user-1",
      lessonId: "intro-to-networking",
      quizId: "quiz-wn-l1-q1",
      answer: "opt-b",
      requestId: "req-same",
    });

    expect(res.isIdempotentReplay).toBe(true);
    expect(res.passed).toBe(true);
    expect(res.score).toBe(10);
    expect(prisma.assessmentAttempt.create).not.toHaveBeenCalled();
    expect(xpLedger.awardXp).not.toHaveBeenCalled();
  });

  it("throws AssessmentConflictError when same requestId is reused with different answer", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      title: "Pengenalan Jaringan",
      moduleId: "mod-1",
      module: { path: { slug: "network-foundations" } },
      prerequisites: [],
      userProgress: [],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);

    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce({
      id: "att-1",
      userId: "user-1",
      assessmentId: "quiz-wn-l1-q1",
      passed: false,
      score: 0,
      answersJson: "opt-a",
      requestId: "req-reuse",
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await expect(
      submitQuizAttempt({
        userId: "user-1",
        lessonId: "intro-to-networking",
        quizId: "quiz-wn-l1-q1",
        answer: "opt-b", // different answer!
        requestId: "req-reuse",
      })
    ).rejects.toThrow(AssessmentConflictError);
  });

  it("evaluates correct answer, records attempt, and awards XP", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      title: "Pengenalan Jaringan",
      moduleId: "mod-1",
      module: { path: { slug: "network-foundations" } },
      prerequisites: [],
      userProgress: [],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce(null);

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 10,
      totalXp: 10,
      message: "+10 XP",
    });

    const res = await submitQuizAttempt({
      userId: "user-1",
      lessonId: "intro-to-networking",
      quizId: "quiz-wn-l1-q1",
      answer: "opt-b", // correct option for quiz-wn-l1-q1
      requestId: "req-fresh-1",
    });

    expect(res.passed).toBe(true);
    expect(res.score).toBe(10);
    expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        assessmentId: "quiz-wn-l1-q1",
        lessonId: "lesson-1-id",
        passed: true,
        score: 10,
        requestId: "req-fresh-1",
      }),
    });
    expect(xpLedger.awardXp).toHaveBeenCalledWith("user-1", 10, "QUIZ_PASS", "quiz-wn-l1-q1");
  });

  it("fails nonempty wrong answer, records attempt, and does NOT award XP", async () => {
    vi.mocked(prisma.lesson.findFirst).mockResolvedValueOnce({
      id: "lesson-1-id",
      slug: "intro-to-networking",
      title: "Pengenalan Jaringan",
      moduleId: "mod-1",
      module: { path: { slug: "network-foundations" } },
      prerequisites: [],
      userProgress: [],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce(null);

    const res = await submitQuizAttempt({
      userId: "user-1",
      lessonId: "intro-to-networking",
      quizId: "quiz-wn-l1-q1",
      answer: "opt-a", // wrong option!
      requestId: "req-fresh-2",
    });

    expect(res.passed).toBe(false);
    expect(res.score).toBe(0);
    expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        assessmentId: "quiz-wn-l1-q1",
        passed: false,
        score: 0,
      }),
    });
    expect(xpLedger.awardXp).not.toHaveBeenCalled();
  });
});

describe("Assessment Service - submitModuleFinalAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPassingPracticalState = {
    links: [
      { from: "pc-katalog", to: "switch-perpus", status: "connected" as const },
      { from: "pc-sirkulasi", to: "switch-perpus", status: "connected" as const },
      { from: "printer-barcode", to: "switch-perpus", status: "connected" as const },
    ],
    ispUplinkConnected: false,
    verifiedPrints: [
      { client: "pc-katalog", target: "printer-barcode", success: true },
      { client: "pc-sirkulasi", target: "printer-barcode", success: true },
    ],
  };

  const allCorrectConceptAnswers: Record<string, string> = {
    "final-wn-f01": "opt-b",
    "final-wn-f02": "opt-a",
    "final-wn-f03": "opt-b",
    "final-wn-f04": "opt-a",
    "final-wn-f05": "opt-b",
    "final-wn-f06": "opt-b",
    "final-wn-f07": "opt-a",
    "final-wn-f08": "opt-b",
    "final-wn-f09": "opt-c",
    "final-wn-f10": "opt-b",
  };

  it("throws AssessmentLockedError when module lessons are not completed", async () => {
    vi.mocked(prisma.module.findFirst).mockResolvedValueOnce({
      id: "mod-1",
      slug: "welcome-to-networking",
      path: { slug: "network-foundations" },
      lessons: [
        { id: "l-1", userProgress: [{ status: "COMPLETED" }] },
        { id: "l-2", userProgress: [] }, // not completed!
      ],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await expect(
      submitModuleFinalAssessment({
        userId: "user-1",
        moduleId: "welcome-to-networking",
        conceptAnswers: allCorrectConceptAnswers,
        practicalState: validPassingPracticalState,
        requestId: "req-fin-1",
      })
    ).rejects.toThrow(AssessmentLockedError);
  });

  it("fails module pass when concepts score 10/10 but practical simulation fails", async () => {
    vi.mocked(prisma.module.findFirst).mockResolvedValueOnce({
      id: "mod-1",
      slug: "welcome-to-networking",
      path: { slug: "network-foundations" },
      lessons: [
        { id: "l-1", userProgress: [{ status: "COMPLETED" }] },
        { id: "l-2", userProgress: [{ status: "COMPLETED" }] },
      ],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce(null);

    // Broken practical state: pc-sirkulasi is disconnected
    const failingPracticalState = {
      ...validPassingPracticalState,
      links: [
        { from: "pc-katalog", to: "switch-perpus", status: "connected" as const },
        { from: "printer-barcode", to: "switch-perpus", status: "connected" as const },
      ],
    };

    const res = await submitModuleFinalAssessment({
      userId: "user-1",
      moduleId: "welcome-to-networking",
      conceptAnswers: allCorrectConceptAnswers,
      practicalState: failingPracticalState,
      requestId: "req-fin-2",
    });

    expect(res.conceptScore).toBe(10);
    expect(res.conceptPassed).toBe(true);
    expect(res.practicalPassed).toBe(false);
    expect(res.passed).toBe(false); // Entire module fails!
    expect(xpLedger.awardXp).not.toHaveBeenCalled();
  });

  it("fails module pass when practical passes 3/3 but concept score is under 8", async () => {
    vi.mocked(prisma.module.findFirst).mockResolvedValueOnce({
      id: "mod-1",
      slug: "welcome-to-networking",
      path: { slug: "network-foundations" },
      lessons: [
        { id: "l-1", userProgress: [{ status: "COMPLETED" }] },
      ],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce(null);

    // Only 2 correct concept answers
    const lowConceptAnswers: Record<string, string> = {
      "final-wn-f01": "opt-b",
      "final-wn-f02": "opt-a",
    };

    const res = await submitModuleFinalAssessment({
      userId: "user-1",
      moduleId: "welcome-to-networking",
      conceptAnswers: lowConceptAnswers,
      practicalState: validPassingPracticalState,
      requestId: "req-fin-3",
    });

    expect(res.conceptScore).toBe(2);
    expect(res.conceptPassed).toBe(false);
    expect(res.practicalPassed).toBe(true);
    expect(res.passed).toBe(false); // Entire module fails!
    expect(xpLedger.awardXp).not.toHaveBeenCalled();
  });

  it("passes module when both concepts >= 8 and practical 3/3 criteria pass", async () => {
    vi.mocked(prisma.module.findFirst).mockResolvedValueOnce({
      id: "mod-1",
      slug: "welcome-to-networking",
      path: { slug: "network-foundations" },
      lessons: [
        { id: "l-1", userProgress: [{ status: "COMPLETED" }] },
      ],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValueOnce(null);

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 100,
      totalXp: 150,
      message: "+100 XP",
    });

    const res = await submitModuleFinalAssessment({
      userId: "user-1",
      moduleId: "welcome-to-networking",
      conceptAnswers: allCorrectConceptAnswers,
      practicalState: validPassingPracticalState,
      requestId: "req-fin-4",
    });

    expect(res.conceptScore).toBe(10);
    expect(res.conceptPassed).toBe(true);
    expect(res.practicalPassed).toBe(true);
    expect(res.passed).toBe(true);
    expect(res.score).toBe(100);
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "user-1",
      100,
      "MODULE_COMPLETION",
      "welcome-to-networking-final-assessment"
    );
  });
});
