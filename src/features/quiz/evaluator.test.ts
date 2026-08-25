import { describe, expect, it } from "vitest";
import { evaluateQuizAnswer } from "./evaluator";
import { QuizQuestion } from "./schema";

describe("Quiz Answer Evaluator", () => {
  describe("Single Choice Evaluation", () => {
    const question: QuizQuestion = {
      type: "single_choice",
      id: "q-1",
      prompt: "Manakah perangkat yang bekerja di Layer 2 OSI?",
      options: [
        { id: "opt-1", text: "Hub" },
        { id: "opt-2", text: "Switch" },
        { id: "opt-3", text: "Router" },
      ],
      correctOptionId: "opt-2",
      explanation: "Switch beroperasi pada Data Link Layer (Layer 2).",
      xpReward: 10,
    };

    it("evaluates correct single choice answer", () => {
      const result = evaluateQuizAnswer(question, "opt-2");
      expect(result.passed).toBe(true);
      expect(result.score).toBe(10);
      expect(result.explanation).toBe("Switch beroperasi pada Data Link Layer (Layer 2).");
    });

    it("evaluates incorrect single choice answer", () => {
      const result = evaluateQuizAnswer(question, "opt-1");
      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
    });
  });

  describe("Multiple Choice Evaluation", () => {
    const question: QuizQuestion = {
      type: "multiple_choice",
      id: "q-2",
      prompt: "Pilih 2 jenis media transmisi kabel jaringan:",
      options: [
        { id: "opt-utp", text: "UTP / Twisted Pair" },
        { id: "opt-fiber", text: "Fiber Optic" },
        { id: "opt-wifi", text: "Wi-Fi 6" },
      ],
      correctOptionIds: ["opt-utp", "opt-fiber"],
      explanation: "UTP dan Fiber Optic adalah media kabel (guided media).",
      xpReward: 15,
    };

    it("evaluates exact matching multiple choice answers", () => {
      const result = evaluateQuizAnswer(question, ["opt-utp", "opt-fiber"]);
      expect(result.passed).toBe(true);
      expect(result.score).toBe(15);
    });

    it("fails when partial answers are provided", () => {
      const result = evaluateQuizAnswer(question, ["opt-utp"]);
      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
    });

    it("fails when invalid answers are included", () => {
      const result = evaluateQuizAnswer(question, ["opt-utp", "opt-fiber", "opt-wifi"]);
      expect(result.passed).toBe(false);
    });
  });

  describe("Ordering Evaluation", () => {
    const question: QuizQuestion = {
      type: "ordering",
      id: "q-3",
      prompt: "Urutkan proses 3-way handshake TCP:",
      items: [
        { id: "step-1", text: "SYN" },
        { id: "step-2", text: "SYN-ACK" },
        { id: "step-3", text: "ACK" },
      ],
      correctOrder: ["step-1", "step-2", "step-3"],
      explanation: "Urutan 3-way handshake adalah SYN, SYN-ACK, lalu ACK.",
      xpReward: 20,
    };

    it("evaluates exact sequence order", () => {
      const result = evaluateQuizAnswer(question, ["step-1", "step-2", "step-3"]);
      expect(result.passed).toBe(true);
      expect(result.score).toBe(20);
    });

    it("fails on scrambled sequence order", () => {
      const result = evaluateQuizAnswer(question, ["step-2", "step-1", "step-3"]);
      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
    });
  });
});
