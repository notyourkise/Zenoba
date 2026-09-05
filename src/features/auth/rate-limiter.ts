/**
 * In-memory sliding-window rate limiter & abuse protection for auth endpoints.
 * Zero external dependencies; fully deterministic and memory-safe.
 */

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
