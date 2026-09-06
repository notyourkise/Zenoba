import { describe, expect, it } from "vitest";
import { typesOfNetworksModuleData } from "./network-foundations/types-of-networks";
import { clientServerModuleData } from "./network-foundations/client-server";
import { topologyModuleData } from "./network-foundations/topology";
import { networkDevicesModuleData } from "./network-foundations/devices";
import { physicalMediaCablingModuleData } from "./network-foundations/media-cabling";
import { howDataTravelsModuleData } from "./network-foundations/how-data-travels";
import { osiTcpipModuleData } from "./network-foundations/osi-tcpip";
import { getCurriculumLesson, getCurriculumModule } from "./registry";
import { validateCurriculumModule } from "./validate";

const foundationModules = [
  typesOfNetworksModuleData,
  clientServerModuleData,
  topologyModuleData,
  networkDevicesModuleData,
  physicalMediaCablingModuleData,
  howDataTravelsModuleData,
  osiTcpipModuleData,
];

describe("Network Foundations Content Expansion (P1-M2 to P1-M8)", () => {
  it.each(foundationModules.map((m) => [m.title, m]))(
    "validates curriculum module data contract for %s",
    (_, moduleData) => {
      const result = validateCurriculumModule(moduleData);
      if (!result.success) {
        console.error(`Validation errors in ${moduleData.slug}:`, result.errors);
      }
      expect(result.success).toBe(true);
    }
  );

  it("contains exactly 15 lessons across the 7 expanded modules", () => {
    const totalLessons = foundationModules.reduce(
      (sum, m) => sum + m.lessons.length,
      0
    );
    expect(totalLessons).toBe(15);
  });

  it("ensures every lesson has non-empty outcomes and complete evidence linkages", () => {
    for (const mod of foundationModules) {
      for (const lesson of mod.lessons) {
        expect(lesson.outcomes.length).toBeGreaterThanOrEqual(1);
        expect(lesson.evidence.length).toBeGreaterThanOrEqual(lesson.outcomes.length);

        for (const ev of lesson.evidence) {
          expect(ev.teachingBlockIds.length).toBeGreaterThanOrEqual(1);
          expect(ev.activityIds.length).toBeGreaterThanOrEqual(1);
          expect(ev.assessmentItemIds.length).toBeGreaterThanOrEqual(1);

          for (const tbId of ev.teachingBlockIds) {
            const found = lesson.content.blocks.some((b) => b.id === tbId);
            expect(found).toBe(true);
          }
          for (const actId of ev.activityIds) {
            const found = lesson.content.blocks.some((b) => b.id === actId);
            expect(found).toBe(true);
          }
          for (const qId of ev.assessmentItemIds) {
            const found = lesson.content.blocks.some(
              (b) => b.type === "quiz" && (b.quizId === qId || b.id === qId)
            );
            expect(found).toBe(true);
          }
        }
      }
    }
  });

  it("ensures no lesson is a heading-plus-reward placeholder", () => {
    for (const mod of foundationModules) {
      for (const lesson of mod.lessons) {
        // Must have at least 5 blocks: markdown text, interactive activity, quiz items, summary, reward
        expect(lesson.content.blocks.length).toBeGreaterThanOrEqual(5);

        const hasText = lesson.content.blocks.some((b) => b.type === "text");
        const hasInteractive = lesson.content.blocks.some((b) => b.type === "interactive");
        const hasQuiz = lesson.content.blocks.some((b) => b.type === "quiz");
        const hasSummary = lesson.content.blocks.some((b) => b.type === "summary");
        const hasReward = lesson.content.blocks.some((b) => b.type === "reward");

        expect(hasText).toBe(true);
        expect(hasInteractive).toBe(true);
        expect(hasQuiz).toBe(true);
        expect(hasSummary).toBe(true);
        expect(hasReward).toBe(true);
      }
    }
  });

  it("registers all 7 modules and their 15 lessons in CURRICULUM_REGISTRY", () => {
    for (const mod of foundationModules) {
      const bySlug = getCurriculumModule(mod.slug);
      const byId = getCurriculumModule(mod.id);

      expect(bySlug).toBeDefined();
      expect(byId).toBeDefined();
      expect(bySlug?.id).toBe(mod.id);

      for (const lesson of mod.lessons) {
        const found = getCurriculumLesson(mod.slug, lesson.slug);
        expect(found).toBeDefined();
        expect(found?.title).toBe(lesson.title);
      }
    }
  });

  it("enforces prerequisite continuity across module boundaries", () => {
    // L05 requires simple-network-communication (L04)
    const l05 = getCurriculumLesson("types-of-networks", "lan-man-wan");
    expect(l05?.prerequisites).toEqual(["simple-network-communication"]);

    // L07 requires network-contexts-home-school-enterprise (L06)
    const l07 = getCurriculumLesson("client-server-communication", "client-server-roles");
    expect(l07?.prerequisites).toEqual(["network-contexts-home-school-enterprise"]);

    // L09 requires request-response-cycle (L08)
    const l09 = getCurriculumLesson("network-topology", "bus-star-ring");
    expect(l09?.prerequisites).toEqual(["request-response-cycle"]);

    // L11 requires topology-fault-impact (L10)
    const l11 = getCurriculumLesson("network-devices", "nic-switch-router-ap");
    expect(l11?.prerequisites).toEqual(["topology-fault-impact"]);

    // L13 requires modem-firewall-server (L12)
    const l13 = getCurriculumLesson("physical-media-cabling", "copper-twisted-pair-wireless");
    expect(l13?.prerequisites).toEqual(["modem-firewall-server"]);

    // L16 requires fiber-optic-intro (L15)
    const l16 = getCurriculumLesson("how-data-travels", "bits-frames-packets");
    expect(l16?.prerequisites).toEqual(["fiber-optic-intro"]);

    // L18 requires unicast-broadcast-multicast (L17)
    const l18 = getCurriculumLesson("osi-tcpip-foundations", "osi-seven-layers");
    expect(l18?.prerequisites).toEqual(["unicast-broadcast-multicast"]);
  });
});
