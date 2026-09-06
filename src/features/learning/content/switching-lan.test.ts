/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getCurriculumModule, getCurriculumLesson } from "./registry";
import { validateLessonContent } from "../blocks/schema";
import { ethernetMacModuleData } from "./switching-lan/ethernet-mac";
import { arpBroadcastModuleData } from "./switching-lan/arp-broadcast";
import { vlanSegmentationModuleData } from "./switching-lan/vlan-segmentation";
import { accessTrunkModuleData } from "./switching-lan/access-trunk";

describe("Path 3: Switching & LAN Curriculum Content", () => {
  const allModules = [
    ethernetMacModuleData,
    arpBroadcastModuleData,
    vlanSegmentationModuleData,
    accessTrunkModuleData,
  ];

  it("registers all 4 Path 3 modules in CURRICULUM_REGISTRY", () => {
    expect(getCurriculumModule("ethernet-dan-mac")).toBeDefined();
    expect(getCurriculumModule("arp-dan-broadcast")).toBeDefined();
    expect(getCurriculumModule("vlan-dan-segmentasi")).toBeDefined();
    expect(getCurriculumModule("access-dan-trunk")).toBeDefined();
  });

  it("supports legacy module aliases for backward compatibility", () => {
    expect(getCurriculumModule("switching-and-arp")).toBe(arpBroadcastModuleData);
    expect(getCurriculumModule("vlan-and-routing")).toBe(vlanSegmentationModuleData);
  });

  it("supports legacy lesson slug aliases", () => {
    const l1 = getCurriculumLesson("switching-and-arp", "arp-resolution-flow");
    expect(l1).toBeDefined();
    expect(l1?.slug).toBe("arp-request-reply");

    const l2 = getCurriculumLesson("vlan-and-routing", "vlan-segmentation-practice");
    expect(l2).toBeDefined();
    expect(l2?.slug).toBe("broadcast-domain-vlan");
  });

  it("contains exactly 8 authored lessons across all 4 modules", () => {
    const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
    expect(totalLessons).toBe(8);
    for (const mod of allModules) {
      expect(mod.lessons.length).toBe(2);
    }
  });

  it("validates all 8 lessons conform strictly to the LessonContentDocumentSchema", () => {
    for (const mod of allModules) {
      for (const lesson of mod.lessons) {
        const validation = validateLessonContent(lesson.content);
        expect(
          validation.success,
          `Lesson '${lesson.slug}' failed block schema validation: ${validation.errors?.join(", ")}`
        ).toBe(true);

        const blocks = lesson.content.blocks;
        expect(blocks.length).toBeGreaterThanOrEqual(5);

        // Verify required structural blocks exist
        const hasHeading = blocks.some((b) => b.type === "heading");
        const hasText = blocks.some((b) => b.type === "text");
        const hasQuiz = blocks.some((b) => b.type === "quiz");
        const hasSummary = blocks.some((b) => b.type === "summary");
        const hasReward = blocks.some((b) => b.type === "reward");

        expect(hasHeading, `Lesson '${lesson.slug}' missing heading block`).toBe(true);
        expect(hasText, `Lesson '${lesson.slug}' missing text block`).toBe(true);
        expect(hasQuiz, `Lesson '${lesson.slug}' missing quiz block`).toBe(true);
        expect(hasSummary, `Lesson '${lesson.slug}' missing summary block`).toBe(true);
        expect(hasReward, `Lesson '${lesson.slug}' missing reward block`).toBe(true);
      }
    }
  });

  it("verifies outcome-to-evidence mapping completeness with zero orphan outcomes", () => {
    for (const mod of allModules) {
      for (const lesson of mod.lessons) {
        expect(lesson.outcomes.length).toBeGreaterThanOrEqual(2);
        expect(lesson.evidence.length).toBeGreaterThanOrEqual(lesson.outcomes.length);

        const outcomeIds = new Set(lesson.outcomes.map((o) => o.id));

        for (const ev of lesson.evidence) {
          expect(
            outcomeIds.has(ev.outcomeId),
            `Evidence outcome '${ev.outcomeId}' in lesson '${lesson.slug}' not found in declared outcomes`
          ).toBe(true);

          expect(
            ev.assessmentItemIds.length,
            `Evidence for outcome '${ev.outcomeId}' in '${lesson.slug}' must have assessment item IDs`
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it("verifies interactive lab components are integrated in relevant lessons", () => {
    // Lesson 3: arp-request-reply has arp_visualizer
    const l3 = getCurriculumLesson("arp-dan-broadcast", "arp-request-reply");
    const hasArpVisualizer = l3?.content.blocks.some(
      (b) => b.type === "interactive" && (b as any).interactiveType === "arp_visualizer"
    );
    expect(hasArpVisualizer).toBe(true);

    // Lesson 5: broadcast-domain-vlan has vlan_builder
    const l5 = getCurriculumLesson("vlan-dan-segmentasi", "broadcast-domain-vlan");
    const hasVlanBuilder = l5?.content.blocks.some(
      (b) => b.type === "interactive" && (b as any).interactiveType === "vlan_builder"
    );
    expect(hasVlanBuilder).toBe(true);
  });
});
