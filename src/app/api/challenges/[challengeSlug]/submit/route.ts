import { NextResponse } from "next/server";
import { requireLearnerActor, AuthorizationError } from "@/lib/auth";
import { evaluateChallengeDiagnosis } from "@/features/challenges/engine";
import { awardXp } from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

export async function POST(
  request: Request,
  props: { params: Promise<{ challengeSlug: string }> }
) {
  try {
    const actor = await requireLearnerActor();

    const { challengeSlug } = await props.params;
    const body = await request.json();

    const evaluation = evaluateChallengeDiagnosis(
      challengeSlug,
      body.submission || {}
    );

    let xpResult = null;
    if (evaluation.passed) {
      xpResult = await awardXp(
        actor.id,
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
          userId: actor.id,
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
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Challenge submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit challenge diagnosis" },
      { status: 500 }
    );
  }
}
