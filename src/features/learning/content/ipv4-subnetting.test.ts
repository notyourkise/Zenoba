/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getCurriculumModule, getCurriculumLesson } from "./registry";
import { validateLessonContent } from "../blocks/schema";
import { binaryIpv4ModuleData } from "./ipv4-subnetting/binary-ipv4";
import { addressTypesModuleData } from "./ipv4-subnetting/address-types";
import { maskCidrModuleData } from "./ipv4-subnetting/mask-cidr";
import { subnetCalculationsModuleData } from "./ipv4-subnetting/subnet-calculations";
import { vlsmDesignModuleData } from "./ipv4-subnetting/vlsm-design";

describe("Path 2: IPv4 & Subnetting Curriculum Content", () => {
  const allModules = [
    binaryIpv4ModuleData,
    addressTypesModuleData,
    maskCidrModuleData,
    subnetCalculationsModuleData,
    vlsmDesignModuleData,
  ];

  it("registers all 5 Path 2 modules in CURRICULUM_REGISTRY", () => {
    expect(getCurriculumModule("biner-dan-ipv4")).toBeDefined();
    expect(getCurriculumModule("jenis-alamat")).toBeDefined();
    expect(getCurriculumModule("mask-dan-cidr")).toBeDefined();
    expect(getCurriculumModule("kalkulasi-subnet")).toBeDefined();
    expect(getCurriculumModule("subnetting-dan-vlsm")).toBeDefined();
  });

  it("supports legacy module aliases for backward compatibility", () => {
    expect(getCurriculumModule("binary-ipv4-structure")).toBe(binaryIpv4ModuleData);
    expect(getCurriculumModule("subnet-calculations")).toBe(subnetCalculationsModuleData);
  });

  it("supports legacy lesson slug aliases", () => {
    const l1 = getCurriculumLesson("biner-dan-ipv4", "binary-fundamentals");
    expect(l1).toBeDefined();
    expect(l1?.slug).toBe("biner-8-bit");

    const l2 = getCurriculumLesson("kalkulasi-subnet", "subnet-calculator-lab");
    expect(l2).toBeDefined();
    expect(l2?.slug).toBe("network-broadcast");
  });

  it("contains exactly 10 authored lessons across all 5 modules", () => {
    const totalLessons = allModules.reduce((acc, m) => acc + m.lessons.length, 0);
    expect(totalLessons).toBe(10);
    for (const mod of allModules) {
      expect(mod.lessons.length).toBe(2);
    }
  });

  it("validates all 10 lessons conform strictly to the LessonContentDocumentSchema", () => {
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
    // Lesson 1: biner-8-bit has binary_converter
    const l1 = getCurriculumLesson("biner-dan-ipv4", "biner-8-bit");
    const hasBinaryConverter = l1?.content.blocks.some(
      (b) => b.type === "interactive" && (b as any).interactiveType === "binary_converter"
    );
    expect(hasBinaryConverter).toBe(true);

    // Lesson 7: network-broadcast has subnet_calculator
    const l7 = getCurriculumLesson("kalkulasi-subnet", "network-broadcast");
    const hasSubnetCalculator = l7?.content.blocks.some(
      (b) => b.type === "interactive" && (b as any).interactiveType === "subnet_calculator"
    );
    expect(hasSubnetCalculator).toBe(true);

    // Lesson 8: host-range has subnet_practice
    const l8 = getCurriculumLesson("kalkulasi-subnet", "host-range");
    const hasSubnetPractice = l8?.content.blocks.some(
      (b) => b.type === "interactive" && (b as any).interactiveType === "subnet_practice"
    );
    expect(hasSubnetPractice).toBe(true);
  });
});
