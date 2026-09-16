/**
 * Remediation Domain Engine
 *
 * Maps unmet learning outcomes and failed assessment evidence to the smallest,
 * deduplicated, topologically ordered set of prerequisite remediation lessons.
 *
 * Core principles:
 * 1. Safe Explanations: Explains concepts to review without ever revealing questions or answer keys.
 * 2. Deduplication: Multiple unmet outcomes mapped to the same lesson are grouped together.
 * 3. Topological & Curriculum Ordering: Prerequisite lessons precede dependent lessons.
 * 4. Resilience: Stale, removed, or unmapped lesson IDs are handled gracefully without throwing.
 */

import type { OutcomeMastery } from "./mastery";
import type { LearningGraph, GraphLesson, GraphModule, GraphPath } from "./continuation";

export interface UnmetOutcomeDetail {
  outcomeId: string;
  text: string;
  description?: string;
  reason: string;
}

export interface RemediationTargetLesson {
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  moduleId: string;
  moduleSlug: string;
  moduleTitle: string;
  pathSlug: string;
  pathTitle: string;
  href: string;
  unmetOutcomes: UnmetOutcomeDetail[];
  reasons: string[];
  orderScore: number;
}

export interface RemediationPlan {
  totalNeedsReviewOutcomes: number;
  totalRemediationLessons: number;
  lessons: RemediationTargetLesson[];
}

interface IndexedLesson {
  lesson: GraphLesson;
  module: GraphModule;
  path: GraphPath;
  orderScore: number;
}

/**
 * Resolves a deduplicated, ordered remediation plan from outcome masteries and the curriculum graph.
 */
export function resolveRemediationPlan(
  masteries: OutcomeMastery[],
  curriculum: LearningGraph
): RemediationPlan {
  // 1. Filter outcomes that need review / remediation
  const failedOutcomes = masteries.filter((m) => m.state === "NEEDS_REVIEW");

  if (failedOutcomes.length === 0) {
    return {
      totalNeedsReviewOutcomes: 0,
      totalRemediationLessons: 0,
      lessons: [],
    };
  }

  // 2. Index curriculum lessons
  const lessonIndex = new Map<string, IndexedLesson>();
  const lessonSlugIndex = new Map<string, IndexedLesson>();

  for (const path of curriculum.paths) {
    for (const mod of path.modules) {
      for (const lesson of mod.lessons) {
        const orderScore = path.orderIndex * 10000 + mod.orderIndex * 100 + lesson.orderIndex;
        const entry: IndexedLesson = {
          lesson,
          module: mod,
          path,
          orderScore,
        };
        lessonIndex.set(lesson.id, entry);
        lessonSlugIndex.set(lesson.slug, entry);
      }
    }
  }

  // 3. Map failed outcomes to target lessons
  const targetMap = new Map<string, RemediationTargetLesson>();

  for (const outcome of failedOutcomes) {
    // Determine candidate lesson IDs for remediation
    const candidateIds = new Set<string>();
    if (outcome.remediationLessonIds && outcome.remediationLessonIds.length > 0) {
      for (const id of outcome.remediationLessonIds) {
        candidateIds.add(id);
      }
    }
    if (outcome.lessonId) {
      candidateIds.add(outcome.lessonId);
    }

    const safeReason = outcome.evidenceVersion
      ? `Penguatan konsep sasaran kompetensi: ${outcome.text}. Evaluasi asesmen belum memenuhi standar kelulusan.`
      : `Penguatan konsep sasaran kompetensi: ${outcome.text}.`;

    for (const candidateId of candidateIds) {
      const indexed = lessonIndex.get(candidateId) || lessonSlugIndex.get(candidateId);
      if (!indexed) {
        // Unmapped or removed lesson; skip safely
        continue;
      }

      const { lesson, module: mod, path, orderScore } = indexed;
      let target = targetMap.get(lesson.id);
      if (!target) {
        target = {
          lessonId: lesson.id,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          moduleId: mod.id,
          moduleSlug: mod.slug,
          moduleTitle: mod.title,
          pathSlug: path.slug,
          pathTitle: path.title,
          href: `/learn/${path.slug}/${mod.slug}/${lesson.slug}`,
          unmetOutcomes: [],
          reasons: [],
          orderScore,
        };
        targetMap.set(lesson.id, target);
      }

      // Add unmet outcome if not already recorded
      if (!target.unmetOutcomes.some((o) => o.outcomeId === outcome.outcomeId)) {
        target.unmetOutcomes.push({
          outcomeId: outcome.outcomeId,
          text: outcome.text,
          description: outcome.description,
          reason: safeReason,
        });
      }

      // Add safe reason if not already present
      if (!target.reasons.includes(safeReason)) {
        target.reasons.push(safeReason);
      }
    }
  }

  // 4. Sort lessons topologically and by curriculum sequence
  const targetList = Array.from(targetMap.values());

  targetList.sort((a, b) => {
    // If a is a prerequisite of b, a must come first (-1)
    const indexedB = lessonIndex.get(b.lessonId);
    if (indexedB?.lesson.prerequisiteLessonIds?.includes(a.lessonId)) {
      return -1;
    }
    // If b is a prerequisite of a, b must come first (1)
    const indexedA = lessonIndex.get(a.lessonId);
    if (indexedA?.lesson.prerequisiteLessonIds?.includes(b.lessonId)) {
      return 1;
    }
    // Otherwise, curriculum orderScore
    return a.orderScore - b.orderScore;
  });

  return {
    totalNeedsReviewOutcomes: failedOutcomes.length,
    totalRemediationLessons: targetList.length,
    lessons: targetList,
  };
}
