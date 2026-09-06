import { prisma } from "@/lib/db/client";
import { welcomeFormativeQuestions } from "@/features/learning/assessment/welcome.server";
import { foundationsFormativeQuestions } from "@/features/learning/assessment/foundations.server";
import { ipv4FormativeQuestions } from "@/features/learning/assessment/ipv4.server";
import { AssessmentNotFoundError } from "./errors";

export interface LessonCompletionDecision {
  canComplete: boolean;
  isAlreadyCompleted?: boolean;
  totalRequired: number;
  passedCount: number;
  missingQuestionIds: string[];
  reason?: string;
}

/**
 * Checks whether a learner is eligible to mark a lesson as COMPLETED.
 *
 * Requirements:
 * 1. If already completed in historical records (UserLessonProgress.status === "COMPLETED"),
 *    completion is preserved (legacy bridge).
 * 2. If the lesson has formative assessment questions defined, ALL of them must have
 *    a passed AssessmentAttempt record for this user (e.g. 3/3 formative items passed).
 * 3. Lessons without defined formative questions (unmigrated) are allowed to complete.
 */
export async function getLessonCompletionDecision(
  userId: string,
  lessonId: string
): Promise<LessonCompletionDecision> {
  // 1. Fetch lesson
  const lesson = await prisma.lesson.findFirst({
    where: {
      OR: [{ id: lessonId }, { slug: lessonId }],
    },
    include: {
      userProgress: {
        where: { userId },
      },
    },
  });

  if (!lesson) {
    throw new AssessmentNotFoundError(`Materi '${lessonId}' tidak ditemukan.`);
  }

  // 2. Legacy bridge: if user already has completed status, allow preservation
  if (lesson.userProgress[0]?.status === "COMPLETED") {
    return {
      canComplete: true,
      isAlreadyCompleted: true,
      totalRequired: 0,
      passedCount: 0,
      missingQuestionIds: [],
    };
  }

  // 3. Find all required formative questions for this lesson
  const allFormativeQuestions = [
    ...welcomeFormativeQuestions,
    ...foundationsFormativeQuestions,
    ...ipv4FormativeQuestions,
  ];
  const requiredQuestions = allFormativeQuestions.filter(
    (q) => q.lessonSlug === lesson.slug
  );

  if (requiredQuestions.length === 0) {
    // No formative requirements configured for this lesson
    return {
      canComplete: true,
      totalRequired: 0,
      passedCount: 0,
      missingQuestionIds: [],
    };
  }

  // 4. Query passed AssessmentAttempt records for this user and lesson
  const passedAttempts = await prisma.assessmentAttempt.findMany({
    where: {
      userId,
      lessonId: lesson.id,
      passed: true,
    },
    select: {
      assessmentId: true,
    },
  });

  const passedSet = new Set(passedAttempts.map((a) => a.assessmentId));
  const missingQuestions = requiredQuestions.filter((q) => !passedSet.has(q.id));

  if (missingQuestions.length > 0) {
    return {
      canComplete: false,
      totalRequired: requiredQuestions.length,
      passedCount: requiredQuestions.length - missingQuestions.length,
      missingQuestionIds: missingQuestions.map((q) => q.id),
      reason: `Belum memenuhi syarat kelulusan materi: ${missingQuestions.length} dari ${requiredQuestions.length} kuis formatif belum dijawab dengan benar.`,
    };
  }

  return {
    canComplete: true,
    totalRequired: requiredQuestions.length,
    passedCount: requiredQuestions.length,
    missingQuestionIds: [],
  };
}
