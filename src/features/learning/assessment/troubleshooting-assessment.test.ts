import { describe, it, expect } from "vitest";
import { troubleshootingFormativeQuestions } from "./troubleshooting.server";
import { findFormativeQuestion } from "./service";

describe("Path 5: Wireless & Troubleshooting Assessment", () => {
  describe("Formative Assessment Questions (Server-Side)", () => {
    it("contains exactly 24 formative questions across 8 lessons", () => {
      expect(troubleshootingFormativeQuestions.length).toBe(24);

      const expectedLessons = [
        "band-frekuensi-wifi",
        "channel-dan-interferensi",
        "keamanan-wpa2-wpa3",
        "guest-network-isolation",
        "ipconfig-ping-diagnostic",
        "nslookup-arp-traceroute",
        "observasi-dan-hipotesis",
        "perbaikan-dan-verifikasi",
      ];

      for (const slug of expectedLessons) {
        const questionsForLesson = troubleshootingFormativeQuestions.filter(
          (q) => q.lessonSlug === slug
        );
        expect(
          questionsForLesson.length,
          `Lesson '${slug}' must have exactly 3 formative questions`
        ).toBe(3);
      }
    });

    it("verifies every question has valid options, correct answer matching options, and misconception feedback", () => {
      for (const q of troubleshootingFormativeQuestions) {
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
      const q1 = findFormativeQuestion("quiz-wls-l1-q1");
      expect(q1).toBeDefined();
      expect(q1?.correctAnswer).toBe("opt-a");

      const qLast = findFormativeQuestion("quiz-mth-l8-q3");
      expect(qLast).toBeDefined();
      expect(qLast?.correctAnswer).toBe("opt-a");

      const nonExistent = findFormativeQuestion("quiz-non-existent-wls-xyz");
      expect(nonExistent).toBeNull();
    });
  });
});
