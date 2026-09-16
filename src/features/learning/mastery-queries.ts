import { prisma } from "@/lib/db/client";
import { getCurriculumGraph } from "./queries";
import { getCurriculumModule } from "./content/registry";
import {
  deriveOutcomeMasteries,
  groupMasteryByModule,
  summarizeLearnerMastery,
  type DeclaredOutcome,
  type OutcomeEvidenceRecord,
  type LessonProgressSummary,
  type LearnerMasterySummary,
} from "./mastery";

/**
 * Retrieves the complete outcome mastery profile for an authenticated learner,
 * derived from authoritative Prisma assessment attempts and lesson progress.
 */
export async function getLearnerMasteryOverview(
  userId: string
): Promise<LearnerMasterySummary> {
  const [curriculum, assessmentAttempts, lessonProgress] = await Promise.all([
    getCurriculumGraph(),
    prisma.assessmentAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userLessonProgress.findMany({
      where: { userId },
      select: {
        lessonId: true,
        status: true,
        completedAt: true,
      },
    }),
  ]);

  const declaredOutcomes = buildDeclaredOutcomesRegistry(curriculum);

  // Map assessment attempts
  const evidenceRecords: OutcomeEvidenceRecord[] = assessmentAttempts.map((attempt) => ({
    assessmentId: attempt.assessmentId,
    moduleId: attempt.moduleId,
    lessonId: attempt.lessonId,
    passed: attempt.passed,
    score: attempt.score,
    version: attempt.version,
    submittedAt: attempt.createdAt,
  }));

  // Map lesson progress
  const progressMap = new Map<string, LessonProgressSummary>();
  for (const lp of lessonProgress) {
    progressMap.set(lp.lessonId, {
      status: lp.status,
      completedAt: lp.completedAt,
    });
  }

  const masteries = deriveOutcomeMasteries(declaredOutcomes, evidenceRecords, progressMap);
  const groupedModules = groupMasteryByModule(masteries);
  return summarizeLearnerMastery(groupedModules);
}

/**
 * Builds the declared outcomes registry from the curriculum graph and content modules.
 */
export function buildDeclaredOutcomesRegistry(curriculum: {
  paths: Array<{
    id: string;
    slug: string;
    title: string;
    modules: Array<{
      id: string;
      slug: string;
      title: string;
      lessons: Array<{ id: string; slug: string; title: string }>;
    }>;
  }>;
}): DeclaredOutcome[] {
  const declaredOutcomes: DeclaredOutcome[] = [];

  for (const path of curriculum.paths) {
    for (const mod of path.modules) {
      const curriculumMod = getCurriculumModule(mod.slug) || getCurriculumModule(mod.id);

      // 1. Module-scoped outcomes
      if (curriculumMod?.outcomes) {
        const modAssessmentItemIds = curriculumMod.finalAssessment
          ? [curriculumMod.finalAssessment.assessmentId]
          : [];
        const modLessonIds = mod.lessons.map((l) => l.id);
        const firstLessonSlug = mod.lessons[0]?.slug;

        for (const o of curriculumMod.outcomes) {
          declaredOutcomes.push({
            id: o.id,
            text: o.text,
            description: o.description,
            moduleId: mod.id,
            moduleSlug: mod.slug,
            moduleTitle: mod.title,
            pathId: path.id,
            pathSlug: path.slug,
            pathTitle: path.title,
            lessonSlug: firstLessonSlug,
            currentVersion: "1.0",
            assessmentItemIds: modAssessmentItemIds,
            remediationLessonIds: modLessonIds,
          });
        }
      }

      // 2. Lesson-scoped outcomes
      for (const lesson of mod.lessons) {
        const curriculumLesson = curriculumMod?.lessons.find(
          (cl) => cl.slug === lesson.slug || cl.id === lesson.id
        );

        if (curriculumLesson?.outcomes) {
          for (const o of curriculumLesson.outcomes) {
            const ev = curriculumLesson.evidence?.find((e) => e.outcomeId === o.id);

            declaredOutcomes.push({
              id: o.id,
              text: o.text,
              description: o.description,
              moduleId: mod.id,
              moduleSlug: mod.slug,
              moduleTitle: mod.title,
              pathId: path.id,
              pathSlug: path.slug,
              pathTitle: path.title,
              lessonId: lesson.id,
              lessonSlug: lesson.slug,
              lessonTitle: lesson.title,
              currentVersion: "1.0",
              assessmentItemIds: ev?.assessmentItemIds || [],
              remediationLessonIds: [lesson.id],
            });
          }
        }
      }
    }
  }

  return declaredOutcomes;
}
