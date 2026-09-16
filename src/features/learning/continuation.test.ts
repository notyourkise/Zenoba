import { describe, it, expect } from "vitest";
import {
  resolveLearningQueue,
  resolvePrimaryContinuation,
  type LearningGraph,
  type LearnerEvidenceSnapshot,
} from "./continuation";

describe("Learning Continuation Resolver & Prioritized Queue (Sprint 37 / Task 37.1)", () => {
  const sampleCurriculum: LearningGraph = {
    paths: [
      {
        id: "path-foundations",
        slug: "network-foundations",
        title: "Network Foundations",
        orderIndex: 0,
        modules: [
          {
            id: "mod-welcome",
            slug: "welcome-to-networking",
            title: "Welcome to Networking",
            orderIndex: 0,
            assessmentId: "assessment-welcome",
            lessons: [
              {
                id: "les-w1",
                slug: "orientasi-platform",
                title: "Orientasi Platform",
                orderIndex: 0,
              },
              {
                id: "les-w2",
                slug: "etika-dan-keselamatan-kerja",
                title: "Etika dan Keselamatan Kerja",
                orderIndex: 1,
                prerequisiteLessonIds: ["les-w1"],
              },
            ],
          },
          {
            id: "mod-devices",
            slug: "network-devices",
            title: "Network Devices",
            orderIndex: 1,
            assessmentId: "assessment-devices",
            lessons: [
              {
                id: "les-d1",
                slug: "pengenalan-router-switch",
                title: "Pengenalan Router & Switch",
                orderIndex: 0,
              },
            ],
          },
        ],
      },
    ],
  };

  it("recommends the first lesson as NEXT_LESSON for a new learner with zero progress", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: [],
      inProgressLessonIds: [],
      moduleAssessments: [],
    };

    const queue = resolveLearningQueue(sampleCurriculum, evidence);
    expect(queue.length).toBeGreaterThanOrEqual(1);

    const primary = resolvePrimaryContinuation(queue);
    expect(primary).not.toBeNull();
    expect(primary?.kind).toBe("NEXT_LESSON");
    expect(primary?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/orientasi-platform",
    );
    expect(primary?.title).toBe("Orientasi Platform");
    expect(primary?.priority).toBe(4);
  });

  it("prioritizes an in-progress lesson as RESUME over next unlocked lessons", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: [],
      inProgressLessonIds: ["les-w1"],
      moduleAssessments: [],
    };

    const queue = resolveLearningQueue(sampleCurriculum, evidence);
    const primary = resolvePrimaryContinuation(queue);

    expect(primary).not.toBeNull();
    expect(primary?.kind).toBe("RESUME");
    expect(primary?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/orientasi-platform",
    );
    expect(primary?.priority).toBe(2);
    expect(primary?.reason).toMatch(/lanjutkan/i);
  });

  it("prioritizes failed module assessment as REMEDIATION above all other items", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-w1", "les-w2"],
      inProgressLessonIds: ["les-d1"],
      moduleAssessments: [
        {
          moduleId: "mod-welcome",
          assessmentId: "assessment-welcome",
          passed: false,
          score: 55,
        },
      ],
    };

    const queue = resolveLearningQueue(sampleCurriculum, evidence);
    const primary = resolvePrimaryContinuation(queue);

    expect(primary).not.toBeNull();
    expect(primary?.kind).toBe("REMEDIATION");
    expect(primary?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/assessment",
    );
    expect(primary?.priority).toBe(1);
    expect(primary?.reason).toMatch(/remediasi|perbaikan/i);
    expect(primary?.reason).toContain("55%");

    // Verify queue ordering: REMEDIATION (priority 1) comes before RESUME (priority 2)
    expect(queue[0].kind).toBe("REMEDIATION");
    expect(queue[1].kind).toBe("RESUME");
  });

  it("prompts for ASSESSMENT when all module lessons are completed but assessment not yet passed", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-w1", "les-w2"],
      inProgressLessonIds: [],
      moduleAssessments: [],
    };

    const queue = resolveLearningQueue(sampleCurriculum, evidence);
    const primary = resolvePrimaryContinuation(queue);

    expect(primary).not.toBeNull();
    expect(primary?.kind).toBe("ASSESSMENT");
    expect(primary?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/assessment",
    );
    expect(primary?.priority).toBe(3);
  });

  it("advances to next module lessons once module assessment is passed", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-w1", "les-w2"],
      inProgressLessonIds: [],
      moduleAssessments: [
        {
          moduleId: "mod-welcome",
          assessmentId: "assessment-welcome",
          passed: true,
          score: 90,
        },
      ],
    };

    const queue = resolveLearningQueue(sampleCurriculum, evidence);
    const primary = resolvePrimaryContinuation(queue);

    expect(primary).not.toBeNull();
    expect(primary?.kind).toBe("NEXT_LESSON");
    expect(primary?.href).toBe(
      "/learn/network-foundations/network-devices/pengenalan-router-switch",
    );
    expect(primary?.priority).toBe(4);
  });

  it("returns an empty queue when all lessons and assessments in curriculum are completed", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-w1", "les-w2", "les-d1"],
      inProgressLessonIds: [],
      moduleAssessments: [
        {
          moduleId: "mod-welcome",
          assessmentId: "assessment-welcome",
          passed: true,
          score: 100,
        },
        {
          moduleId: "mod-devices",
          assessmentId: "assessment-devices",
          passed: true,
          score: 95,
        },
      ],
    };

    const queue = resolveLearningQueue(sampleCurriculum, evidence);
    expect(queue).toHaveLength(0);

    const primary = resolvePrimaryContinuation(queue);
    expect(primary).toBeNull();
  });

  it("enforces strict hierarchical priority: REMEDIATION > RESUME > ASSESSMENT > NEXT_LESSON", () => {
    const multiModuleCurriculum: LearningGraph = {
      paths: [
        {
          id: "path-1",
          slug: "net-foundations",
          title: "Network Foundations",
          orderIndex: 0,
          modules: [
            {
              id: "mod-1",
              slug: "mod-one",
              title: "Module 1",
              orderIndex: 0,
              assessmentId: "asm-1",
              lessons: [
                { id: "l-1-1", slug: "l1-1", title: "L1-1", orderIndex: 0 },
              ],
            },
            {
              id: "mod-2",
              slug: "mod-two",
              title: "Module 2",
              orderIndex: 1,
              assessmentId: "asm-2",
              lessons: [
                { id: "l-2-1", slug: "l2-1", title: "L2-1", orderIndex: 0 },
              ],
            },
            {
              id: "mod-3",
              slug: "mod-three",
              title: "Module 3",
              orderIndex: 2,
              assessmentId: "asm-3",
              lessons: [
                { id: "l-3-1", slug: "l3-1", title: "L3-1", orderIndex: 0 },
                { id: "l-3-2", slug: "l3-2", title: "L3-2", orderIndex: 1 },
              ],
            },
          ],
        },
      ],
    };

    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["l-1-1", "l-2-1"],
      inProgressLessonIds: ["l-3-1"],
      moduleAssessments: [
        {
          moduleId: "mod-1",
          assessmentId: "asm-1",
          passed: false,
          score: 60,
        },
      ],
    };

    const queue = resolveLearningQueue(multiModuleCurriculum, evidence);
    expect(queue.length).toBeGreaterThanOrEqual(4);

    expect(queue[0].kind).toBe("REMEDIATION");
    expect(queue[0].priority).toBe(1);

    expect(queue[1].kind).toBe("RESUME");
    expect(queue[1].priority).toBe(2);

    expect(queue[2].kind).toBe("ASSESSMENT");
    expect(queue[2].priority).toBe(3);

    expect(queue[3].kind).toBe("NEXT_LESSON");
    expect(queue[3].priority).toBe(4);
  });

  it("prioritizes active lesson-level remediation ahead of assessments and resume items", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-w1"],
      inProgressLessonIds: ["les-w2"],
      moduleAssessments: [],
      remediationLessons: [
        {
          lessonId: "les-w1",
          lessonSlug: "orientasi-platform",
          lessonTitle: "Orientasi Platform",
          moduleId: "mod-welcome",
          moduleSlug: "welcome-to-networking",
          moduleTitle: "Welcome to Networking",
          pathSlug: "network-foundations",
          pathTitle: "Network Foundations",
          href: "/learn/network-foundations/welcome-to-networking/orientasi-platform",
          reason: "Penguatan konsep sasaran kompetensi: Navigasi Platform",
        },
      ],
    };

    const queue = resolveLearningQueue(sampleCurriculum, evidence);

    expect(queue.length).toBeGreaterThanOrEqual(1);
    expect(queue[0].kind).toBe("REMEDIATION");
    expect(queue[0].title).toBe("Remediasi: Orientasi Platform");
    expect(queue[0].href).toBe(
      "/learn/network-foundations/welcome-to-networking/orientasi-platform"
    );
    expect(queue[0].priority).toBe(1);

    const primaryAction = resolvePrimaryContinuation(queue);
    expect(primaryAction?.href).toBe(
      "/learn/network-foundations/welcome-to-networking/orientasi-platform"
    );
  });
});
