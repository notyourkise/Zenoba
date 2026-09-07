/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getCurriculumModule, getCurriculumLesson } from "./registry";
import { validateLessonContent } from "../blocks/schema";
import { wirelessBasicsModuleData } from "./wireless-troubleshooting/wireless-basics";
import { wirelessSecurityModuleData } from "./wireless-troubleshooting/wireless-security";
import { diagnosticToolsModuleData } from "./wireless-troubleshooting/diagnostic-tools";
import { troubleshootingMethodologyModuleData } from "./wireless-troubleshooting/troubleshooting-methodology";

describe("Path 5: Wireless & Troubleshooting Curriculum Content", () => {
  const allModules = [
    wirelessBasicsModuleData,
    wirelessSecurityModuleData,
    diagnosticToolsModuleData,
    troubleshootingMethodologyModuleData,
  ];

  it("registers all 4 Path 5 modules in CURRICULUM_REGISTRY", () => {
    expect(getCurriculumModule("wireless-basics")).toBeDefined();
    expect(getCurriculumModule("wireless-security")).toBeDefined();
    expect(getCurriculumModule("diagnostic-tools")).toBeDefined();
    expect(getCurriculumModule("troubleshooting-methodology")).toBeDefined();
  });

  it("supports legacy module aliases for backward compatibility", () => {
    expect(getCurriculumModule("wireless-technologies")).toBe(wirelessBasicsModuleData);
    expect(getCurriculumModule("cli-troubleshooting-tools")).toBe(diagnosticToolsModuleData);
  });

  it("supports legacy lesson slug aliases", () => {
    const l1 = getCurriculumLesson("wireless-basics", "wifi-bands-and-security");
    expect(l1).toBeDefined();
    expect(l1?.slug).toBe("band-frekuensi-wifi");

    const l2 = getCurriculumLesson("diagnostic-tools", "terminal-diagnostics-lab");
    expect(l2).toBeDefined();
    expect(l2?.slug).toBe("ipconfig-ping-diagnostic");
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

  it("verifies interactive components are integrated in Path 5 lessons", () => {
    const l1 = getCurriculumLesson("wireless-basics", "band-frekuensi-wifi");
    expect(l1?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "frequency_comparison")).toBe(true);

    const l2 = getCurriculumLesson("wireless-basics", "channel-dan-interferensi");
    expect(l2?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "channel_visualizer")).toBe(true);

    const l3 = getCurriculumLesson("wireless-security", "keamanan-wpa2-wpa3");
    expect(l3?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "security_comparison")).toBe(true);

    const l4 = getCurriculumLesson("wireless-security", "guest-network-isolation");
    expect(l4?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "client_isolation")).toBe(true);

    const l5 = getCurriculumLesson("diagnostic-tools", "ipconfig-ping-diagnostic");
    expect(l5?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "terminal")).toBe(true);

    const l6 = getCurriculumLesson("diagnostic-tools", "nslookup-arp-traceroute");
    expect(l6?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "terminal")).toBe(true);

    const l7 = getCurriculumLesson("troubleshooting-methodology", "observasi-dan-hipotesis");
    expect(l7?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "troubleshooting_workflow")).toBe(true);

    const l8 = getCurriculumLesson("troubleshooting-methodology", "perbaikan-dan-verifikasi");
    expect(l8?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "remediation_verification")).toBe(true);
  });
});
