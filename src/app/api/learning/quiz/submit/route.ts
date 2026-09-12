import { NextResponse } from "next/server";
import { requireLearnerActor, AuthorizationError } from "@/lib/auth";
import { QuizSubmissionSchema } from "@/features/quiz/schema";
import { submitQuizAttempt } from "@/features/learning/assessment/service";
import {
  AssessmentNotFoundError,
  AssessmentMismatchError,
  AssessmentLockedError,
  AssessmentConflictError,
} from "@/features/learning/assessment/errors";
import { CourseAccessDeniedError } from "@/features/commerce/access";

export async function POST(request: Request) {
  try {
    const actor = await requireLearnerActor();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Format request body JSON tidak valid." },
        { status: 400 }
      );
    }

    const result = QuizSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Input kuis tidak valid" },
        { status: 400 }
      );
    }

    const { lessonId, quizId, answer, requestId } = result.data;

    const response = await submitQuizAttempt({
      userId: actor.id,
      lessonId,
      quizId,
      answer,
      requestId,
    });

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    if (error instanceof CourseAccessDeniedError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }

    if (error instanceof AssessmentNotFoundError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 404 }
      );
    }

    if (error instanceof AssessmentMismatchError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    if (error instanceof AssessmentLockedError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }

    if (error instanceof AssessmentConflictError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 409 }
      );
    }

    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pengiriman kuis." },
      { status: 500 }
    );
  }
}
