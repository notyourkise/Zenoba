import { prisma } from "@/lib/db/client";

export type XpEventType =
  | "LESSON_COMPLETION"
  | "QUIZ_PASS"
  | "PRACTICE_SOLVED"
  | "LAB_COMPLETED"
  | "CHALLENGE_SOLVED"
  | "CONSULTANT_PROJECT_PASSED";

export interface AwardXpResult {
  awarded: boolean;
  amount: number;
  totalXp: number;
  message: string;
}

/**
 * Awards XP to a user with strict database-level idempotency via UserXpLedger.
 */
export async function awardXp(
  userId: string,
  amount: number,
  eventType: XpEventType,
  referenceId: string
): Promise<AwardXpResult> {
  if (amount <= 0) {
    const totalXp = await getUserTotalXp(userId);
    return {
      awarded: false,
      amount: 0,
      totalXp,
      message: "XP amount must be positive",
    };
  }

  // Check existing ledger entry
  const existing = await prisma.userXpLedger.findUnique({
    where: {
      userId_eventType_referenceId: {
        userId,
        eventType,
        referenceId,
      },
    },
  });

  if (existing) {
    const totalXp = await getUserTotalXp(userId);
    return {
      awarded: false,
      amount: 0,
      totalXp,
      message: "XP has already been awarded for this activity",
    };
  }

  // Insert ledger entry
  await prisma.userXpLedger.create({
    data: {
      userId,
      amount,
      eventType,
      referenceId,
    },
  });

  const totalXp = await getUserTotalXp(userId);

  return {
    awarded: true,
    amount,
    totalXp,
    message: `+${amount} XP berhasil ditambahkan!`,
  };
}

/**
 * Derives the verified total XP of a user by summing all ledger entries.
 */
export async function getUserTotalXp(userId: string): Promise<number> {
  const aggregate = await prisma.userXpLedger.aggregate({
    where: { userId },
    _sum: {
      amount: true,
    },
  });

  return aggregate._sum.amount || 0;
}
