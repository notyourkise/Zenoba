import { z } from "zod";

export const SingleChoiceQuestionSchema = z.object({
  type: z.literal("single_choice"),
  id: z.string(),
  prompt: z.string().min(1),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ).min(2),
  correctOptionId: z.string(),
  explanation: z.string().optional(),
  xpReward: z.number().int().nonnegative().default(10),
});

export const MultipleChoiceQuestionSchema = z.object({
  type: z.literal("multiple_choice"),
  id: z.string(),
  prompt: z.string().min(1),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ).min(2),
  correctOptionIds: z.array(z.string()).min(1),
  explanation: z.string().optional(),
  xpReward: z.number().int().nonnegative().default(15),
});

export const OrderingQuestionSchema = z.object({
  type: z.literal("ordering"),
  id: z.string(),
  prompt: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ).min(2),
  correctOrder: z.array(z.string()).min(2),
  explanation: z.string().optional(),
  xpReward: z.number().int().nonnegative().default(20),
});

export const QuizQuestionSchema = z.discriminatedUnion("type", [
  SingleChoiceQuestionSchema,
  MultipleChoiceQuestionSchema,
  OrderingQuestionSchema,
]);

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const QuizSubmissionSchema = z.object({
  lessonId: z.string().min(1),
  quizId: z.string().min(1),
  // Answer payload can be string (single choice), array of string (multiple choice / ordering)
  answer: z.union([z.string(), z.array(z.string())]),
});

export type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;
