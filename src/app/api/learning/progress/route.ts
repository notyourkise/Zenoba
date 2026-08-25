import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  startLessonProgress,
  completeLessonProgress,
} from "@/features/learning/progress";

const progressSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
  action: z.enum(["start", "complete"]),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = progressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { lessonId, action } = result.data;

    if (action === "start") {
      const progress = await startLessonProgress(user.id, lessonId);
      return NextResponse.json({
        message: "Lesson started",
        progress,
      });
    }

    if (action === "complete") {
      const progress = await completeLessonProgress(user.id, lessonId);
      return NextResponse.json({
        message: "Lesson completed",
        progress,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update progress";
    const status = errorMessage.includes("Cannot start a locked lesson")
      ? 403
      : errorMessage.includes("not found")
      ? 404
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
