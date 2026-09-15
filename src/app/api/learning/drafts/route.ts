import { NextResponse } from "next/server";
import { z } from "zod";
import { requireLearnerActor, AuthorizationError } from "@/lib/auth";
import {
  saveLearningDraft,
  getLearningDraft,
  deleteLearningDraft,
  listLessonDrafts,
  DraftPayloadTooLargeError,
  DraftPayloadInvalidError,
} from "@/features/learning/drafts/service";

const putDraftSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
  activityId: z.string().min(1, "activityId is required"),
  contentVersion: z.string().optional().default("1.0"),
  payload: z.unknown(),
});

export async function GET(request: Request) {
  try {
    const actor = await requireLearnerActor();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");
    const activityId = searchParams.get("activityId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Query parameter 'lessonId' is required" },
        { status: 400 }
      );
    }

    if (activityId) {
      const draft = await getLearningDraft({
        userId: actor.id,
        lessonId,
        activityId,
      });
      return NextResponse.json({ draft });
    }

    const drafts = await listLessonDrafts({
      userId: actor.id,
      lessonId,
    });
    return NextResponse.json({ drafts });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const actor = await requireLearnerActor();
    const body = await request.json();
    const parsed = putDraftSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { lessonId, activityId, contentVersion, payload } = parsed.data;

    const result = await saveLearningDraft({
      userId: actor.id,
      lessonId,
      activityId,
      contentVersion,
      payload,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof DraftPayloadTooLargeError) {
      return NextResponse.json({ error: error.message }, { status: 413 });
    }
    if (error instanceof DraftPayloadInvalidError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireLearnerActor();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");
    const activityId = searchParams.get("activityId");

    if (!lessonId || !activityId) {
      return NextResponse.json(
        { error: "Query parameters 'lessonId' and 'activityId' are required" },
        { status: 400 }
      );
    }

    const result = await deleteLearningDraft({
      userId: actor.id,
      lessonId,
      activityId,
    });

    return NextResponse.json({ success: true, deleted: result.deleted });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
