import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { evaluateSupportChallenge } from "@/features/challenges/support-challenge";
import { evaluateSchoolRoomAllocation } from "@/features/learning/practice/ipv4/room-allocation";
import { awardXp } from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

const supportChallengeSchema = z.object({
  challengeId: z.literal("first-day-it-support"),
  selectedDeviceIds: z.array(z.string()),
  topologyChoice: z.string().min(1),
  troubleshootAnswer: z.string().min(1),
  isPathFinal: z.boolean().optional(),
});

const roomAllocationItemSchema = z.object({
  roomId: z.string(),
  roomName: z.string(),
  requiredHosts: z.number(),
  prefix: z.number(),
  networkAddress: z.string(),
  gateway: z.string(),
  broadcastAddress: z.string(),
});

const schoolRoomAllocationSchema = z.object({
  challengeId: z.literal("school-room-allocation"),
  baseNetwork: z.string().optional(),
  allocations: z.array(roomAllocationItemSchema),
  isPathFinal: z.boolean().optional(),
});

const challengeSubmitSchema = z.discriminatedUnion("challengeId", [
  supportChallengeSchema,
  schoolRoomAllocationSchema,
]);

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

    // =========================================================================
    // Challenge 1: First Day as IT Support (Path 1 Capstone)
    // =========================================================================
    if (result.data.challengeId === "first-day-it-support") {
      const data = result.data;

      // Eligibility check when taken as Path 1 Final Assessment
      if (data.isPathFinal) {
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
        selectedDeviceIds: data.selectedDeviceIds,
        topologyChoice: data.topologyChoice,
        troubleshootAnswer: data.troubleshootAnswer,
        isPathFinal: data.isPathFinal,
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

      // Persist to AssessmentAttempt
      const requestId = crypto.randomUUID();
      const assessmentId = data.isPathFinal
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
              submission: data,
              outcomeResults: evaluation.outcomeResults,
              unmetOutcomes: evaluation.unmetOutcomes,
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            requestId,
          },
        });
      } catch (persistErr) {
        console.error("Failed to record assessment attempt:", persistErr);
      }

      // Also record ChallengeAttempt for standalone challenge progress
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
                submission: data,
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
        isPathFinal: !!data.isPathFinal,
      });
    }

    // =========================================================================
    // Challenge 2: School Multi-Room Subnet Allocation (Path 2 Capstone)
    // =========================================================================
    if (result.data.challengeId === "school-room-allocation") {
      const data = result.data;

      // Eligibility check when taken as Path 2 Final Assessment
      if (data.isPathFinal) {
        const path = await prisma.learningPath.findUnique({
          where: { slug: "ipv4-subnetting" },
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
                    "Prasyarat belum terpenuhi. Anda harus menyelesaikan seluruh 10 pelajaran di IPv4 & Subnetting sebelum mengambil Ujian Akhir Path.",
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

      const evaluation = evaluateSchoolRoomAllocation({
        baseNetwork: data.baseNetwork || "192.168.10.0/24",
        allocations: data.allocations,
      });

      let xpResult = null;
      if (evaluation.passed) {
        xpResult = await awardXp(
          user.id,
          200,
          "CHALLENGE_SOLVED",
          "challenge-school-room-allocation"
        );
      }

      // Persist to AssessmentAttempt
      const requestId = crypto.randomUUID();
      const assessmentId = data.isPathFinal
        ? "path-ipv4-subnetting-final"
        : "challenge-school-room-allocation";

      try {
        await prisma.assessmentAttempt.create({
          data: {
            userId: user.id,
            assessmentId,
            score: evaluation.score,
            passed: evaluation.passed,
            answersJson: {
              submission: data,
              criteriaResults: evaluation.criteriaResults,
              roomDetails: evaluation.roomDetails,
              unmetOutcomes: evaluation.unmetOutcomes,
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            requestId,
          },
        });
      } catch (persistErr) {
        console.error("Failed to record assessment attempt:", persistErr);
      }

      // Also record ChallengeAttempt for standalone challenge progress
      try {
        const challenge = await prisma.challenge.findUnique({
          where: { slug: "school-room-allocation" },
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
                submission: data,
                criteriaResults: evaluation.criteriaResults,
                roomDetails: evaluation.roomDetails,
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
        criteriaResults: evaluation.criteriaResults,
        roomDetails: evaluation.roomDetails,
        unmetOutcomes: evaluation.unmetOutcomes,
        xpResult,
        isPathFinal: !!data.isPathFinal,
      });
    }

    return NextResponse.json(
      { error: "Unsupported challenge type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Challenge submit error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate challenge submission" },
      { status: 500 }
    );
  }
}
