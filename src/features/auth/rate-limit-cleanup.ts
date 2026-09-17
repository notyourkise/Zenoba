import {
  type RateLimitPrismaClientLike,
  getRateLimitPrismaClient,
  pruneInMemoryRateLimits,
} from "./rate-limiter";

/**
 * Prunes expired rate limit records from persistent PostgreSQL storage
 * and the process in-memory store.
 *
 * @param now Reference timestamp (Date or epoch ms)
 * @param db Optional PrismaClient instance
 * @returns Number of persistent records deleted
 */
export async function pruneExpiredRateLimits(
  now: Date | number = new Date(),
  db?: RateLimitPrismaClientLike,
): Promise<{ deletedCount: number }> {
  const nowDate = now instanceof Date ? now : new Date(now);
  const nowMs = nowDate.getTime();

  // 1. Clean in-memory entries
  pruneInMemoryRateLimits(nowMs);

  // 2. Clean persistent PostgreSQL records
  const client = db ?? getRateLimitPrismaClient();
  if (!client || !client.authRateLimit) {
    return { deletedCount: 0 };
  }

  const result = await client.authRateLimit.deleteMany({
    where: {
      expiresAt: {
        lt: nowDate,
      },
    },
  });

  return { deletedCount: result.count };
}
