import { NextResponse } from "next/server";
import { z } from "zod";
import { requireLearnerActor, AuthorizationError } from "@/lib/auth";
import {
  getLearnerReviewSession,
  rateOutcomeReview,
} from "@/features/learning/review-service";

const reviewSubmissionSchema = z.object({
  outcomeId: z.string().trim().min(1, "outcomeId is required"),
  rating: z.enum(["AGAIN", "HARD", "GOOD"]),
  clientRequestId: z.string().optional(),
});

export async function GET() {
  try {
    const actor = await requireLearnerActor();
    const session = await getLearnerReviewSession(actor.id);
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireLearnerActor();
    const body = await request.json();
    const parsed = reviewSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validasi gagal" },
        { status: 400 }
      );
    }

    const updated = await rateOutcomeReview(actor.id, parsed.data);
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
