import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLearnerRemediationPlan } from "./remediation-queries";
import { getCurriculumGraph } from "./queries";
import { getLearnerMasteryOverview } from "./mastery-queries";

vi.mock("./queries", () => ({
  getCurriculumGraph: vi.fn(),
}));

vi.mock("./mastery-queries", () => ({
  getLearnerMasteryOverview: vi.fn(),
}));

const mockGetCurriculumGraph = vi.mocked(getCurriculumGraph);
const mockGetLearnerMasteryOverview = vi.mocked(getLearnerMasteryOverview);

describe("Remediation Queries Adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty plan if no userId provided", async () => {
    const plan = await getLearnerRemediationPlan(null);
    expect(plan.totalNeedsReviewOutcomes).toBe(0);
    expect(plan.totalRemediationLessons).toBe(0);
    expect(plan.lessons).toHaveLength(0);
  });

  it("fetches curriculum and mastery overview to build remediation plan", async () => {
    mockGetCurriculumGraph.mockResolvedValueOnce({
      paths: [
        {
          id: "path-1",
          slug: "net-fund",
          title: "Dasar Jaringan",
          orderIndex: 0,
          modules: [
            {
              id: "mod-1",
              slug: "ip",
              title: "IP",
              orderIndex: 0,
              lessons: [
                {
                  id: "les-1",
                  slug: "ipv4",
                  title: "IPv4",
                  orderIndex: 0,
                },
              ],
            },
          ],
        },
      ],
    });

    mockGetLearnerMasteryOverview.mockResolvedValueOnce({
      totalOutcomes: 1,
      masteredCount: 0,
      needsReviewCount: 1,
      inProgressCount: 0,
      notStartedCount: 0,
      masteryPercentage: 0,
      modules: [
        {
          moduleId: "mod-1",
          moduleSlug: "ip",
          moduleTitle: "IP",
          pathId: "path-1",
          pathSlug: "net-fund",
          pathTitle: "Dasar Jaringan",
          totalOutcomes: 1,
          masteredCount: 0,
          needsReviewCount: 1,
          inProgressCount: 0,
          notStartedCount: 0,
          outcomes: [
            {
              outcomeId: "out-1",
              text: "Konsep Dasar IP",
              state: "NEEDS_REVIEW",
              pathId: "path-1",
              pathSlug: "net-fund",
              pathTitle: "Dasar Jaringan",
              moduleId: "mod-1",
              moduleSlug: "ip",
              moduleTitle: "IP",
              lessonId: "les-1",
              lessonSlug: "ipv4",
              lessonTitle: "IPv4",
              latestAttemptAt: new Date(),
              evidenceVersion: "1.0",
              remediationLessonIds: ["les-1"],
            },
          ],
        },
      ],
    });

    const plan = await getLearnerRemediationPlan("user-123");
    expect(plan.totalNeedsReviewOutcomes).toBe(1);
    expect(plan.totalRemediationLessons).toBe(1);
    expect(plan.lessons[0].lessonId).toBe("les-1");
    expect(plan.lessons[0].href).toBe("/learn/net-fund/ip/ipv4");
  });
});
