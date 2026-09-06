import { welcomeModuleData } from "./network-foundations/welcome";
import type { CurriculumLesson, CurriculumModule } from "./schema";

/**
 * Registry of authoritative curriculum definitions.
 * Provides rich outcomes, evidence links, and lesson blocks.
 */
const CURRICULUM_REGISTRY: Record<string, CurriculumModule> = {
  "welcome-to-networking": welcomeModuleData,
  "module-welcome-to-networking": welcomeModuleData,
};

/**
 * Retrieves curriculum module metadata and lessons by slug or id.
 */
export function getCurriculumModule(
  slugOrId: string
): CurriculumModule | undefined {
  return CURRICULUM_REGISTRY[slugOrId];
}

/**
 * Retrieves a specific curriculum lesson by module and lesson slug or id.
 */
export function getCurriculumLesson(
  moduleSlugOrId: string,
  lessonSlugOrId: string
): CurriculumLesson | undefined {
  const mod = getCurriculumModule(moduleSlugOrId);
  if (!mod) return undefined;
  return mod.lessons.find(
    (l) => l.slug === lessonSlugOrId || l.id === lessonSlugOrId
  );
}
