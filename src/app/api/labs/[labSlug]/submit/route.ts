import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { evaluateLabSubmission } from "@/features/labs/evaluator";
import { awardXp } from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

export async function POST(
  request: Request,
  props: { params: Promise<{ labSlug: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { labSlug } = await props.params;
    const body = await request.json();

    const evaluation = evaluateLabSubmission(labSlug, body.state || {});

    let xpResult = null;
    if (evaluation.passed) {
      xpResult = await awardXp(
        user.id,
        100,
        "LAB_COMPLETED",
        `lab-${labSlug}`
      );
    }

    // Try finding lab to link attempt if lab exists
    const lab = await prisma.lab.findUnique({
      where: { slug: labSlug },
    });

    if (lab) {
      await prisma.labAttempt.create({
        data: {
          userId: user.id,
          labId: lab.id,
          score: evaluation.score,
          passed: evaluation.passed,
          state: body.state || {},
        },
      });
    }

    return NextResponse.json({
      passed: evaluation.passed,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      feedback: evaluation.feedback,
      xpResult,
    });
  } catch (error) {
    console.error("Lab submit error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate lab submission" },
      { status: 500 }
    );
  }
}
