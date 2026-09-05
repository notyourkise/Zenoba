import { describe, expect, it } from "vitest";
import {
  welcomeFinalConceptQuestions,
  welcomeFormativeQuestions,
} from "../assessment/welcome.server";
import {
  projectPublicFinalConceptQuestion,
  projectPublicLessonContent,
  projectPublicQuizQuestion,
} from "./public-projection";
import type { LessonContentDocument } from "../blocks/schema";

describe("Public Content Projection & Secret Protection", () => {
  it("strips correctAnswer, explanation, and misconceptionFeedback from all 12 formative items", () => {
    expect(welcomeFormativeQuestions).toHaveLength(12);

    for (const privateQ of welcomeFormativeQuestions) {
      const publicQ = projectPublicQuizQuestion(privateQ);

      // Verify essential public fields remain
      expect(publicQ.id).toBe(privateQ.id);
      expect(publicQ.question).toBe(privateQ.question);
      expect(publicQ.options).toHaveLength(privateQ.options.length);

      // Verify secrets are strictly stripped
      expect("correctAnswer" in publicQ).toBe(false);
      expect("explanation" in publicQ).toBe(false);
      expect("misconceptionFeedback" in publicQ).toBe(false);
      expect((publicQ as unknown as Record<string, unknown>).correctAnswer).toBeUndefined();
      expect((publicQ as unknown as Record<string, unknown>).explanation).toBeUndefined();
    }
  });

  it("strips correctAnswer and explanation from all 10 final concept items", () => {
    expect(welcomeFinalConceptQuestions).toHaveLength(10);

    for (const privateQ of welcomeFinalConceptQuestions) {
      const publicQ = projectPublicFinalConceptQuestion(privateQ);

      expect(publicQ.id).toBe(privateQ.id);
      expect(publicQ.question).toBe(privateQ.question);
      expect(publicQ.options).toHaveLength(privateQ.options.length);

      expect("correctAnswer" in publicQ).toBe(false);
      expect("explanation" in publicQ).toBe(false);
      expect((publicQ as unknown as Record<string, unknown>).correctAnswer).toBeUndefined();
    }
  });

  it("sanitizes lesson content documents to prevent leaking quiz explanations before submit", () => {
    const rawDoc: LessonContentDocument = {
      version: "1.0",
      blocks: [
        {
          id: "heading-1",
          type: "heading",
          level: 1,
          text: "Intro",
        },
        {
          id: "quiz-1",
          type: "quiz",
          quizId: "quiz-1",
          question: "Test question?",
          quizType: "single_choice",
          options: [
            { id: "a", text: "Opt A" },
            { id: "b", text: "Opt B" },
          ],
          explanation: "SECRET EXPLANATION THAT REVEALS THE ANSWER!",
          xpReward: 10,
        },
      ],
    };

    const publicDoc = projectPublicLessonContent(rawDoc);

    expect(publicDoc.blocks[0].type).toBe("heading");
    const quizBlock = publicDoc.blocks[1];
    expect(quizBlock.type).toBe("quiz");
    if (quizBlock.type === "quiz") {
      expect(quizBlock.explanation).toBeUndefined();
    }
  });
});
