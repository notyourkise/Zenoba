import { NextResponse } from "next/server";
import { z } from "zod";
import { requireLearnerActor, AuthorizationError } from "@/lib/auth";
import {
  toggleBookmark,
  isLessonBookmarked,
  getUserBookmarks,
} from "@/features/learning/bookmarks/service";

const postBookmarkSchema = z.object({
  lessonId: z.string().trim().min(1, "lessonId is required"),
});

export async function GET(request: Request) {
  try {
    const actor = await requireLearnerActor();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      const bookmarked = await isLessonBookmarked(actor.id, lessonId);
      return NextResponse.json({ bookmarked });
    }

    const bookmarks = await getUserBookmarks(actor.id);
    return NextResponse.json({ bookmarks });
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
    const parsed = postBookmarkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validasi gagal" },
        { status: 400 }
      );
    }

    const result = await toggleBookmark(actor.id, parsed.data.lessonId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
