import { prisma } from "@/lib/db/client";

/**
 * 15-minute write throttling window for user activity updates.
 */
export const ACTIVITY_WRITE_INTERVAL_MS = 15 * 60 * 1000;

/**
 * Updates the user's lastActiveAt timestamp if at least 15 minutes have passed
 * since the last recorded activity. Operates in a non-blocking, best-effort manner.
 *
 * @param userId - Unique user identifier
 * @param now - Reference timestamp (defaults to current date/time)
 * @returns boolean indicating whether a database write occurred
 */
export async function touchUserActivity(
  userId: string,
  now: Date = new Date(),
): Promise<boolean> {
  const trimmedId = userId?.trim();
  if (!trimmedId) {
    return false;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: trimmedId },
      select: {
        id: true,
        lastActiveAt: true,
      },
    });

    if (!user) {
      return false;
    }

    if (user.lastActiveAt) {
      const elapsed = now.getTime() - user.lastActiveAt.getTime();
      if (elapsed >= 0 && elapsed < ACTIVITY_WRITE_INTERVAL_MS) {
        return false;
      }
    }

    await prisma.user.update({
      where: { id: trimmedId },
      data: {
        lastActiveAt: now,
      },
    });

    return true;
  } catch (error) {
    console.error("[UserActivity] Failed to touch user activity:", error);
    return false;
  }
}
