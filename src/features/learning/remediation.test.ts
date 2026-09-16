import { describe, it, expect } from "vitest";
import { resolveRemediationPlan } from "./remediation";
import type { OutcomeMastery } from "./mastery";
import type { LearningGraph } from "./continuation";

describe("Remediation Domain Engine", () => {
  const sampleCurriculum: LearningGraph = {
    paths: [
      {
        id: "path-1",
        slug: "network-fundamentals",
        title: "Network Fundamentals",
        orderIndex: 0,
        modules: [
          {
            id: "mod-1",
            slug: "ip-addressing",
            title: "Pengalamatan IP",
            orderIndex: 0,
            lessons: [
              {
                id: "les-1",
                slug: "ipv4-basics",
                title: "Pengenalan IPv4",
                orderIndex: 0,
                prerequisiteLessonIds: [],
              },
              {
                id: "les-2",
                slug: "subnet-masks",
                title: "Subnet Masking",
                orderIndex: 1,
                prerequisiteLessonIds: ["les-1"],
              },
              {
                id: "les-3",
                slug: "cidr-notation",
                title: "Notasi CIDR",
                orderIndex: 2,
                prerequisiteLessonIds: ["les-2"],
              },
            ],
          },
        ],
      },
    ],
  };

  it("returns empty remediation plan when no outcomes need review", () => {
    const masteries: OutcomeMastery[] = [
      {
        outcomeId: "out-1",
        text: "Memahami struktur oktet IPv4",
        state: "MASTERED",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-1",
        lessonSlug: "ipv4-basics",
        lessonTitle: "Pengenalan IPv4",
        latestAttemptAt: new Date(),
        evidenceVersion: "1.0",
        remediationLessonIds: ["les-1"],
      },
      {
        outcomeId: "out-2",
        text: "Menghitung subnet mask",
        state: "IN_PROGRESS",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-2",
        lessonSlug: "subnet-masks",
        lessonTitle: "Subnet Masking",
        latestAttemptAt: null,
        evidenceVersion: null,
        remediationLessonIds: ["les-2"],
      },
    ];

    const plan = resolveRemediationPlan(masteries, sampleCurriculum);

    expect(plan.totalNeedsReviewOutcomes).toBe(0);
    expect(plan.totalRemediationLessons).toBe(0);
    expect(plan.lessons).toHaveLength(0);
  });

  it("maps failed outcomes to deduplicated target lessons with safe explanations", () => {
    const masteries: OutcomeMastery[] = [
      {
        outcomeId: "out-1",
        text: "Memahami struktur oktet IPv4",
        state: "MASTERED",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-1",
        lessonSlug: "ipv4-basics",
        lessonTitle: "Pengenalan IPv4",
        latestAttemptAt: new Date(),
        evidenceVersion: "1.0",
        remediationLessonIds: ["les-1"],
      },
      {
        outcomeId: "out-2",
        text: "Menghitung subnet mask biner",
        state: "NEEDS_REVIEW",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-2",
        lessonSlug: "subnet-masks",
        lessonTitle: "Subnet Masking",
        latestAttemptAt: new Date(),
        evidenceVersion: "1.0",
        remediationLessonIds: ["les-2"],
      },
      {
        outcomeId: "out-3",
        text: "Menentukan network address dengan netmask",
        state: "NEEDS_REVIEW",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-2",
        lessonSlug: "subnet-masks",
        lessonTitle: "Subnet Masking",
        latestAttemptAt: new Date(),
        evidenceVersion: "1.0",
        remediationLessonIds: ["les-2"],
      },
    ];

    const plan = resolveRemediationPlan(masteries, sampleCurriculum);

    expect(plan.totalNeedsReviewOutcomes).toBe(2);
    // Even though 2 outcomes failed, they both map to les-2 (deduplicated)
    expect(plan.totalRemediationLessons).toBe(1);
    expect(plan.lessons).toHaveLength(1);

    const target = plan.lessons[0];
    expect(target.lessonId).toBe("les-2");
    expect(target.lessonSlug).toBe("subnet-masks");
    expect(target.lessonTitle).toBe("Subnet Masking");
    expect(target.href).toBe("/learn/network-fundamentals/ip-addressing/subnet-masks");
    expect(target.unmetOutcomes).toHaveLength(2);
    expect(target.unmetOutcomes[0].text).toBe("Menghitung subnet mask biner");
    expect(target.unmetOutcomes[1].text).toBe("Menentukan network address dengan netmask");

    // Safe explanation: never leaks answer key
    expect(target.reasons.length).toBeGreaterThan(0);
    expect(target.reasons[0]).not.toMatch(/jawaban|kunci|option/i);
  });

  it("sorts lessons deterministically preserving prerequisite ordering", () => {
    const masteries: OutcomeMastery[] = [
      {
        outcomeId: "out-cidr",
        text: "Menghitung prefix CIDR",
        state: "NEEDS_REVIEW",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-3",
        lessonSlug: "cidr-notation",
        lessonTitle: "Notasi CIDR",
        latestAttemptAt: new Date(),
        evidenceVersion: "1.0",
        remediationLessonIds: ["les-3"],
      },
      {
        outcomeId: "out-subnet",
        text: "Menghitung subnet mask",
        state: "NEEDS_REVIEW",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-2",
        lessonSlug: "subnet-masks",
        lessonTitle: "Subnet Masking",
        latestAttemptAt: new Date(),
        evidenceVersion: "1.0",
        remediationLessonIds: ["les-2"],
      },
    ];

    const plan = resolveRemediationPlan(masteries, sampleCurriculum);

    expect(plan.lessons).toHaveLength(2);
    // les-2 is prerequisite to les-3, so les-2 must come first
    expect(plan.lessons[0].lessonId).toBe("les-2");
    expect(plan.lessons[1].lessonId).toBe("les-3");
  });

  it("handles recovered mastery properly: mastered outcome leaves remediation", () => {
    const masteries: OutcomeMastery[] = [
      {
        outcomeId: "out-2",
        text: "Menghitung subnet mask",
        // Initially failed, but learner retook and passed:
        state: "MASTERED",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "les-2",
        lessonSlug: "subnet-masks",
        lessonTitle: "Subnet Masking",
        latestAttemptAt: new Date(),
        evidenceVersion: "1.0",
        remediationLessonIds: ["les-2"],
      },
    ];

    const plan = resolveRemediationPlan(masteries, sampleCurriculum);
    expect(plan.totalNeedsReviewOutcomes).toBe(0);
    expect(plan.lessons).toHaveLength(0);
  });

  it("gracefully ignores unmapped or stale lesson IDs without throwing", () => {
    const masteries: OutcomeMastery[] = [
      {
        outcomeId: "out-stale",
        text: "Topik usang",
        state: "NEEDS_REVIEW",
        pathId: "path-1",
        pathSlug: "network-fundamentals",
        pathTitle: "Network Fundamentals",
        moduleId: "mod-1",
        moduleSlug: "ip-addressing",
        moduleTitle: "Pengalamatan IP",
        lessonId: "non-existent-lesson-id",
        lessonSlug: "non-existent-slug",
        lessonTitle: "Topik Usang",
        latestAttemptAt: new Date(),
        evidenceVersion: "0.9",
        remediationLessonIds: ["non-existent-lesson-id"],
      },
    ];

    expect(() => resolveRemediationPlan(masteries, sampleCurriculum)).not.toThrow();
    const plan = resolveRemediationPlan(masteries, sampleCurriculum);
    expect(plan.totalNeedsReviewOutcomes).toBe(1);
    expect(plan.totalRemediationLessons).toBe(0);
  });
});
