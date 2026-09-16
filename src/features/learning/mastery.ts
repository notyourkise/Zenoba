export type MasteryState =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "NEEDS_REVIEW"
  | "MASTERED";

export interface OutcomeEvidenceRecord {
  assessmentId: string;
  moduleId?: string | null;
  lessonId?: string | null;
  outcomeId?: string;
  passed: boolean;
  score: number;
  version: string;
  submittedAt: Date | string;
}

export interface DeclaredOutcome {
  id: string;
  text: string;
  description?: string;
  moduleId: string;
  moduleSlug: string;
  moduleTitle: string;
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  lessonId?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  currentVersion?: string;
  assessmentItemIds?: string[];
  remediationLessonIds?: string[];
  remediationLessonSlug?: string;
}

export interface OutcomeMastery {
  outcomeId: string;
  text: string;
  description?: string;
  state: MasteryState;
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  moduleId: string;
  moduleSlug: string;
  moduleTitle: string;
  lessonId?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  latestAttemptAt: Date | null;
  evidenceVersion: string | null;
  remediationLessonIds: string[];
}

export interface ModuleMasteryGroup {
  moduleId: string;
  moduleSlug: string;
  moduleTitle: string;
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  totalOutcomes: number;
  masteredCount: number;
  needsReviewCount: number;
  inProgressCount: number;
  notStartedCount: number;
  outcomes: OutcomeMastery[];
}

export interface LearnerMasterySummary {
  totalOutcomes: number;
  masteredCount: number;
  needsReviewCount: number;
  inProgressCount: number;
  notStartedCount: number;
  masteryPercentage: number;
  modules: ModuleMasteryGroup[];
}

export interface LessonProgressSummary {
  status: string;
  completedAt?: Date | null;
}

/**
 * Pure domain function to derive outcome mastery from authoritative evidence.
 * Deterministic guarantees:
 * - Current-version passed evidence produces MASTERED (when lesson completed).
 * - Failed latest evidence produces NEEDS_REVIEW.
 * - Superseded / older version evidence produces NEEDS_REVIEW without silent regrading.
 * - Lesson actively studied or completed without passing assessment produces IN_PROGRESS.
 * - Unattempted produces NOT_STARTED.
 */
export function deriveOutcomeMasteries(
  declaredOutcomes: DeclaredOutcome[],
  evidenceRecords: OutcomeEvidenceRecord[],
  lessonProgressMap: Map<string, LessonProgressSummary>
): OutcomeMastery[] {
  const results: OutcomeMastery[] = [];

  for (const outcome of declaredOutcomes) {
    const currentVersion = outcome.currentVersion || "1.0";

    // 1. Find matching evidence records
    const matchingEvidence = evidenceRecords.filter((rec) => {
      if (rec.outcomeId && rec.outcomeId === outcome.id) {
        return true;
      }
      if (outcome.assessmentItemIds && outcome.assessmentItemIds.includes(rec.assessmentId)) {
        return true;
      }
      if (outcome.lessonId && rec.lessonId === outcome.lessonId) {
        return true;
      }
      return false;
    });

    // 2. Sort by submittedAt descending to locate latest attempt
    matchingEvidence.sort((a, b) => {
      const timeA = new Date(a.submittedAt).getTime();
      const timeB = new Date(b.submittedAt).getTime();
      return timeB - timeA;
    });

    const latestAttempt = matchingEvidence[0] || null;

    // 3. Resolve remediation lessons
    const remediationSet = new Set<string>();
    if (outcome.remediationLessonIds) {
      for (const id of outcome.remediationLessonIds) {
        remediationSet.add(id);
      }
    }
    if (outcome.lessonId) {
      remediationSet.add(outcome.lessonId);
    }
    const remediationLessonIds = Array.from(remediationSet);

    // 4. Determine state
    let state: MasteryState = "NOT_STARTED";
    let latestAttemptAt: Date | null = null;
    let evidenceVersion: string | null = null;

    if (latestAttempt) {
      latestAttemptAt = new Date(latestAttempt.submittedAt);
      evidenceVersion = latestAttempt.version;

      if (!latestAttempt.passed) {
        // Latest attempt failed -> needs remediation/review
        state = "NEEDS_REVIEW";
      } else if (latestAttempt.version !== currentVersion) {
        // Evidence is from superseded/older curriculum version -> needs review/refresher
        state = "NEEDS_REVIEW";
      } else {
        // Check lesson progress if tied to a lesson
        const lessonProgress = outcome.lessonId
          ? lessonProgressMap.get(outcome.lessonId)
          : null;

        if (outcome.lessonId && lessonProgress?.status !== "COMPLETED") {
          state = "IN_PROGRESS";
        } else {
          state = "MASTERED";
        }
      }
    } else {
      // No assessment evidence yet -> check if lesson is in progress or completed
      const lessonProgress = outcome.lessonId
        ? lessonProgressMap.get(outcome.lessonId)
        : null;

      if (
        lessonProgress?.status === "IN_PROGRESS" ||
        lessonProgress?.status === "COMPLETED"
      ) {
        state = "IN_PROGRESS";
      } else {
        state = "NOT_STARTED";
      }
    }

    results.push({
      outcomeId: outcome.id,
      text: outcome.text,
      description: outcome.description,
      state,
      pathId: outcome.pathId,
      pathSlug: outcome.pathSlug,
      pathTitle: outcome.pathTitle,
      moduleId: outcome.moduleId,
      moduleSlug: outcome.moduleSlug,
      moduleTitle: outcome.moduleTitle,
      lessonId: outcome.lessonId,
      lessonSlug: outcome.lessonSlug,
      lessonTitle: outcome.lessonTitle,
      latestAttemptAt,
      evidenceVersion,
      remediationLessonIds,
    });
  }

  return results;
}

/**
 * Groups a flat list of outcome masteries into module hierarchies.
 */
export function groupMasteryByModule(
  outcomes: OutcomeMastery[]
): ModuleMasteryGroup[] {
  const groupsMap = new Map<string, ModuleMasteryGroup>();

  for (const item of outcomes) {
    const key = `${item.pathSlug}:${item.moduleSlug}`;
    let group = groupsMap.get(key);

    if (!group) {
      group = {
        moduleId: item.moduleId,
        moduleSlug: item.moduleSlug,
        moduleTitle: item.moduleTitle,
        pathId: item.pathId,
        pathSlug: item.pathSlug,
        pathTitle: item.pathTitle,
        totalOutcomes: 0,
        masteredCount: 0,
        needsReviewCount: 0,
        inProgressCount: 0,
        notStartedCount: 0,
        outcomes: [],
      };
      groupsMap.set(key, group);
    }

    group.totalOutcomes++;
    if (item.state === "MASTERED") group.masteredCount++;
    else if (item.state === "NEEDS_REVIEW") group.needsReviewCount++;
    else if (item.state === "IN_PROGRESS") group.inProgressCount++;
    else if (item.state === "NOT_STARTED") group.notStartedCount++;

    group.outcomes.push(item);
  }

  return Array.from(groupsMap.values());
}

/**
 * Aggregates overall mastery metrics from module groups.
 */
export function summarizeLearnerMastery(
  groups: ModuleMasteryGroup[]
): LearnerMasterySummary {
  let totalOutcomes = 0;
  let masteredCount = 0;
  let needsReviewCount = 0;
  let inProgressCount = 0;
  let notStartedCount = 0;

  for (const group of groups) {
    totalOutcomes += group.totalOutcomes;
    masteredCount += group.masteredCount;
    needsReviewCount += group.needsReviewCount;
    inProgressCount += group.inProgressCount;
    notStartedCount += group.notStartedCount;
  }

  const masteryPercentage =
    totalOutcomes > 0 ? Math.round((masteredCount / totalOutcomes) * 100) : 0;

  return {
    totalOutcomes,
    masteredCount,
    needsReviewCount,
    inProgressCount,
    notStartedCount,
    masteryPercentage,
    modules: groups,
  };
}
