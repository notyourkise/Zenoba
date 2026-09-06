import { describe, expect, it } from "vitest";
import { foundationsFormativeQuestions } from "./foundations.server";
import { findFormativeQuestion } from "./service";
import { getCurriculumModule } from "../content/registry";

describe("Network Foundations Assessment Definitions (P1-M2 s.d. P1-M8)", () => {
  it("contains exactly 45 server-side formative quiz questions", () => {
    expect(foundationsFormativeQuestions).toHaveLength(45);
  });

  it("ensures all 45 question IDs are distinct and start with quiz-", () => {
    const ids = foundationsFormativeQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(45);

    for (const id of ids) {
      expect(id).toMatch(/^quiz-[a-z0-9-]+$/);
    }
  });

  it("ensures each question has at least 4 options, a valid correct answer, an explanation, and misconception feedback", () => {
    for (const q of foundationsFormativeQuestions) {
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.options.length).toBeGreaterThanOrEqual(4);

      const optionIds = q.options.map((o) => o.id);
      expect(optionIds).toContain(q.correctAnswer);

      for (const opt of q.options) {
        expect(opt.text.trim().length).toBeGreaterThan(0);
      }

      expect(q.explanation.trim().length).toBeGreaterThan(10);
      expect(q.misconceptionFeedback.trim().length).toBeGreaterThan(10);
      expect(q.outcomeId.trim().length).toBeGreaterThan(0);
    }
  });

  it("covers exactly 3 formative questions per lesson across all 15 lessons (L05-L19)", () => {
    const expectedSlugs = [
      "lan-man-wan",
      "network-contexts-home-school-enterprise",
      "client-server-roles",
      "request-response-cycle",
      "bus-star-ring",
      "topology-fault-impact",
      "nic-switch-router-ap",
      "modem-firewall-server",
      "copper-twisted-pair-wireless",
      "rj45-crimping-t568ab",
      "fiber-optic-intro",
      "bits-frames-packets",
      "unicast-broadcast-multicast",
      "osi-seven-layers",
      "tcp-ip-and-encapsulation",
    ];

    for (const slug of expectedSlugs) {
      const questionsForLesson = foundationsFormativeQuestions.filter(
        (q) => q.lessonSlug === slug
      );
      expect(questionsForLesson).toHaveLength(3);
    }
  });

  it("finds questions from both welcome and foundations via findFormativeQuestion service", () => {
    // Check a Welcome question
    const welcomeQ = findFormativeQuestion("quiz-wn-l1-q1");
    expect(welcomeQ).not.toBeNull();
    expect(welcomeQ?.lessonSlug).toBe("intro-to-networking");

    // Check a Foundations question
    const foundQ = findFormativeQuestion("quiz-ton-l5-q1");
    expect(foundQ).not.toBeNull();
    expect(foundQ?.lessonSlug).toBe("lan-man-wan");

    const foundQ2 = findFormativeQuestion("quiz-osi-l19-q3");
    expect(foundQ2).not.toBeNull();
    expect(foundQ2?.lessonSlug).toBe("tcp-ip-and-encapsulation");

    // Non-existent
    const none = findFormativeQuestion("quiz-non-existent-123");
    expect(none).toBeNull();
  });

  it("verifies all 45 formative question IDs correspond to quizzes declared in curriculum modules", () => {
    const moduleSlugs = [
      "types-of-networks",
      "client-server-communication",
      "network-topology",
      "network-devices",
      "physical-media-cabling",
      "how-data-travels",
      "osi-tcpip-foundations",
    ];

    const curriculumQuizIds = new Set<string>();

    for (const modSlug of moduleSlugs) {
      const mod = getCurriculumModule(modSlug);
      expect(mod).toBeDefined();

      for (const lesson of mod!.lessons) {
        for (const block of lesson.content.blocks) {
          if (block.type === "quiz") {
            curriculumQuizIds.add(block.quizId);
          }
        }
      }
    }

    for (const q of foundationsFormativeQuestions) {
      expect(curriculumQuizIds.has(q.id)).toBe(true);
    }
  });
});
