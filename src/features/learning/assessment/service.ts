import { prisma } from "@/lib/db/client";
import { awardXp, AwardXpResult } from "@/features/xp/ledger";
import { requireLearningPathAccess } from "@/features/commerce/access";
import { resolveLessonStatus } from "@/features/learning/prerequisites";
import { LessonStatus } from "@/features/learning/types";
import {
  welcomeFormativeQuestions,
  welcomeFinalConceptQuestions,
  evaluatePracticalConnectivity,
  PracticalSubmissionState,
  PracticalCriterionResult,
  PrivateQuizQuestion,
} from "@/features/learning/assessment/welcome.server";
import { foundationsFormativeQuestions } from "@/features/learning/assessment/foundations.server";
import { ipv4FormativeQuestions } from "@/features/learning/assessment/ipv4.server";
import { switchingFormativeQuestions } from "@/features/learning/assessment/switching.server";
import { servicesFormativeQuestions } from "@/features/learning/assessment/services.server";
import {
  AssessmentNotFoundError,
  AssessmentMismatchError,
  AssessmentLockedError,
  AssessmentConflictError,
} from "./errors";

/**
 * Finds a formative quiz question by ID from server definitions.
 */
export function findFormativeQuestion(quizId: string): PrivateQuizQuestion | null {
  return (
    welcomeFormativeQuestions.find((q) => q.id === quizId) ||
    foundationsFormativeQuestions.find((q) => q.id === quizId) ||
    ipv4FormativeQuestions.find((q) => q.id === quizId) ||
    switchingFormativeQuestions.find((q) => q.id === quizId) ||
    servicesFormativeQuestions.find((q) => q.id === quizId) ||
    null
  );
}

export interface QuizSubmissionParams {
  userId: string;
  lessonId: string;
  quizId: string;
  answer: string | string[];
  requestId: string;
}

export interface QuizSubmissionResponse {
  passed: boolean;
  score: number;
  feedback: string;
  explanation?: string;
  xpResult?: AwardXpResult | null;
  isIdempotentReplay?: boolean;
}

/**
 * Authoritatively evaluates and records a learner's quiz attempt.
 */
export async function submitQuizAttempt({
  userId,
  lessonId,
  quizId,
  answer,
  requestId,
}: QuizSubmissionParams): Promise<QuizSubmissionResponse> {
  // 1. Look up server-owned question definition
  const question = findFormativeQuestion(quizId);
  if (!question) {
    throw new AssessmentNotFoundError(`Pertanyaan kuis '${quizId}' tidak ditemukan.`);
  }

  // 2. Look up lesson in database (support matching by id or slug)
  const lesson = await prisma.lesson.findFirst({
    where: {
      OR: [{ id: lessonId }, { slug: lessonId }],
    },
    include: {
      module: {
        include: {
          path: true,
        },
      },
      prerequisites: {
        include: {
          prerequisite: {
            include: {
              module: true,
            },
          },
        },
      },
      userProgress: {
        where: { userId },
      },
    },
  });

  if (!lesson) {
    throw new AssessmentNotFoundError(`Materi pelajaran '${lessonId}' tidak ditemukan.`);
  }

  // 3. Verify question ownership: question must belong to this lesson
  if (question.lessonSlug && lesson.slug !== question.lessonSlug) {
    throw new AssessmentMismatchError(
      `Kuis '${quizId}' tidak terdaftar dalam materi '${lesson.title}'.`
    );
  }

  // 4. Verify learning path entitlement
  if (lesson.module?.path?.slug) {
    await requireLearningPathAccess({
      userId,
      pathSlug: lesson.module.path.slug,
    });
  }

  // 5. Check if lesson is locked by unmet prerequisites
  const completedProgress = await prisma.userLessonProgress.findMany({
    where: { userId, status: "COMPLETED" },
    select: { lessonId: true },
  });
  const completedSet = new Set(completedProgress.map((p) => p.lessonId));
  const currentStatus = (lesson.userProgress[0]?.status as LessonStatus) || null;
  const resolved = resolveLessonStatus(lesson.prerequisites, completedSet, currentStatus);

  if (resolved.status === "LOCKED") {
    throw new AssessmentLockedError(
      "Tidak dapat mengerjakan kuis pada materi yang terkunci. Selesaikan materi prasyarat terlebih dahulu."
    );
  }

  // 6. Check Idempotency by composite key (userId, requestId)
  const existingAttempt = await prisma.assessmentAttempt.findUnique({
    where: {
      userId_requestId: {
        userId,
        requestId,
      },
    },
  });

  if (existingAttempt) {
    const isSameQuiz = existingAttempt.assessmentId === quizId;
    const isSameAnswer =
      JSON.stringify(existingAttempt.answersJson) === JSON.stringify(answer);

    if (isSameQuiz && isSameAnswer) {
      return {
        passed: existingAttempt.passed,
        score: existingAttempt.score,
        feedback: existingAttempt.passed
          ? "Jawaban Anda tepat!"
          : question.misconceptionFeedback || "Jawaban belum tepat, silakan coba lagi.",
        explanation: question.explanation,
        xpResult: null,
        isIdempotentReplay: true,
      };
    }

    throw new AssessmentConflictError(
      "Request ID telah digunakan untuk pengiriman jawaban yang berbeda."
    );
  }

  // 7. Deterministic answer evaluation
  const submittedValue = Array.isArray(answer) ? answer[0] : answer;
  const isCorrect =
    typeof submittedValue === "string" &&
    submittedValue.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  const passed = isCorrect;
  const score = passed ? 10 : 0;

  // 8. Persist attempt with concurrency protection
  try {
    await prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId: quizId,
        lessonId: lesson.id,
        moduleId: lesson.moduleId,
        version: "1.0",
        score,
        passed,
        answersJson: answer as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        requestId,
      },
    });
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err?.code === "P2002" || err?.message?.includes("Unique constraint")) {
      const concurrentAttempt = await prisma.assessmentAttempt.findUnique({
        where: { userId_requestId: { userId, requestId } },
      });
      if (concurrentAttempt) {
        return {
          passed: concurrentAttempt.passed,
          score: concurrentAttempt.score,
          feedback: concurrentAttempt.passed
            ? "Jawaban Anda tepat!"
            : question.misconceptionFeedback || "Jawaban belum tepat, silakan coba lagi.",
          explanation: question.explanation,
          xpResult: null,
          isIdempotentReplay: true,
        };
      }
    }
    throw err;
  }

  // Also record to legacy quizAttempt table for historical queries
  try {
    await prisma.quizAttempt.create({
      data: {
        userId,
        lessonId: lesson.id,
        quizId,
        score,
        passed,
        answers: answer as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      },
    });
  } catch {
    // Non-blocking legacy compatibility write
  }

  // 9. Award XP on first pass
  let xpResult: AwardXpResult | null = null;
  if (passed) {
    xpResult = await awardXp(userId, 10, "QUIZ_PASS", quizId);
  }

  return {
    passed,
    score,
    feedback: passed
      ? "Jawaban Anda tepat!"
      : question.misconceptionFeedback || "Jawaban belum tepat, silakan coba lagi.",
    explanation: question.explanation,
    xpResult,
    isIdempotentReplay: false,
  };
}

export interface ModuleFinalSubmissionParams {
  userId: string;
  moduleId: string;
  conceptAnswers: Record<string, string>;
  practicalState: PracticalSubmissionState;
  requestId: string;
}

export interface ModuleFinalSubmissionResponse {
  passed: boolean;
  score: number;
  conceptScore: number;
  conceptMax: number;
  conceptPassed: boolean;
  practicalPassed: boolean;
  practicalResults: PracticalCriterionResult[];
  unmetOutcomes: string[];
  feedback: string;
  xpResult?: AwardXpResult | null;
  isIdempotentReplay?: boolean;
}

/**
 * Authoritatively evaluates and records a learner's module final assessment.
 * Passing criteria: concept score >= 8/10 AND all 3 practical criteria passed.
 */
export async function submitModuleFinalAssessment({
  userId,
  moduleId,
  conceptAnswers,
  practicalState,
  requestId,
}: ModuleFinalSubmissionParams): Promise<ModuleFinalSubmissionResponse> {
  // 1. Look up module in database (by id or slug)
  const moduleRecord = await prisma.module.findFirst({
    where: {
      OR: [{ id: moduleId }, { slug: moduleId }],
    },
    include: {
      path: true,
      lessons: {
        include: {
          userProgress: {
            where: { userId },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!moduleRecord) {
    throw new AssessmentNotFoundError(`Modul '${moduleId}' tidak ditemukan.`);
  }

  // 2. Verify learning path entitlement
  if (moduleRecord.path?.slug) {
    await requireLearningPathAccess({
      userId,
      pathSlug: moduleRecord.path.slug,
    });
  }

  // 3. Verify all lessons in the module are completed before taking the final assessment
  const uncompletedLessons = moduleRecord.lessons.filter(
    (l) => l.userProgress[0]?.status !== "COMPLETED"
  );

  if (uncompletedLessons.length > 0) {
    throw new AssessmentLockedError(
      `Ujian akhir modul terkunci. Anda harus menyelesaikan seluruh ${moduleRecord.lessons.length} materi dalam modul ini terlebih dahulu.`
    );
  }

  // 4. Check Idempotency by composite key (userId, requestId)
  const assessmentId = `${moduleRecord.slug}-final-assessment`;
  const existingAttempt = await prisma.assessmentAttempt.findUnique({
    where: {
      userId_requestId: {
        userId,
        requestId,
      },
    },
  });

  if (existingAttempt) {
    if (existingAttempt.assessmentId === assessmentId) {
      const stored = existingAttempt.answersJson as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      return {
        passed: existingAttempt.passed,
        score: existingAttempt.score,
        conceptScore: stored?.conceptScore ?? 0,
        conceptMax: 10,
        conceptPassed: (stored?.conceptScore ?? 0) >= 8,
        practicalPassed: stored?.practicalPassed ?? false,
        practicalResults: stored?.practicalResults ?? [],
        unmetOutcomes: stored?.unmetOutcomes ?? [],
        feedback: existingAttempt.passed
          ? "Selamat! Anda telah lulus seluruh kriteria evaluasi modul Welcome to Networking."
          : "Anda belum memenuhi seluruh kriteria kelulusan modul. Silakan tinjau kembali materi terkait.",
        xpResult: null,
        isIdempotentReplay: true,
      };
    }

    throw new AssessmentConflictError(
      "Request ID telah digunakan untuk pengiriman asesmen yang berbeda."
    );
  }

  // 5. Evaluate 10 concept questions
  let conceptScore = 0;
  const unmetOutcomes: string[] = [];

  for (const q of welcomeFinalConceptQuestions) {
    const userAnswer = conceptAnswers[q.id];
    if (
      userAnswer &&
      userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
    ) {
      conceptScore += 1;
    } else {
      unmetOutcomes.push(q.outcomeId);
    }
  }

  const conceptPassed = conceptScore >= 8;

  // 6. Evaluate practical connectivity simulation
  const practicalResult = evaluatePracticalConnectivity(practicalState);
  const practicalPassed = practicalResult.allPassed;

  if (!practicalPassed) {
    for (const c of practicalResult.criteriaResults) {
      if (!c.passed) {
        unmetOutcomes.push(`PRACTICAL-${c.id}`);
      }
    }
  }

  // Both gates must pass
  const passed = conceptPassed && practicalPassed;
  const totalScore = Math.round((conceptScore / 10) * 50) + (practicalPassed ? 50 : 0);

  // 7. Persist AssessmentAttempt with concurrency protection
  try {
    await prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId,
        moduleId: moduleRecord.id,
        version: "1.0",
        score: totalScore,
        passed,
        answersJson: {
          conceptAnswers,
          practicalState,
          conceptScore,
          practicalPassed,
          practicalResults: practicalResult.criteriaResults,
          unmetOutcomes,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        requestId,
      },
    });
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err?.code === "P2002" || err?.message?.includes("Unique constraint")) {
      const concurrentAttempt = await prisma.assessmentAttempt.findUnique({
        where: { userId_requestId: { userId, requestId } },
      });
      if (concurrentAttempt) {
        const stored = concurrentAttempt.answersJson as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        return {
          passed: concurrentAttempt.passed,
          score: concurrentAttempt.score,
          conceptScore: stored?.conceptScore ?? 0,
          conceptMax: 10,
          conceptPassed: (stored?.conceptScore ?? 0) >= 8,
          practicalPassed: stored?.practicalPassed ?? false,
          practicalResults: stored?.practicalResults ?? [],
          unmetOutcomes: stored?.unmetOutcomes ?? [],
          feedback: concurrentAttempt.passed
            ? "Selamat! Anda telah lulus seluruh kriteria evaluasi modul Welcome to Networking."
            : "Anda belum memenuhi seluruh kriteria kelulusan modul. Silakan tinjau kembali materi terkait.",
          xpResult: null,
          isIdempotentReplay: true,
        };
      }
    }
    throw err;
  }

  // 8. Award XP on module final pass (100 XP)
  let xpResult: AwardXpResult | null = null;
  if (passed) {
    xpResult = await awardXp(userId, 100, "MODULE_COMPLETION", assessmentId);
  }

  return {
    passed,
    score: totalScore,
    conceptScore,
    conceptMax: 10,
    conceptPassed,
    practicalPassed,
    practicalResults: practicalResult.criteriaResults,
    unmetOutcomes,
    feedback: passed
      ? "Selamat! Anda telah lulus seluruh kriteria evaluasi modul Welcome to Networking."
      : "Anda belum memenuhi seluruh kriteria kelulusan modul. Silakan tinjau kembali materi terkait.",
    xpResult,
    isIdempotentReplay: false,
  };
}
