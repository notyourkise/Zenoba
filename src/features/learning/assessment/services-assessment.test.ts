import { describe, it, expect } from "vitest";
import { servicesFormativeQuestions } from "./services.server";
import { findFormativeQuestion } from "./service";

describe("Path 4: Routing & Network Services Assessment", () => {
  describe("Formative Assessment Questions (Server-Side)", () => {
    it("contains exactly 30 formative questions across 10 lessons", () => {
      expect(servicesFormativeQuestions.length).toBe(30);

      const expectedLessons = [
        "default-gateway",
        "routing-table-lookup",
        "static-default-routes",
        "inter-vlan-routing",
        "dhcp-dora-process",
        "dns-query-resolution",
        "nat-static-dynamic",
        "pat-port-address-translation",
        "tcp-udp-icmp",
        "port-dan-layanan",
      ];

      for (const slug of expectedLessons) {
        const questionsForLesson = servicesFormativeQuestions.filter(
          (q) => q.lessonSlug === slug
        );
        expect(
          questionsForLesson.length,
          `Lesson '${slug}' must have exactly 3 formative questions`
        ).toBe(3);
      }
    });

    it("verifies every question has valid options, correct answer matching options, and misconception feedback", () => {
      for (const q of servicesFormativeQuestions) {
        expect(q.id).toMatch(/^quiz-/);
        expect(q.question.length).toBeGreaterThan(10);
        expect(q.options.length).toBe(4);

        const optionIds = q.options.map((o) => o.id);
        expect(optionIds).toContain(q.correctAnswer);

        expect(q.explanation.length).toBeGreaterThan(15);
        expect(q.misconceptionFeedback?.length).toBeGreaterThan(15);
      }
    });

    it("finds questions via findFormativeQuestion service without leaking client state", () => {
      const q1 = findFormativeQuestion("quiz-rtg-l1-q1");
      expect(q1).toBeDefined();
      expect(q1?.correctAnswer).toBe("opt-b");

      const qLast = findFormativeQuestion("quiz-trn-l2-q3");
      expect(qLast).toBeDefined();
      expect(qLast?.correctAnswer).toBe("opt-a");

      const nonExistent = findFormativeQuestion("quiz-non-existent-xyz");
      expect(nonExistent).toBeNull();
    });
  });
});
