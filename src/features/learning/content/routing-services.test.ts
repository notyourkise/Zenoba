/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { getCurriculumModule, getCurriculumLesson } from "./registry";
import { validateLessonContent } from "../blocks/schema";
import { gatewayRouteModuleData } from "./routing-services/gateway-route";
import { staticIntervlanModuleData } from "./routing-services/static-intervlan";
import { dhcpDnsModuleData } from "./routing-services/dhcp-dns";
import { natPatModuleData } from "./routing-services/nat-pat";
import { transportServicesModuleData } from "./routing-services/transport-services";

describe("Path 4: Routing & Network Services Curriculum Content", () => {
  const allModules = [
    gatewayRouteModuleData,
    staticIntervlanModuleData,
    dhcpDnsModuleData,
    natPatModuleData,
    transportServicesModuleData,
  ];

  it("registers all 5 Path 4 modules in CURRICULUM_REGISTRY", () => {
    expect(getCurriculumModule("gateway-dan-route")).toBeDefined();
    expect(getCurriculumModule("static-intervlan")).toBeDefined();
    expect(getCurriculumModule("dhcp-dns")).toBeDefined();
    expect(getCurriculumModule("nat-pat")).toBeDefined();
    expect(getCurriculumModule("transport-services")).toBeDefined();
  });

  it("supports legacy module aliases for backward compatibility", () => {
    expect(getCurriculumModule("dhcp-and-dns-services")).toBe(dhcpDnsModuleData);
    expect(getCurriculumModule("nat-pat-security")).toBe(natPatModuleData);
  });

  it("supports legacy lesson slug aliases", () => {
    const l1 = getCurriculumLesson("nat-pat", "nat-pat-translation");
    expect(l1).toBeDefined();
    expect(l1?.slug).toBe("pat-port-address-translation");
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

  it("verifies interactive components are integrated in Path 4 lessons", () => {
    // Lesson 1: default-gateway has routing_table
    const l1 = getCurriculumLesson("gateway-dan-route", "default-gateway");
    expect(l1?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "routing_table")).toBe(true);

    // Lesson 5: dhcp-dora-process has dhcp_dora
    const l5 = getCurriculumLesson("dhcp-dns", "dhcp-dora-process");
    expect(l5?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "dhcp_dora")).toBe(true);

    // Lesson 6: dns-query-resolution has dns_query
    const l6 = getCurriculumLesson("dhcp-dns", "dns-query-resolution");
    expect(l6?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "dns_query")).toBe(true);

    // Lesson 8: pat-port-address-translation has nat_visualizer
    const l8 = getCurriculumLesson("nat-pat", "pat-port-address-translation");
    expect(l8?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "nat_visualizer")).toBe(true);

    // Lesson 9: tcp-udp-icmp has icmp_ping
    const l9 = getCurriculumLesson("transport-services", "tcp-udp-icmp");
    expect(l9?.content.blocks.some((b) => b.type === "interactive" && (b as any).interactiveType === "icmp_ping")).toBe(true);
  });
});
