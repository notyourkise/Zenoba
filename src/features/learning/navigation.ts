import type { LearningGraph, LearnerEvidenceSnapshot } from "./continuation";

export interface NavigationLessonLink {
  slug: string;
  title: string;
  href: string;
  moduleSlug: string;
  moduleTitle: string;
}

export interface NextLessonLink extends NavigationLessonLink {
  isLocked: boolean;
  reason?: string;
}

export interface ModuleAssessmentLink {
  href: string;
  isUnlocked: boolean;
  title?: string;
  reason?: string;
}

export interface LessonNavigationContext {
  previousLesson: NavigationLessonLink | null;
  nextLesson: NextLessonLink | null;
  moduleAssessment: ModuleAssessmentLink | null;
  nextModuleFirstLesson: NextLessonLink | null;
  exitHref: string;
}

export interface ResolveLessonNavigationOptions {
  curriculum: LearningGraph;
  pathSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  evidence: LearnerEvidenceSnapshot;
}

/**
 * Pure domain resolver for contextual lesson navigation:
 * - Within-module previous and next lessons
 * - Cross-module previous transitions
 * - Module assessment transitions upon completing module lessons
 * - Cross-module next lesson transitions with prerequisite/assessment unlock validation
 */
export function resolveLessonNavigation({
  curriculum,
  pathSlug,
  moduleSlug,
  lessonSlug,
  evidence,
}: ResolveLessonNavigationOptions): LessonNavigationContext | null {
  // Locate path
  const path = curriculum.paths.find((p) => p.slug === pathSlug);
  if (!path) return null;

  // Locate module
  const moduleIndex = path.modules.findIndex((m) => m.slug === moduleSlug);
  if (moduleIndex === -1) return null;
  const currentModule = path.modules[moduleIndex];

  // Locate lesson
  const lessonIndex = currentModule.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIndex === -1) return null;

  const completedSet =
    evidence.completedLessonIds instanceof Set
      ? evidence.completedLessonIds
      : new Set(evidence.completedLessonIds);

  // 1. Previous Lesson
  let previousLesson: NavigationLessonLink | null = null;
  if (lessonIndex > 0) {
    const prev = currentModule.lessons[lessonIndex - 1];
    previousLesson = {
      slug: prev.slug,
      title: prev.title,
      href: `/learn/${path.slug}/${currentModule.slug}/${prev.slug}`,
      moduleSlug: currentModule.slug,
      moduleTitle: currentModule.title,
    };
  } else if (moduleIndex > 0) {
    const prevModule = path.modules[moduleIndex - 1];
    if (prevModule.lessons.length > 0) {
      const prev = prevModule.lessons[prevModule.lessons.length - 1];
      previousLesson = {
        slug: prev.slug,
        title: prev.title,
        href: `/learn/${path.slug}/${prevModule.slug}/${prev.slug}`,
        moduleSlug: prevModule.slug,
        moduleTitle: prevModule.title,
      };
    }
  }

  // 2. Next Lesson (in same module)
  let nextLesson: NextLessonLink | null = null;
  if (lessonIndex < currentModule.lessons.length - 1) {
    const next = currentModule.lessons[lessonIndex + 1];
    let isLocked = false;
    let reason: string | undefined;

    if (next.prerequisiteLessonIds && next.prerequisiteLessonIds.length > 0) {
      const unmet = next.prerequisiteLessonIds.some((pId) => !completedSet.has(pId));
      if (unmet) {
        isLocked = true;
        reason = "Selesaikan pelajaran prasyarat terlebih dahulu";
      }
    }

    nextLesson = {
      slug: next.slug,
      title: next.title,
      href: `/learn/${path.slug}/${currentModule.slug}/${next.slug}`,
      moduleSlug: currentModule.slug,
      moduleTitle: currentModule.title,
      isLocked,
      reason,
    };
  }

  // 3. Module Assessment
  let moduleAssessment: ModuleAssessmentLink | null = null;
  if (currentModule.assessmentId) {
    const allModuleLessonsCompleted = currentModule.lessons.every((l) =>
      completedSet.has(l.id)
    );

    moduleAssessment = {
      href: `/learn/${path.slug}/${currentModule.slug}/assessment`,
      isUnlocked: allModuleLessonsCompleted,
      reason: allModuleLessonsCompleted
        ? undefined
        : "Selesaikan semua pelajaran dalam modul ini terlebih dahulu",
    };
  }

  // 4. Next Module's First Lesson
  let nextModuleFirstLesson: NextLessonLink | null = null;
  if (moduleIndex < path.modules.length - 1) {
    const nextMod = path.modules[moduleIndex + 1];
    if (nextMod.lessons.length > 0) {
      const firstLessonOfNextMod = nextMod.lessons[0];
      let isLocked = false;
      let reason: string | undefined;

      // If current module has an assessment, require that assessment to be passed
      if (currentModule.assessmentId) {
        const passedAssessment = evidence.moduleAssessments.some(
          (a) =>
            (a.moduleId === currentModule.id || a.assessmentId === currentModule.assessmentId) &&
            a.passed
        );
        if (!passedAssessment) {
          isLocked = true;
          reason = "Lulus ujian akhir modul sebelumnya terlebih dahulu";
        }
      } else {
        // Current module has no assessment; all lessons of current module must be completed
        const allModuleLessonsCompleted = currentModule.lessons.every((l) =>
          completedSet.has(l.id)
        );
        if (!allModuleLessonsCompleted) {
          isLocked = true;
          reason = "Selesaikan semua pelajaran dalam modul sebelumnya terlebih dahulu";
        }
      }

      // Also check prerequisites on firstLessonOfNextMod itself
      if (!isLocked && firstLessonOfNextMod.prerequisiteLessonIds) {
        const unmet = firstLessonOfNextMod.prerequisiteLessonIds.some(
          (pId) => !completedSet.has(pId)
        );
        if (unmet) {
          isLocked = true;
          reason = "Selesaikan pelajaran prasyarat terlebih dahulu";
        }
      }

      nextModuleFirstLesson = {
        slug: firstLessonOfNextMod.slug,
        title: firstLessonOfNextMod.title,
        href: `/learn/${path.slug}/${nextMod.slug}/${firstLessonOfNextMod.slug}`,
        moduleSlug: nextMod.slug,
        moduleTitle: nextMod.title,
        isLocked,
        reason,
      };
    }
  }

  return {
    previousLesson,
    nextLesson,
    moduleAssessment,
    nextModuleFirstLesson,
    exitHref: `/learn/${path.slug}`,
  };
}
