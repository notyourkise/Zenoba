import { createHash } from "node:crypto";

/**
 * Derives a deterministic one-way SHA-256 hash for rate limit buckets.
 * Guarantees privacy: IP addresses and user emails are never stored in plaintext in the database.
 */
export function hashRateLimitKey(scope: string, identifier: string): string {
  const normalized = identifier.toLowerCase().trim();
  return createHash("sha256").update(`${scope}:${normalized}`).digest("hex");
}

export interface AuthRateLimitRecord {
  key: string;
  count: number;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RateLimitPrismaClientLike = {
  authRateLimit: {
    findUnique: (args: { where: { key: string } }) => Promise<AuthRateLimitRecord | null>;
    upsert: (args: {
      where: { key: string };
      create: { key: string; count: number; expiresAt: Date };
      update: { count: number; expiresAt: Date };
    }) => Promise<AuthRateLimitRecord>;
    update: (args: {
      where: { key: string };
      data: { count: { increment: number } };
    }) => Promise<AuthRateLimitRecord>;
    deleteMany: (args: {
      where: {
        expiresAt: {
          lt: Date;
        };
      };
    }) => Promise<{ count: number }>;
  };
};

let defaultRateLimitPrismaClient: RateLimitPrismaClientLike | null = null;

export function setRateLimitPrismaClient(client: RateLimitPrismaClientLike | null): void {
  defaultRateLimitPrismaClient = client;
}

export function getRateLimitPrismaClient(): RateLimitPrismaClientLike | null {
  return defaultRateLimitPrismaClient;
}

export interface AsyncRateLimitOptions {
  db?: RateLimitPrismaClientLike;
  now?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // epoch ms
  retryAfterSeconds: number;
}

// Map of key -> array of timestamp (ms)
const rateLimitStore = new Map<string, number[]>();

const MAX_STORE_KEYS = 5000;

/**
 * Prunes expired entries from the store to prevent unbounded memory growth.
 */
function pruneStore(now: number, maxWindowMs = 3600000): void {
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter((t) => t > now - maxWindowMs);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else if (valid.length !== timestamps.length) {
      rateLimitStore.set(key, valid);
    }
  }
}

/**
 * Checks and records an attempt against a sliding-window rate limit.
 *
 * @param key Unique key for the rate limit bucket (e.g., `forgot-pwd:ip:1.2.3.4`)
 * @param limit Maximum number of allowed attempts within windowMs
 * @param windowMs Window duration in milliseconds
 * @param now Optional timestamp for deterministic testing
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  // Defensive garbage collection if key count grows large
  if (rateLimitStore.size > MAX_STORE_KEYS) {
    pruneStore(now, windowMs);
  }

  const existing = rateLimitStore.get(key) || [];
  const windowStart = now - windowMs;
  const recent = existing.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= limit) {
    const oldestInWindow = recent[0];
    const resetTime = oldestInWindow + windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    return {
      success: false,
      limit,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    };
  }

  recent.push(now);
  rateLimitStore.set(key, recent);

  const resetTime = (recent[0] ?? now) + windowMs;
  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - recent.length),
    resetTime,
    retryAfterSeconds: 0,
  };
}

/**
 * Extracts client IP address from standard request headers with safe fallback.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Ensures that an operation takes at least `targetDurationMs` milliseconds to complete,
 * preventing side-channel timing attacks (e.g. account enumeration via response duration).
 * In test mode (NODE_ENV === "test"), delay is bypassed unless `force` is true.
 */
export async function ensureMinimumDuration(
  startTimeMs: number,
  targetDurationMs = 250,
  force = false,
): Promise<void> {
  if (process.env.NODE_ENV === "test" && !force) {
    return;
  }
  const elapsed = Date.now() - startTimeMs;
  if (elapsed < targetDurationMs) {
    await new Promise((resolve) => setTimeout(resolve, targetDurationMs - elapsed));
  }
}

/**
 * Clears all rate limit state. Primarily used in unit tests.
 */
export function resetRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Asynchronously checks and records an attempt against a persistent PostgreSQL-backed rate limit.
 * Falls back safely to process in-memory rate limiting if database is unavailable.
 *
 * @param key Unique key for the rate limit bucket (typically SHA-256 hashed via hashRateLimitKey)
 * @param limit Maximum allowed attempts within windowMs
 * @param windowMs Window duration in milliseconds
 * @param options Optional configuration including database client and deterministic timestamp
 */
export async function checkRateLimitAsync(
  key: string,
  limit: number,
  windowMs: number,
  options?: AsyncRateLimitOptions,
): Promise<RateLimitResult> {
  const nowMs = options?.now ?? Date.now();
  const client = options?.db ?? defaultRateLimitPrismaClient;

  if (!client || !client.authRateLimit) {
    return checkRateLimit(key, limit, windowMs, nowMs);
  }

  try {
    const existing = await client.authRateLimit.findUnique({
      where: { key },
    });

    const isExpired = !existing || existing.expiresAt.getTime() <= nowMs;

    if (isExpired) {
      const expiresAt = new Date(nowMs + windowMs);
      await client.authRateLimit.upsert({
        where: { key },
        create: {
          key,
          count: 1,
          expiresAt,
        },
        update: {
          count: 1,
          expiresAt,
        },
      });

      return {
        success: true,
        limit,
        remaining: Math.max(0, limit - 1),
        resetTime: expiresAt.getTime(),
        retryAfterSeconds: 0,
      };
    }

    const updated = await client.authRateLimit.update({
      where: { key },
      data: {
        count: { increment: 1 },
      },
    });

    const resetTime = updated.expiresAt.getTime();
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - nowMs) / 1000));

    if (updated.count > limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetTime,
        retryAfterSeconds,
      };
    }

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - updated.count),
      resetTime,
      retryAfterSeconds: 0,
    };
  } catch (error) {
    console.error(
      `[RateLimiter] Database rate limit check failed for key ${key}, falling back to in-memory store:`,
      error,
    );
    return checkRateLimit(key, limit, windowMs, nowMs);
  }
}

/**
 * Prunes expired entries from the in-memory store.
 */
export function pruneInMemoryRateLimits(now = Date.now(), maxWindowMs = 3600000): void {
  pruneStore(now, maxWindowMs);
}
