import { z } from "zod";
import { LessonContentDocumentSchema } from "../blocks/schema";

/**
 * Standard learning outcome contract (Capaian Pembelajaran).
 * Must describe an observable, assessable competency.
 */
export const LearningOutcomeSchema = z.object({
  id: z.string().min(1, "Outcome ID is required"),
  text: z.string().min(1, "Outcome text is required"),
  description: z.string().optional(),
});

export type LearningOutcome = z.infer<typeof LearningOutcomeSchema>;

/**
 * Traceable evidence mapping for each learning outcome.
 * Every outcome must be taught in at least one block, practiced in at least one activity,
 * and evaluated in at least one assessment item.
 */
export const LearningEvidenceSchema = z.object({
  outcomeId: z.string().min(1, "Outcome ID is required"),
  teachingBlockIds: z
    .array(z.string().min(1))
    .min(1, "At least one teaching block ID is required"),
  activityIds: z
    .array(z.string().min(1))
    .min(1, "At least one activity ID is required"),
  assessmentItemIds: z
    .array(z.string().min(1))
    .min(1, "At least one assessment item ID is required"),
});

export type LearningEvidence = z.infer<typeof LearningEvidenceSchema>;

/**
 * Curriculum lesson schema with strict outcome and evidence contracts.
 */
export const CurriculumLessonSchema = z.object({
  id: z.string().min(1, "Lesson ID is required"),
  slug: z.string().min(1, "Lesson slug is required"),
  title: z.string().min(1, "Lesson title is required"),
  description: z.string().min(1, "Lesson description is required"),
  orderIndex: z.number().int().nonnegative(),
  estimatedMinutes: z.number().int().positive().default(10),
  xpReward: z.number().int().positive().default(50),
  prerequisites: z.array(z.string()).default([]),
  outcomes: z
    .array(LearningOutcomeSchema)
    .min(1, "At least one learning outcome is required"),
  evidence: z
    .array(LearningEvidenceSchema)
    .min(1, "At least one learning evidence entry is required"),
  content: LessonContentDocumentSchema,
});

export type CurriculumLesson = z.infer<typeof CurriculumLessonSchema>;

/**
 * Final module assessment configuration.
 */
export const ModuleFinalAssessmentConfigSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID is required"),
  title: z.string().min(1, "Assessment title is required"),
  description: z.string().min(1, "Assessment description is required"),
  conceptQuestionCount: z
    .number()
    .int()
    .positive("Concept question count must be positive"),
  conceptPassThreshold: z
    .number()
    .int()
    .positive("Concept pass threshold must be positive"),
  practicalCriteriaCount: z
    .number()
    .int()
    .positive("Practical criteria count must be positive"),
  practicalPassThreshold: z
    .number()
    .int()
    .positive("Practical pass threshold must be positive"),
});

export type ModuleFinalAssessmentConfig = z.infer<
  typeof ModuleFinalAssessmentConfigSchema
>;

/**
 * Curriculum module schema with module-level outcomes and lessons.
 */
export const CurriculumModuleSchema = z.object({
  id: z.string().min(1, "Module ID is required"),
  slug: z.string().min(1, "Module slug is required"),
  title: z.string().min(1, "Module title is required"),
  description: z.string().min(1, "Module description is required"),
  orderIndex: z.number().int().nonnegative(),
  prerequisites: z.array(z.string()).default([]),
  outcomes: z
    .array(LearningOutcomeSchema)
    .min(1, "At least one module outcome is required"),
  lessons: z
    .array(CurriculumLessonSchema)
    .min(1, "At least one lesson is required"),
  finalAssessment: ModuleFinalAssessmentConfigSchema.optional(),
});

export type CurriculumModule = z.infer<typeof CurriculumModuleSchema>;

/**
 * Curriculum learning path schema grouping modules.
 */
export const CurriculumPathSchema = z.object({
  id: z.string().min(1, "Path ID is required"),
  slug: z.string().min(1, "Path slug is required"),
  title: z.string().min(1, "Path title is required"),
  description: z.string().min(1, "Path description is required"),
  orderIndex: z.number().int().nonnegative(),
  outcomes: z
    .array(LearningOutcomeSchema)
    .min(1, "At least one path outcome is required"),
  modules: z
    .array(CurriculumModuleSchema)
    .min(1, "At least one module is required"),
});

export type CurriculumPath = z.infer<typeof CurriculumPathSchema>;
