import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { evaluateSupportChallenge } from "@/features/challenges/support-challenge";
import { awardXp } from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

const challengeSubmitSchema = z.object({
  challengeId: z.literal("first-day-it-support"),
  selectedDeviceIds: z.array(z.string()),
  topologyChoice: z.string().min(1),
  troubleshootAnswer: z.string().min(1),
  isPathFinal: z.boolean().optional(),
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

    // Eligibility check when taken as Path 1 Final Assessment
    if (result.data.isPathFinal) {
      const path = await prisma.learningPath.findUnique({
        where: { slug: "network-foundations" },
        include: {
          modules: {
            where: { published: true },
            include: {
              lessons: {
                where: { published: true },
                select: { id: true },
              },
            },
          },
        },
      });

      if (path) {
        const pathLessonIds = path.modules.flatMap((m) =>
          m.lessons.map((l) => l.id)
        );
        const totalLessons = pathLessonIds.length;

        if (totalLessons > 0) {
          const userCompletedRecords =
            await prisma.userLessonProgress.findMany({
              where: {
                userId: user.id,
                lessonId: { in: pathLessonIds },
                status: "COMPLETED",
              },
              select: { lessonId: true },
            });

          const completedCount = userCompletedRecords.length;

          if (completedCount < totalLessons) {
            return NextResponse.json(
              {
                error:
                  "Prasyarat belum terpenuhi. Anda harus menyelesaikan seluruh 19 pelajaran di Network Foundations sebelum mengambil Ujian Akhir Path.",
                code: "PREREQUISITES_INCOMPLETE",
                completedLessons: completedCount,
                totalLessons,
              },
              { status: 403 }
            );
          }
        }
      }
    }

    const evaluation = evaluateSupportChallenge({
      selectedDeviceIds: result.data.selectedDeviceIds,
      topologyChoice: result.data.topologyChoice,
      troubleshootAnswer: result.data.troubleshootAnswer,
      isPathFinal: result.data.isPathFinal,
    });

    let xpResult = null;
    if (evaluation.passed) {
      xpResult = await awardXp(
        user.id,
        150,
        "CHALLENGE_SOLVED",
        "challenge-first-day-it-support"
      );
    }

    // Persist to AssessmentAttempt for audit and curriculum outcome tracking
    const requestId = crypto.randomUUID();
    const assessmentId = result.data.isPathFinal
      ? "path-network-foundations-final"
      : "challenge-first-day-it-support";

    try {
      await prisma.assessmentAttempt.create({
        data: {
          userId: user.id,
          assessmentId,
          score: evaluation.score,
          passed: evaluation.passed,
          answersJson: {
            submission: result.data,
            outcomeResults: evaluation.outcomeResults,
            unmetOutcomes: evaluation.unmetOutcomes,
          } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          requestId,
        },
      });
    } catch (persistErr) {
      console.error("Failed to record assessment attempt:", persistErr);
    }

    // Persist to ChallengeAttempt if challenge record exists in database
    try {
      const challenge = await prisma.challenge.findUnique({
        where: { slug: "first-day-it-support" },
        select: { id: true },
      });

      if (challenge) {
        await prisma.challengeAttempt.create({
          data: {
            userId: user.id,
            challengeId: challenge.id,
            score: evaluation.score,
            passed: evaluation.passed,
            answers: {
              submission: result.data,
              outcomeResults: evaluation.outcomeResults,
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          },
        });
      }
    } catch (challengeErr) {
      console.error("Failed to record challenge attempt:", challengeErr);
    }

    return NextResponse.json({
      passed: evaluation.passed,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      feedback: evaluation.feedback,
      outcomeResults: evaluation.outcomeResults,
      unmetOutcomes: evaluation.unmetOutcomes,
      xpResult,
      isPathFinal: !!result.data.isPathFinal,
    });
  } catch (error) {
    console.error("Challenge submit error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate challenge submission" },
      { status: 500 }
    );
  }
}
