import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { evaluateSupportChallenge } from "@/features/challenges/support-challenge";
import { awardXp } from "@/features/xp/ledger";

const challengeSubmitSchema = z.object({
  challengeId: z.literal("first-day-it-support"),
  selectedDeviceIds: z.array(z.string()),
  topologyChoice: z.string().min(1),
  troubleshootAnswer: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = challengeSubmitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid submission" },
        { status: 400 }
      );
    }

    const evaluation = evaluateSupportChallenge({
      selectedDeviceIds: result.data.selectedDeviceIds,
      topologyChoice: result.data.topologyChoice,
      troubleshootAnswer: result.data.troubleshootAnswer,
    });

    let xpResult = null;
    if (evaluation.passed) {
      xpResult = await awardXp(
        user.id,
        100,
        "CHALLENGE_SOLVED",
        "challenge-first-day-it-support"
      );
    }

    return NextResponse.json({
      passed: evaluation.passed,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      feedback: evaluation.feedback,
      xpResult,
    });
  } catch (error) {
    console.error("Challenge submit error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate challenge submission" },
      { status: 500 }
    );
  }
}
