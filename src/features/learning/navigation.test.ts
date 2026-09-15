import { describe, it, expect } from "vitest";
import { resolveLessonNavigation } from "./navigation";
import type { LearningGraph, LearnerEvidenceSnapshot } from "./continuation";

describe("resolveLessonNavigation", () => {
  const mockCurriculum: LearningGraph = {
    paths: [
      {
        id: "path-1",
        slug: "network-fundamentals",
        title: "Network Fundamentals",
        orderIndex: 0,
        modules: [
          {
            id: "mod-1",
            slug: "intro-networking",
            title: "Pengenalan Jaringan",
            orderIndex: 0,
            assessmentId: "asm-mod-1",
            lessons: [
              {
                id: "les-1",
                slug: "what-is-a-network",
                title: "Apa Itu Jaringan Komputer?",
                orderIndex: 0,
              },
              {
                id: "les-2",
                slug: "network-devices",
                title: "Perangkat Jaringan Komputer",
                orderIndex: 1,
                prerequisiteLessonIds: ["les-1"],
              },
            ],
          },
          {
            id: "mod-2",
            slug: "ip-addressing",
            title: "Pengalamatan IP",
            orderIndex: 1,
            assessmentId: null, // No assessment for this module
            lessons: [
              {
                id: "les-3",
                slug: "ipv4-basics",
                title: "Dasar Alamat IPv4",
                orderIndex: 0,
                prerequisiteLessonIds: ["les-2"],
              },
            ],
          },
        ],
      },
    ],
  };

  it("returns null when lesson is not found in curriculum", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: [],
      inProgressLessonIds: [],
      moduleAssessments: [],
    };

    const nav = resolveLessonNavigation({
      curriculum: mockCurriculum,
      pathSlug: "network-fundamentals",
      moduleSlug: "intro-networking",
      lessonSlug: "non-existent-lesson",
      evidence,
    });

    expect(nav).toBeNull();
  });

  it("resolves navigation for the first lesson of the first module", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: [],
      inProgressLessonIds: ["les-1"],
      moduleAssessments: [],
    };

    const nav = resolveLessonNavigation({
      curriculum: mockCurriculum,
      pathSlug: "network-fundamentals",
      moduleSlug: "intro-networking",
      lessonSlug: "what-is-a-network",
      evidence,
    });

    expect(nav).not.toBeNull();
    expect(nav?.exitHref).toBe("/learn/network-fundamentals");
    // No previous lesson at the start of the path
    expect(nav?.previousLesson).toBeNull();

    // Next lesson exists in the same module but is locked because les-1 is not completed
    expect(nav?.nextLesson).toEqual({
      slug: "network-devices",
      title: "Perangkat Jaringan Komputer",
      href: "/learn/network-fundamentals/intro-networking/network-devices",
      moduleSlug: "intro-networking",
      moduleTitle: "Pengenalan Jaringan",
      isLocked: true,
      reason: "Selesaikan pelajaran prasyarat terlebih dahulu",
    });

    // Module assessment is not unlocked yet
    expect(nav?.moduleAssessment).toEqual({
      href: "/learn/network-fundamentals/intro-networking/assessment",
      isUnlocked: false,
      reason: "Selesaikan semua pelajaran dalam modul ini terlebih dahulu",
    });
  });

  it("unlocks next lesson when current lesson is completed", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-1"],
      inProgressLessonIds: ["les-2"],
      moduleAssessments: [],
    };

    const nav = resolveLessonNavigation({
      curriculum: mockCurriculum,
      pathSlug: "network-fundamentals",
      moduleSlug: "intro-networking",
      lessonSlug: "what-is-a-network",
      evidence,
    });

    expect(nav?.nextLesson?.isLocked).toBe(false);
    expect(nav?.nextLesson?.reason).toBeUndefined();
  });

  it("resolves navigation for the last lesson of a module with assessment", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-1", "les-2"],
      inProgressLessonIds: [],
      moduleAssessments: [],
    };

    const nav = resolveLessonNavigation({
      curriculum: mockCurriculum,
      pathSlug: "network-fundamentals",
      moduleSlug: "intro-networking",
      lessonSlug: "network-devices",
      evidence,
    });

    // Previous lesson is within the same module
    expect(nav?.previousLesson).toEqual({
      slug: "what-is-a-network",
      title: "Apa Itu Jaringan Komputer?",
      href: "/learn/network-fundamentals/intro-networking/what-is-a-network",
      moduleSlug: "intro-networking",
      moduleTitle: "Pengenalan Jaringan",
    });

    // At the end of the module, nextLesson is null
    expect(nav?.nextLesson).toBeNull();

    // Module assessment is unlocked because all module lessons (les-1, les-2) are completed
    expect(nav?.moduleAssessment).toEqual({
      href: "/learn/network-fundamentals/intro-networking/assessment",
      isUnlocked: true,
    });

    // Next module first lesson is locked because assessment is not yet passed
    expect(nav?.nextModuleFirstLesson).toEqual({
      slug: "ipv4-basics",
      title: "Dasar Alamat IPv4",
      href: "/learn/network-fundamentals/ip-addressing/ipv4-basics",
      moduleSlug: "ip-addressing",
      moduleTitle: "Pengalamatan IP",
      isLocked: true,
      reason: "Lulus ujian akhir modul sebelumnya terlebih dahulu",
    });
  });

  it("unlocks next module when previous module assessment is passed", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-1", "les-2"],
      inProgressLessonIds: [],
      moduleAssessments: [
        {
          moduleId: "mod-1",
          assessmentId: "asm-mod-1",
          passed: true,
          score: 100,
        },
      ],
    };

    const nav = resolveLessonNavigation({
      curriculum: mockCurriculum,
      pathSlug: "network-fundamentals",
      moduleSlug: "intro-networking",
      lessonSlug: "network-devices",
      evidence,
    });

    expect(nav?.nextModuleFirstLesson?.isLocked).toBe(false);
  });

  it("links previous lesson across module boundaries", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-1", "les-2"],
      inProgressLessonIds: ["les-3"],
      moduleAssessments: [],
    };

    const nav = resolveLessonNavigation({
      curriculum: mockCurriculum,
      pathSlug: "network-fundamentals",
      moduleSlug: "ip-addressing",
      lessonSlug: "ipv4-basics",
      evidence,
    });

    // First lesson in Module 2 links back to the last lesson of Module 1
    expect(nav?.previousLesson).toEqual({
      slug: "network-devices",
      title: "Perangkat Jaringan Komputer",
      href: "/learn/network-fundamentals/intro-networking/network-devices",
      moduleSlug: "intro-networking",
      moduleTitle: "Pengenalan Jaringan",
    });
  });

  it("handles last lesson of path where module has no assessment", () => {
    const evidence: LearnerEvidenceSnapshot = {
      completedLessonIds: ["les-1", "les-2", "les-3"],
      inProgressLessonIds: [],
      moduleAssessments: [],
    };

    const nav = resolveLessonNavigation({
      curriculum: mockCurriculum,
      pathSlug: "network-fundamentals",
      moduleSlug: "ip-addressing",
      lessonSlug: "ipv4-basics",
      evidence,
    });

    expect(nav?.nextLesson).toBeNull();
    expect(nav?.moduleAssessment).toBeNull();
    expect(nav?.nextModuleFirstLesson).toBeNull();
  });
});
