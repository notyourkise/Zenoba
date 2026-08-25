import { QuizQuestion } from "./schema";

export interface QuizEvaluationResult {
  passed: boolean;
  score: number;
  maxScore: number;
  explanation?: string;
  feedback: string;
}

/**
 * Pure deterministic quiz answer evaluation.
 */
export function evaluateQuizAnswer(
  question: QuizQuestion,
  submittedAnswer: string | string[]
): QuizEvaluationResult {
  switch (question.type) {
    case "single_choice": {
      const isCorrect =
        typeof submittedAnswer === "string" &&
        submittedAnswer.trim() === question.correctOptionId.trim();

      return {
        passed: isCorrect,
        score: isCorrect ? question.xpReward : 0,
        maxScore: question.xpReward,
        explanation: question.explanation,
        feedback: isCorrect
          ? "Jawaban Anda tepat!"
          : "Jawaban belum tepat, silakan pelajari kembali materi dan coba lagi.",
      };
    }

    case "multiple_choice": {
      if (!Array.isArray(submittedAnswer)) {
        return {
          passed: false,
          score: 0,
          maxScore: question.xpReward,
          explanation: question.explanation,
          feedback: "Format jawaban tidak valid untuk pilihan ganda berganda.",
        };
      }

      const userSet = new Set(submittedAnswer);
      const correctSet = new Set(question.correctOptionIds);

      const isExactMatch =
        userSet.size === correctSet.size &&
        [...userSet].every((id) => correctSet.has(id));

      return {
        passed: isExactMatch,
        score: isExactMatch ? question.xpReward : 0,
        maxScore: question.xpReward,
        explanation: question.explanation,
        feedback: isExactMatch
          ? "Semua opsi yang dipilih benar!"
          : "Pilihan opsi belum lengkap atau mengandung opsi yang salah.",
      };
    }

    case "ordering": {
      if (!Array.isArray(submittedAnswer)) {
        return {
          passed: false,
          score: 0,
          maxScore: question.xpReward,
          explanation: question.explanation,
          feedback: "Format urutan tidak valid.",
        };
      }

      const isCorrectOrder =
        submittedAnswer.length === question.correctOrder.length &&
        submittedAnswer.every((item, idx) => item === question.correctOrder[idx]);

      return {
        passed: isCorrectOrder,
        score: isCorrectOrder ? question.xpReward : 0,
        maxScore: question.xpReward,
        explanation: question.explanation,
        feedback: isCorrectOrder
          ? "Urutan langkah tepat!"
          : "Urutan belum tepat, periksa kembali kronologi prosesnya.",
      };
    }

    default: {
      return {
        passed: false,
        score: 0,
        maxScore: 0,
        feedback: "Tipe kuis tidak didukung.",
      };
    }
  }
}
