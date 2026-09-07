import { describe, it, expect } from "vitest";
import { planningFormativeQuestions } from "./planning.server";
import { findFormativeQuestion } from "./service";

describe("Path 6: Network Planning & IT Consultant Assessment", () => {
  describe("Formative Assessment Questions (Server-Side)", () => {
    it("contains exactly 24 formative questions across 8 lessons", () => {
      expect(planningFormativeQuestions.length).toBe(24);

      const expectedLessons = [
        "wawancara-klien",
        "kriteria-keberhasilan",
        "perhitungan-port-ap-poe",
        "penyusunan-boq-anggaran",
        "desain-topologi-hirarkis",
        "perencanaan-ip-dan-vlan",
        "dokumentasi-teknis-jaringan",
        "review-desain-dan-revisi",
      ];

      for (const slug of expectedLessons) {
        const questionsForLesson = planningFormativeQuestions.filter(
          (q) => q.lessonSlug === slug
        );
        expect(
          questionsForLesson.length,
          `Lesson '${slug}' must have exactly 3 formative questions`
        ).toBe(3);
      }
    });

    it("verifies every question has valid options, correct answer matching options, and misconception feedback", () => {
      for (const q of planningFormativeQuestions) {
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
      const q1 = findFormativeQuestion("quiz-plan-l1-q1");
      expect(q1).toBeDefined();
      expect(q1?.correctAnswer).toBe("opt-2");

      const qLast = findFormativeQuestion("quiz-plan-l8-q3");
      expect(qLast).toBeDefined();
      expect(qLast?.correctAnswer).toBe("opt-1");

      const nonExistent = findFormativeQuestion("quiz-non-existent-plan-xyz");
      expect(nonExistent).toBeNull();
    });
  });
});
