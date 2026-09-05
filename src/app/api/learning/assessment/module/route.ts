import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { submitModuleFinalAssessment } from "@/features/learning/assessment/service";
import {
  AssessmentNotFoundError,
  AssessmentLockedError,
  AssessmentConflictError,
} from "@/features/learning/assessment/errors";
import { CourseAccessDeniedError } from "@/features/commerce/access";

const ModuleFinalSubmissionSchema = z.object({
  moduleId: z.string().min(1, "moduleId is required"),
  conceptAnswers: z.record(z.string(), z.string()),
  practicalState: z.object({
    links: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        status: z.enum(["connected", "disconnected"]),
      })
    ),
    ispUplinkConnected: z.boolean(),
    verifiedPrints: z.array(
      z.object({
        client: z.string(),
        target: z.string(),
        success: z.boolean(),
      })
    ),
  }),
  requestId: z
    .string()
    .min(1, "requestId cannot be empty")
    .default(() => crypto.randomUUID()),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Format request body JSON tidak valid." },
        { status: 400 }
      );
    }

    const result = ModuleFinalSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0]?.message || "Input asesmen tidak valid",
        },
        { status: 400 }
      );
    }

    const { moduleId, conceptAnswers, practicalState, requestId } = result.data;

    const response = await submitModuleFinalAssessment({
      userId: user.id,
      moduleId,
      conceptAnswers,
      practicalState,
      requestId,
    });

    return NextResponse.json(response);
  } catch (error) {
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

    console.error("Module assessment submit error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pengiriman asesmen akhir modul." },
      { status: 500 }
    );
  }
}
