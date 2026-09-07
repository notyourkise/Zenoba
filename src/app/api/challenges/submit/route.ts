import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { evaluateSupportChallenge } from "@/features/challenges/support-challenge";
import { evaluateSchoolRoomAllocation } from "@/features/learning/practice/ipv4/room-allocation";
import { evaluateVlanRepair } from "@/features/learning/practice/switching/vlan-repair";
import { evaluateNamedServiceOutage } from "@/features/learning/practice/services/named-service-outage";
import { evaluateMultiIncidentInvestigation } from "@/features/learning/practice/troubleshooting/multi-incident";
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

const staffGuestVlanRepairSchema = z.object({
  challengeId: z.literal("staff-guest-vlan-repair"),
  switch2Port2Vlan: z.number(),
  trunkAllowedVlans: z.array(z.number()),
  interVlanReasonOption: z.string().min(1),
  isPathFinal: z.boolean().optional(),
});

const namedServiceOutageSchema = z.object({
  challengeId: z.literal("named-service-outage"),
  dhcpDefaultGateway: z.string(),
  dhcpDnsServer: z.string(),
  natOverloadEnabled: z.boolean(),
  transportOutageReasonOption: z.string().min(1),
  isPathFinal: z.boolean().optional(),
});

const multiIncidentInvestigationSchema = z.object({
  challengeId: z.literal("multi-incident-investigation"),
  apipaRootCause: z.string().min(1),
  apipaCorrection: z.string().min(1),
  interVlanRootCause: z.string().min(1),
  interVlanCorrection: z.string().min(1),
  gatewayRootCause: z.string().min(1),
  gatewayCorrection: z.string().min(1),
  troubleshootingPrincipleOption: z.string().min(1),
  serviceVerificationOption: z.string().min(1),
  isPathFinal: z.boolean().optional(),
});

const challengeSubmitSchema = z.discriminatedUnion("challengeId", [
  supportChallengeSchema,
  schoolRoomAllocationSchema,
  staffGuestVlanRepairSchema,
  namedServiceOutageSchema,
  multiIncidentInvestigationSchema,
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

    // =========================================================================
    // Challenge 3: Staff & Guest VLAN Repair (Path 3 Capstone)
    // =========================================================================
    if (result.data.challengeId === "staff-guest-vlan-repair") {
      const data = result.data;

      // Eligibility check when taken as Path 3 Final Assessment
      if (data.isPathFinal) {
        const path = await prisma.learningPath.findUnique({
          where: { slug: "switching-lan" },
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
                    "Prasyarat belum terpenuhi. Anda harus menyelesaikan seluruh 8 pelajaran di Switching & LAN sebelum mengambil Ujian Akhir Path.",
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

      const evaluation = evaluateVlanRepair({
        switch2Port2Vlan: data.switch2Port2Vlan,
        trunkAllowedVlans: data.trunkAllowedVlans,
        interVlanReasonOption: data.interVlanReasonOption,
      });

      let xpResult = null;
      if (evaluation.passed) {
        xpResult = await awardXp(
          user.id,
          150,
          "CHALLENGE_SOLVED",
          "challenge-staff-guest-vlan-repair"
        );
      }

      // Persist to AssessmentAttempt
      const requestId = crypto.randomUUID();
      const assessmentId = data.isPathFinal
        ? "path-switching-lan-final"
        : "challenge-staff-guest-vlan-repair";

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
          where: { slug: "staff-guest-vlan-repair" },
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
        unmetOutcomes: evaluation.unmetOutcomes,
        xpResult,
        isPathFinal: !!data.isPathFinal,
      });
    }

    // =========================================================================
    // Challenge 4: Named Service Outage (Path 4 Capstone)
    // =========================================================================
    if (result.data.challengeId === "named-service-outage") {
      const data = result.data;

      // Eligibility check when taken as Path 4 Final Assessment
      if (data.isPathFinal) {
        const path = await prisma.learningPath.findFirst({
          where: {
            OR: [{ slug: "network-services" }, { slug: "routing-services" }],
          },
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
                    "Prasyarat belum terpenuhi. Anda harus menyelesaikan seluruh 10 pelajaran di Routing & Layanan Jaringan sebelum mengambil Ujian Akhir Path.",
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

      const evaluation = evaluateNamedServiceOutage({
        dhcpDefaultGateway: data.dhcpDefaultGateway,
        dhcpDnsServer: data.dhcpDnsServer,
        natOverloadEnabled: data.natOverloadEnabled,
        transportOutageReasonOption: data.transportOutageReasonOption,
      });

      let xpResult = null;
      if (evaluation.passed) {
        xpResult = await awardXp(
          user.id,
          data.isPathFinal ? 200 : 150,
          "CHALLENGE_SOLVED",
          "challenge-named-service-outage"
        );
      }

      // Persist to AssessmentAttempt
      const requestId = crypto.randomUUID();
      const assessmentId = data.isPathFinal
        ? "path-network-services-final"
        : "challenge-named-service-outage";

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
          where: { slug: "named-service-outage" },
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
        unmetOutcomes: evaluation.unmetOutcomes,
        xpResult,
        isPathFinal: !!data.isPathFinal,
      });
    }

    // =========================================================================
    // Challenge 5: Multi-Incident Investigation & Remediation (Path 5 Capstone)
    // =========================================================================
    if (result.data.challengeId === "multi-incident-investigation") {
      const data = result.data;

      // Eligibility check when taken as Path 5 Final Assessment
      if (data.isPathFinal) {
        const path = await prisma.learningPath.findFirst({
          where: { slug: "wireless-troubleshooting" },
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
                    "Prasyarat belum terpenuhi. Anda harus menyelesaikan seluruh 8 pelajaran di Wireless & Troubleshooting sebelum mengambil Ujian Akhir Path.",
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

      const evaluation = evaluateMultiIncidentInvestigation(data);

      let xpResult = null;
      if (evaluation.passed) {
        xpResult = await awardXp(
          user.id,
          data.isPathFinal ? 200 : 150,
          "CHALLENGE_SOLVED",
          "challenge-multi-incident-investigation"
        );
      }

      // Persist as AssessmentAttempt
      const requestId = crypto.randomUUID();
      const assessmentId = data.isPathFinal
        ? "path-wireless-troubleshooting-final"
        : "challenge-multi-incident-investigation";

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
          where: { slug: "multi-incident-investigation" },
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
