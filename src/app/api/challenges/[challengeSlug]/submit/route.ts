import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { evaluateChallengeDiagnosis } from "@/features/challenges/engine";
import { awardXp } from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

export async function POST(
  request: Request,
  props: { params: Promise<{ challengeSlug: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeSlug } = await props.params;
    const body = await request.json();

    const evaluation = evaluateChallengeDiagnosis(
      challengeSlug,
      body.submission || {}
    );

    let xpResult = null;
    if (evaluation.passed) {
      xpResult = await awardXp(
        user.id,
        150,
        "CHALLENGE_SOLVED",
        `challenge-${challengeSlug}`
      );
    }

    // Try finding challenge to link attempt
    const challenge = await prisma.challenge.findUnique({
      where: { slug: challengeSlug },
    });

    if (challenge) {
      await prisma.challengeAttempt.create({
        data: {
          userId: user.id,
          challengeId: challenge.id,
          score: evaluation.score,
          passed: evaluation.passed,
          answers: body.submission || {},
        },
      });
    }

    return NextResponse.json({
      passed: evaluation.passed,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      rootCauseFeedback: evaluation.rootCauseFeedback,
      explanation: evaluation.explanation,
      xpResult,
    });
  } catch (error) {
    console.error("Challenge submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit challenge diagnosis" },
      { status: 500 }
    );
  }
}
