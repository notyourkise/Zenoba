import type {
  PrivateFinalConceptQuestion,
  PrivateQuizQuestion,
} from "../assessment/welcome.server";
import type {
  LessonBlock,
  LessonContentDocument,
} from "../blocks/schema";

export interface PublicQuizOption {
  id: string;
  text: string;
}

export interface PublicQuizQuestion {
  id: string;
  lessonSlug: string;
  outcomeId: string;
  question: string;
  options: PublicQuizOption[];
}

export interface PublicFinalConceptQuestion {
  id: string;
  outcomeId: string;
  question: string;
  options: PublicQuizOption[];
}

/**
 * Projects a private formative quiz question to a safe public payload.
 * Strips correct answers, explanations, and misconception hints before submission.
 */
export function projectPublicQuizQuestion(
  question: PrivateQuizQuestion
): PublicQuizQuestion {
  return {
    id: question.id,
    lessonSlug: question.lessonSlug,
    outcomeId: question.outcomeId,
    question: question.question,
    options: question.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  };
}

/**
 * Projects a private final concept question to a safe public payload.
 * Strips correct answers and explanations before submission.
 */
export function projectPublicFinalConceptQuestion(
  question: PrivateFinalConceptQuestion
): PublicFinalConceptQuestion {
  return {
    id: question.id,
    outcomeId: question.outcomeId,
    question: question.question,
    options: question.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  };
}

/**
 * Sanitizes lesson blocks so that pre-submit quiz blocks do not leak explanations or answers.
 */
export function projectPublicLessonBlock(block: LessonBlock): LessonBlock {
  if (block.type === "quiz") {
    // Strip explanation if populated before submission
    return {
      ...block,
      explanation: undefined,
    };
  }
  return block;
}

/**
 * Sanitizes a complete lesson content document for client-side rendering.
 */
export function projectPublicLessonContent(
  doc: LessonContentDocument
): LessonContentDocument {
  return {
    version: doc.version,
    blocks: doc.blocks.map(projectPublicLessonBlock),
  };
}
