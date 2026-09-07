/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getCurriculumModule, getCurriculumLesson } from "./registry";
import { validateLessonContent } from "../blocks/schema";
import { requirementsAnalysisModuleData } from "./network-planning/requirements-analysis";
import { capacityProcurementModuleData } from "./network-planning/capacity-procurement";
import { topologyIpVlanDesignModuleData } from "./network-planning/topology-ip-vlan-design";
import { proposalReviewModuleData } from "./network-planning/proposal-review";
import { appliedCasesModuleData } from "./network-planning/applied-cases";

describe("Path 6: Network Planning & IT Consultant Curriculum Content", () => {
  const allModules = [
    requirementsAnalysisModuleData,
    capacityProcurementModuleData,
    topologyIpVlanDesignModuleData,
    proposalReviewModuleData,
    appliedCasesModuleData,
  ];

  it("registers all 5 Path 6 modules in CURRICULUM_REGISTRY", () => {
    expect(getCurriculumModule("requirements-analysis")).toBeDefined();
    expect(getCurriculumModule("capacity-procurement")).toBeDefined();
    expect(getCurriculumModule("topology-ip-vlan-design")).toBeDefined();
    expect(getCurriculumModule("proposal-review")).toBeDefined();
    expect(getCurriculumModule("applied-cases")).toBeDefined();
  });

  it("contains exactly 10 authored lessons across all 5 modules", () => {
    const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
    expect(totalLessons).toBe(10);
    for (const mod of allModules) {
      expect(mod.lessons.length).toBe(2);
    }
  });

  it("validates all 8 lessons conform strictly to LessonContentDocumentSchema", () => {
    for (const mod of allModules) {
      for (const lesson of mod.lessons) {
        expect(lesson.content, `Lesson '${lesson.slug}' missing content object`).toBeDefined();
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
        const hasSummary = blocks.some((b) => b.type === "summary");
        const hasReward = blocks.some((b) => b.type === "reward");
        const hasQuiz = blocks.some((b) => b.type === "quiz");

        expect(hasHeading, `Lesson '${lesson.slug}' missing heading block`).toBe(true);
        expect(hasText, `Lesson '${lesson.slug}' missing text block`).toBe(true);
        expect(hasSummary, `Lesson '${lesson.slug}' missing summary block`).toBe(true);
        expect(hasReward, `Lesson '${lesson.slug}' missing reward block`).toBe(true);
        expect(hasQuiz, `Lesson '${lesson.slug}' missing quiz block`).toBe(true);
      }
    }
  });

  it("ensures zero client-side quiz answer leakage", () => {
    for (const mod of allModules) {
      for (const lesson of mod.lessons) {
        const quizBlocks = lesson.content.blocks.filter((b) => b.type === "quiz") as any[];
        expect(quizBlocks.length).toBe(3);

        for (const q of quizBlocks) {
          expect(q.correctAnswer).toBeUndefined();
          expect(q.correctOptionId).toBeUndefined();
          expect(q.answer).toBeUndefined();
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          for (const opt of q.options) {
            expect(opt.isCorrect).toBeUndefined();
          }
        }
      }
    }
  });

  it("verifies all learning outcomes have traceable evidence", () => {
    for (const mod of allModules) {
      for (const lesson of mod.lessons) {
        expect(lesson.outcomes.length).toBeGreaterThanOrEqual(1);
        expect(lesson.evidence.length).toBeGreaterThanOrEqual(1);

        const blockIds = new Set(lesson.content.blocks.map((b) => b.id).filter(Boolean));

        for (const ev of lesson.evidence) {
          for (const tbId of ev.teachingBlockIds) {
            expect(blockIds.has(tbId), `Teaching block ID '${tbId}' in lesson '${lesson.slug}' not found in content blocks`).toBe(true);
          }
          for (const actId of ev.activityIds) {
            expect(blockIds.has(actId), `Activity block ID '${actId}' in lesson '${lesson.slug}' not found in content blocks`).toBe(true);
          }
          for (const qId of ev.assessmentItemIds) {
            expect(blockIds.has(qId), `Assessment item ID '${qId}' in lesson '${lesson.slug}' not found in content blocks`).toBe(true);
          }
        }
      }
    }
  });

  it("retrieves each lesson through getCurriculumLesson helper", () => {
    const slugs = [
      ["requirements-analysis", "wawancara-klien"],
      ["requirements-analysis", "kriteria-keberhasilan"],
      ["capacity-procurement", "perhitungan-port-ap-poe"],
      ["capacity-procurement", "penyusunan-boq-anggaran"],
      ["topology-ip-vlan-design", "desain-topologi-hirarkis"],
      ["topology-ip-vlan-design", "perencanaan-ip-dan-vlan"],
      ["proposal-review", "dokumentasi-teknis-jaringan"],
      ["proposal-review", "review-desain-dan-revisi"],
      ["applied-cases", "small-office-transfer"],
      ["applied-cases", "komparasi-kasus-lanjutan"],
    ];

    for (const [modSlug, lesSlug] of slugs) {
      const lesson = getCurriculumLesson(modSlug, lesSlug);
      expect(lesson, `getCurriculumLesson('${modSlug}', '${lesSlug}') returned undefined`).toBeDefined();
      expect(lesson?.slug).toBe(lesSlug);
    }
  });
});
