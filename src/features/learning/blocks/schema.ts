import { z } from "zod";

// Base Block Schema
export const HeadingBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("heading"),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  text: z.string().min(1, "Heading text cannot be empty"),
});

export const TextBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("text"),
  content: z.string().min(1, "Text content cannot be empty"),
  format: z.enum(["markdown", "plain"]).default("markdown"),
});

export const ImageBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("image"),
  src: z.string().min(1, "Image src is required"),
  alt: z.string().min(1, "Image alt is required"),
  caption: z.string().optional(),
});

export const CalloutBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("callout"),
  variant: z.enum(["info", "warning", "tip", "success"]).default("info"),
  title: z.string().min(1, "Callout title is required"),
  content: z.string().min(1, "Callout content is required"),
});

export const CodeBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("code"),
  language: z.string().default("text"),
  code: z.string().min(1, "Code content is required"),
  filename: z.string().optional(),
});

export const LottieBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("lottie"),
  animationUrl: z.string().min(1, "Animation URL is required"),
  fallbackImage: z.string().optional(),
  caption: z.string().optional(),
});

export const DiagramBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("diagram"),
  diagramType: z.enum(["topology", "packet_flow", "osi_stack", "custom"]).default("topology"),
  data: z.record(z.unknown()),
  caption: z.string().optional(),
});

export const InteractiveBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("interactive"),
  interactiveType: z.string().min(1),
  config: z.record(z.unknown()).default({}),
});

export const QuizOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
});

export const QuizBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("quiz"),
  quizId: z.string().min(1),
  question: z.string().min(1),
  quizType: z.enum(["single_choice", "multiple_choice", "ordering"]).default("single_choice"),
  options: z.array(QuizOptionSchema).min(2, "At least 2 options required"),
  explanation: z.string().optional(),
  xpReward: z.number().int().nonnegative().default(10),
});

export const TerminalBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("terminal"),
  prompt: z.string().default("learner@netloka:~$"),
  initialOutput: z.string().optional(),
  expectedCommands: z.array(z.string()).default([]),
});

export const PracticeBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("practice"),
  title: z.string().min(1),
  instructions: z.string().min(1),
  hints: z.array(z.string()).default([]),
});

export const SummaryBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("summary"),
  title: z.string().default("Rangkuman Materi"),
  keyPoints: z.array(z.string()).min(1, "At least 1 key point required"),
});

export const RewardBlockSchema = z.object({
  id: z.string().optional(),
  type: z.literal("reward"),
  xp: z.number().int().positive().default(50),
  badgeTitle: z.string().optional(),
  message: z.string().default("Selamat! Anda telah menyelesaikan pelajaran ini."),
});

// Discriminated Union of all Lesson Blocks
export const LessonBlockSchema = z.discriminatedUnion("type", [
  HeadingBlockSchema,
  TextBlockSchema,
  ImageBlockSchema,
  CalloutBlockSchema,
  CodeBlockSchema,
  LottieBlockSchema,
  DiagramBlockSchema,
  InteractiveBlockSchema,
  QuizBlockSchema,
  TerminalBlockSchema,
  PracticeBlockSchema,
  SummaryBlockSchema,
  RewardBlockSchema,
]);

export type LessonBlock = z.infer<typeof LessonBlockSchema>;

// Versioned Lesson Content Document Schema
export const LessonContentDocumentSchema = z.object({
  version: z.literal("1.0").default("1.0"),
  blocks: z.array(LessonBlockSchema),
});

export type LessonContentDocument = z.infer<typeof LessonContentDocumentSchema>;

/**
 * Safely validates a JSON lesson content payload.
 * Returns { success: true, data } or { success: false, errors }
 */
export function validateLessonContent(
  payload: unknown
): {
  success: boolean;
  data?: LessonContentDocument;
  errors?: string[];
} {
  if (!payload || typeof payload !== "object") {
    return {
      success: false,
      errors: ["Payload must be a non-null object"],
    };
  }

  // If payload is a bare array of blocks, wrap it in version 1.0
  const normalized = Array.isArray(payload)
    ? { version: "1.0", blocks: payload }
    : payload;

  const result = LessonContentDocumentSchema.safeParse(normalized);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors = result.error.issues.map(
    (issue) => `[${issue.path.join(".")}] ${issue.message}`
  );

  return {
    success: false,
    errors,
  };
}
