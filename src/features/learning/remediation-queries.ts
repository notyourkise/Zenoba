import { getCurriculumGraph } from "./queries";
import { getLearnerMasteryOverview } from "./mastery-queries";
import { resolveRemediationPlan, type RemediationPlan } from "./remediation";
import type { OutcomeMastery } from "./mastery";

/**
 * Server query adapter for learner remediation plan.
 * Fetches authoritative mastery overview and curriculum graph, then resolves
 * the deduplicated, ordered remediation plan.
 */
export async function getLearnerRemediationPlan(
  userId?: string | null
): Promise<RemediationPlan> {
  if (!userId) {
    return {
      totalNeedsReviewOutcomes: 0,
      totalRemediationLessons: 0,
      lessons: [],
    };
  }

  const [curriculum, masteryOverview] = await Promise.all([
    getCurriculumGraph(),
    getLearnerMasteryOverview(userId),
  ]);

  const allOutcomes: OutcomeMastery[] = masteryOverview.modules.flatMap(
    (m) => m.outcomes
  );

  return resolveRemediationPlan(allOutcomes, curriculum);
}
