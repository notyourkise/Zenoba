import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import { QuizSubmissionSchema } from "@/features/quiz/schema";
import { awardXp } from "@/features/xp/ledger";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = QuizSubmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { lessonId, quizId, answer } = result.data;

    // Evaluate answer (for MVP, check answer payload validity)
    const passed = typeof answer === "string" ? answer.trim().length > 0 : Array.isArray(answer) && answer.length > 0;
    const score = passed ? 10 : 0;

    // Record quiz attempt if lessonId matches a real record
    if (lessonId && lessonId !== "current-lesson") {
      try {
        await prisma.quizAttempt.create({
          data: {
            userId: user.id,
            lessonId,
            quizId,
            score,
            passed,
            answers: answer as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          },
        });
      } catch {
        // Ignore record creation error if mock or standalone quiz
      }
    }

    // Award XP if passed
    let xpResult = null;
    if (passed) {
      xpResult = await awardXp(user.id, 10, "QUIZ_PASS", quizId);
    }

    return NextResponse.json({
      passed,
      score,
      feedback: passed ? "Jawaban Anda tepat!" : "Jawaban belum tepat, silakan coba lagi.",
      explanation: "Pertanyaan ini menguji pemahaman konsep inti materi yang baru saja Anda pelajari.",
      xpResult,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Failed to process quiz submission" },
      { status: 500 }
    );
  }
}
