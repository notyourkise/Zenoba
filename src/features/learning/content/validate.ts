import {
  CurriculumLesson,
  CurriculumLessonSchema,
  CurriculumModule,
  CurriculumModuleSchema,
  CurriculumPath,
  CurriculumPathSchema,
} from "./schema";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export interface LessonValidationOptions {
  serverAssessmentItemIds?: string[];
}

export interface ModuleValidationOptions {
  moduleServerAssessmentItemIds?: string[];
}

/**
 * Validates a curriculum lesson against schema rules, ID uniqueness,
 * two-way outcome traceability, and self-prerequisite constraints.
 */
export function validateCurriculumLesson(
  payload: unknown,
  options?: LessonValidationOptions
): ValidationResult<CurriculumLesson> {
  const parseResult = CurriculumLessonSchema.safeParse(payload);
  if (!parseResult.success) {
    return {
      success: false,
      errors: parseResult.error.issues.map(
        (issue) => `[${issue.path.join(".")}] ${issue.message}`
      ),
    };
  }

  const lesson = parseResult.data;
  const errors: string[] = [];

  // 1. Check duplicate outcome IDs
  const outcomeIds = new Set<string>();
  for (const outcome of lesson.outcomes) {
    if (outcomeIds.has(outcome.id)) {
      errors.push(`Duplicate outcome ID found: "${outcome.id}"`);
    }
    outcomeIds.add(outcome.id);
  }

  // 2. Check duplicate evidence outcome IDs
  const evidenceOutcomeIds = new Set<string>();
  for (const ev of lesson.evidence) {
    if (evidenceOutcomeIds.has(ev.outcomeId)) {
      errors.push(
        `Duplicate evidence mapping for outcome ID: "${ev.outcomeId}"`
      );
    }
    evidenceOutcomeIds.add(ev.outcomeId);
  }

  // 3. Inspect block IDs and quiz IDs
  const blockIds = new Set<string>();
  const assessmentItemIds = new Set<string>(
    options?.serverAssessmentItemIds || []
  );

  for (const block of lesson.content.blocks) {
    if (block.id) {
      if (blockIds.has(block.id)) {
        errors.push(`Duplicate block ID found: "${block.id}"`);
      }
      blockIds.add(block.id);
      assessmentItemIds.add(block.id);
    }
    if (block.type === "quiz") {
      assessmentItemIds.add(block.quizId);
    }
  }

  // 4. Two-way traceability check
  // (a) Every declared outcome must have evidence
  for (const outcomeId of outcomeIds) {
    if (!evidenceOutcomeIds.has(outcomeId)) {
      errors.push(`Outcome "${outcomeId}" has no mapped evidence`);
    }
  }

  // (b) Every evidence mapping must point to a declared outcome
  for (const ev of lesson.evidence) {
    if (!outcomeIds.has(ev.outcomeId)) {
      errors.push(
        `Evidence references unknown outcome ID: "${ev.outcomeId}"`
      );
    }

    // Check teaching blocks
    if (!ev.teachingBlockIds || ev.teachingBlockIds.length === 0) {
      errors.push(
        `Outcome "${ev.outcomeId}" must have at least one teaching block ID`
      );
    } else {
      for (const blockId of ev.teachingBlockIds) {
        if (!blockIds.has(blockId)) {
          errors.push(
            `Teaching block "${blockId}" for outcome "${ev.outcomeId}" not found in lesson content blocks`
          );
        }
      }
    }

    // Check activity blocks
    if (!ev.activityIds || ev.activityIds.length === 0) {
      errors.push(
        `Outcome "${ev.outcomeId}" must have at least one activity ID`
      );
    } else {
      for (const actId of ev.activityIds) {
        if (!blockIds.has(actId)) {
          errors.push(
            `Activity block "${actId}" for outcome "${ev.outcomeId}" not found in lesson content blocks`
          );
        }
      }
    }

    // Check assessment items
    if (!ev.assessmentItemIds || ev.assessmentItemIds.length === 0) {
      errors.push(
        `Outcome "${ev.outcomeId}" must have at least one assessment item ID`
      );
    } else {
      for (const itemId of ev.assessmentItemIds) {
        if (!assessmentItemIds.has(itemId)) {
          errors.push(
            `Assessment item "${itemId}" for outcome "${ev.outcomeId}" not found in lesson quizzes or server assessments`
          );
        }
      }
    }
  }

  // 5. Self-prerequisite check
  if (
    lesson.prerequisites.includes(lesson.id) ||
    lesson.prerequisites.includes(lesson.slug)
  ) {
    errors.push(
      `Lesson "${lesson.id}" cannot list itself as a prerequisite`
    );
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: lesson };
}

/**
 * Validates a curriculum module, checking ID uniqueness, nested lessons,
 * prerequisite acyclicity, and final assessment threshold consistency.
 */
export function validateCurriculumModule(
  payload: unknown,
  options?: ModuleValidationOptions
): ValidationResult<CurriculumModule> {
  const parseResult = CurriculumModuleSchema.safeParse(payload);
  if (!parseResult.success) {
    return {
      success: false,
      errors: parseResult.error.issues.map(
        (issue) => `[${issue.path.join(".")}] ${issue.message}`
      ),
    };
  }

  const moduleData = parseResult.data;
  const errors: string[] = [];

  // 1. Check duplicate module outcome IDs
  const moduleOutcomeIds = new Set<string>();
  for (const outcome of moduleData.outcomes) {
    if (moduleOutcomeIds.has(outcome.id)) {
      errors.push(`Duplicate module outcome ID found: "${outcome.id}"`);
    }
    moduleOutcomeIds.add(outcome.id);
  }

  // 2. Check duplicate lesson IDs and slugs
  const lessonIds = new Set<string>();
  const lessonSlugs = new Set<string>();
  for (const lesson of moduleData.lessons) {
    if (lessonIds.has(lesson.id)) {
      errors.push(`Duplicate lesson ID in module: "${lesson.id}"`);
    }
    lessonIds.add(lesson.id);

    if (lessonSlugs.has(lesson.slug)) {
      errors.push(`Duplicate lesson slug in module: "${lesson.slug}"`);
    }
    lessonSlugs.add(lesson.slug);
  }

  // 3. Validate each lesson
  for (const lesson of moduleData.lessons) {
    const lessonValidation = validateCurriculumLesson(lesson, {
      serverAssessmentItemIds: options?.moduleServerAssessmentItemIds,
    });
    if (!lessonValidation.success) {
      errors.push(
        ...lessonValidation.errors.map(
          (err) => `[Lesson ${lesson.slug}] ${err}`
        )
      );
    }
  }

  // 4. Prerequisite cycle detection among lessons within the module
  const cycleError = detectLessonCycles(moduleData.lessons);
  if (cycleError) {
    errors.push(cycleError);
  }

  // 5. Final assessment threshold verification
  if (moduleData.finalAssessment) {
    const fa = moduleData.finalAssessment;
    if (fa.conceptPassThreshold > fa.conceptQuestionCount) {
      errors.push(
        `Final assessment concept pass threshold (${fa.conceptPassThreshold}) cannot exceed question count (${fa.conceptQuestionCount})`
      );
    }
    if (fa.practicalPassThreshold > fa.practicalCriteriaCount) {
      errors.push(
        `Final assessment practical pass threshold (${fa.practicalPassThreshold}) cannot exceed criteria count (${fa.practicalCriteriaCount})`
      );
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: moduleData };
}

/**
 * Validates an entire curriculum path, ensuring module uniqueness and module acyclicity.
 */
export function validateCurriculumPath(
  payload: unknown
): ValidationResult<CurriculumPath> {
  const parseResult = CurriculumPathSchema.safeParse(payload);
  if (!parseResult.success) {
    return {
      success: false,
      errors: parseResult.error.issues.map(
        (issue) => `[${issue.path.join(".")}] ${issue.message}`
      ),
    };
  }

  const path = parseResult.data;
  const errors: string[] = [];

  const moduleIds = new Set<string>();
  const moduleSlugs = new Set<string>();

  for (const mod of path.modules) {
    if (moduleIds.has(mod.id)) {
      errors.push(`Duplicate module ID in path: "${mod.id}"`);
    }
    moduleIds.add(mod.id);

    if (moduleSlugs.has(mod.slug)) {
      errors.push(`Duplicate module slug in path: "${mod.slug}"`);
    }
    moduleSlugs.add(mod.slug);

    const moduleValidation = validateCurriculumModule(mod);
    if (!moduleValidation.success) {
      errors.push(
        ...moduleValidation.errors.map(
          (err) => `[Module ${mod.slug}] ${err}`
        )
      );
    }
  }

  // Module prerequisite cycle detection
  const moduleCycleError = detectModuleCycles(path.modules);
  if (moduleCycleError) {
    errors.push(moduleCycleError);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: path };
}

/**
 * Detects cycles in lesson prerequisite graph using Depth First Search (DFS).
 */
function detectLessonCycles(lessons: CurriculumLesson[]): string | null {
  const adjacency = new Map<string, string[]>();
  const knownKeys = new Set<string>();

  for (const lesson of lessons) {
    knownKeys.add(lesson.id);
    knownKeys.add(lesson.slug);
    // map both id and slug to their prerequisite list
    adjacency.set(lesson.id, lesson.prerequisites);
    adjacency.set(lesson.slug, lesson.prerequisites);
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(node: string, path: string[]): string | null {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = adjacency.get(node) || [];
    for (const neighbor of neighbors) {
      if (!knownKeys.has(neighbor)) {
        continue; // external prerequisite, not part of intra-module cycle
      }
      if (!visited.has(neighbor)) {
        const cycle = dfs(neighbor, [...path]);
        if (cycle) return cycle;
      } else if (recursionStack.has(neighbor)) {
        return `Prerequisite cycle detected: ${path.join(" -> ")} -> ${neighbor}`;
      }
    }

    recursionStack.delete(node);
    return null;
  }

  for (const lesson of lessons) {
    if (!visited.has(lesson.id)) {
      const cycle = dfs(lesson.id, []);
      if (cycle) return cycle;
    }
  }

  return null;
}

/**
 * Detects cycles in module prerequisite graph using Depth First Search (DFS).
 */
function detectModuleCycles(modules: CurriculumModule[]): string | null {
  const adjacency = new Map<string, string[]>();
  const knownKeys = new Set<string>();

  for (const mod of modules) {
    knownKeys.add(mod.id);
    knownKeys.add(mod.slug);
    adjacency.set(mod.id, mod.prerequisites);
    adjacency.set(mod.slug, mod.prerequisites);
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(node: string, path: string[]): string | null {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = adjacency.get(node) || [];
    for (const neighbor of neighbors) {
      if (!knownKeys.has(neighbor)) {
        continue;
      }
      if (!visited.has(neighbor)) {
        const cycle = dfs(neighbor, [...path]);
        if (cycle) return cycle;
      } else if (recursionStack.has(neighbor)) {
        return `Module prerequisite cycle detected: ${path.join(" -> ")} -> ${neighbor}`;
      }
    }

    recursionStack.delete(node);
    return null;
  }

  for (const mod of modules) {
    if (!visited.has(mod.id)) {
      const cycle = dfs(mod.id, []);
      if (cycle) return cycle;
    }
  }

  return null;
}
