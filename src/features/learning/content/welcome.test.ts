import { describe, expect, it } from "vitest";
import { welcomeModuleData } from "./network-foundations/welcome";
import { validateCurriculumModule } from "./validate";

describe("Welcome to Networking Curriculum Data Contract", () => {
  it("passes comprehensive curriculum validation without errors", () => {
    const result = validateCurriculumModule(welcomeModuleData);
    if (!result.success) {
      console.error("Validation errors:", result.errors);
    }
    expect(result.success).toBe(true);
  });

  it("defines the exact 4 module outcomes from the curriculum matrix", () => {
    expect(welcomeModuleData.outcomes).toHaveLength(4);
    const outcomeIds = welcomeModuleData.outcomes.map((o) => o.id);
    expect(outcomeIds).toEqual(["WN-M1", "WN-M2", "WN-M3", "WN-M4"]);
  });

  it("contains exactly 4 lessons with preserved and extended slug identities", () => {
    expect(welcomeModuleData.lessons).toHaveLength(4);

    const slugs = welcomeModuleData.lessons.map((l) => l.slug);
    expect(slugs).toEqual([
      "intro-to-networking",
      "everyday-networks",
      "sharing-network-resources",
      "simple-network-communication",
    ]);

    // Preserved historical slugs check
    expect(slugs[0]).toBe("intro-to-networking");
    expect(slugs[1]).toBe("everyday-networks");
  });

  it("covers all 8 observable lesson outcomes across the 4 lessons", () => {
    const allLessonOutcomes = welcomeModuleData.lessons.flatMap((l) =>
      l.outcomes.map((o) => o.id)
    );

    expect(allLessonOutcomes).toEqual([
      "WN-L1-A",
      "WN-L1-B",
      "WN-L2-A",
      "WN-L2-B",
      "WN-L3-A",
      "WN-L3-B",
      "WN-L4-A",
      "WN-L4-B",
    ]);

    // Uniqueness assertion
    expect(new Set(allLessonOutcomes).size).toBe(8);
  });

  it("ensures each lesson outcome has complete teaching, activity, and assessment evidence", () => {
    for (const lesson of welcomeModuleData.lessons) {
      expect(lesson.evidence.length).toBeGreaterThanOrEqual(lesson.outcomes.length);

      for (const ev of lesson.evidence) {
        expect(ev.teachingBlockIds.length).toBeGreaterThanOrEqual(1);
        expect(ev.activityIds.length).toBeGreaterThanOrEqual(1);
        expect(ev.assessmentItemIds.length).toBeGreaterThanOrEqual(1);

        // Verify teaching blocks exist in content
        for (const tbId of ev.teachingBlockIds) {
          const found = lesson.content.blocks.some((b) => b.id === tbId);
          expect(found).toBe(true);
        }

        // Verify activity blocks exist in content
        for (const actId of ev.activityIds) {
          const found = lesson.content.blocks.some((b) => b.id === actId);
          expect(found).toBe(true);
        }

        // Verify assessment items exist in content quizzes
        for (const qId of ev.assessmentItemIds) {
          const found = lesson.content.blocks.some(
            (b) => b.type === "quiz" && (b.quizId === qId || b.id === qId)
          );
          expect(found).toBe(true);
        }
      }
    }
  });

  it("configures final assessment with 10 concept questions and 3 practical criteria", () => {
    expect(welcomeModuleData.finalAssessment).toBeDefined();
    const fa = welcomeModuleData.finalAssessment!;

    expect(fa.assessmentId).toBe("assessment-welcome-final");
    expect(fa.conceptQuestionCount).toBe(10);
    expect(fa.conceptPassThreshold).toBe(8);
    expect(fa.practicalCriteriaCount).toBe(3);
    expect(fa.practicalPassThreshold).toBe(3);
  });

  it("enforces strict linear prerequisite order between lessons", () => {
    const [l1, l2, l3, l4] = welcomeModuleData.lessons;

    expect(l1.prerequisites).toEqual([]);
    expect(l2.prerequisites).toEqual(["intro-to-networking"]);
    expect(l3.prerequisites).toEqual(["everyday-networks"]);
    expect(l4.prerequisites).toEqual(["sharing-network-resources"]);
  });
});
