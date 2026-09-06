import { describe, it, expect } from "vitest";
import { switchingFormativeQuestions } from "./switching.server";
import { findFormativeQuestion } from "./service";

describe("Path 3: Switching & LAN Assessment", () => {
  describe("Formative Assessment Questions (Server-Side)", () => {
    it("contains exactly 24 formative questions across 8 lessons", () => {
      expect(switchingFormativeQuestions.length).toBe(24);

      const expectedLessons = [
        "ethernet-mac-address",
        "mac-learning-table",
        "arp-request-reply",
        "local-remote-destination",
        "broadcast-domain-vlan",
        "vlan-membership",
        "access-port",
        "trunk-8021q",
      ];

      for (const slug of expectedLessons) {
        const questionsForLesson = switchingFormativeQuestions.filter(
          (q) => q.lessonSlug === slug
        );
        expect(
          questionsForLesson.length,
          `Lesson '${slug}' must have exactly 3 formative questions`
        ).toBe(3);
      }
    });

    it("verifies every question has valid 4 options, a correct answer, and misconception feedback", () => {
      for (const q of switchingFormativeQuestions) {
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
      const q1 = findFormativeQuestion("quiz-eth-l1-q1");
      expect(q1).toBeDefined();
      expect(q1?.correctAnswer).toBe("opt-b");

      const qLast = findFormativeQuestion("quiz-trk-l2-q3");
      expect(qLast).toBeDefined();
      expect(qLast?.correctAnswer).toBe("opt-a");

      const nonExistent = findFormativeQuestion("quiz-non-existent-xyz");
      expect(nonExistent).toBeNull();
    });
  });
});
