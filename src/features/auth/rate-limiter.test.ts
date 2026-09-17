import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkRateLimit,
  checkRateLimitAsync,
  hashRateLimitKey,
  getClientIp,
  ensureMinimumDuration,
  resetRateLimits,
  type RateLimitPrismaClientLike,
} from "./rate-limiter";

describe("Rate Limiter & Abuse Protection", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests within configured limit", () => {
    const key = "test:ip:192.168.1.1";
    const limit = 3;
    const windowMs = 60000;

    const res1 = checkRateLimit(key, limit, windowMs, 1000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(key, limit, windowMs, 2000);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(key, limit, windowMs, 3000);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests exceeding limit and provides retryAfterSeconds", () => {
    const key = "test:ip:192.168.1.2";
    const limit = 2;
    const windowMs = 60000;

    checkRateLimit(key, limit, windowMs, 1000);
    checkRateLimit(key, limit, windowMs, 2000);

    // 3rd attempt at t = 3000ms should be blocked
    const res = checkRateLimit(key, limit, windowMs, 3000);
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
    // oldest is at 1000, resetTime = 1000 + 60000 = 61000
    // retryAfterSeconds = ceil((61000 - 3000) / 1000) = 58
    expect(res.retryAfterSeconds).toBe(58);
  });

  it("resets limit after sliding window expires", () => {
    const key = "test:ip:192.168.1.3";
    const limit = 1;
    const windowMs = 10000;

    const res1 = checkRateLimit(key, limit, windowMs, 1000);
    expect(res1.success).toBe(true);

    const res2 = checkRateLimit(key, limit, windowMs, 5000);
    expect(res2.success).toBe(false);

    // After window passes (t = 12000 > 1000 + 10000)
    const res3 = checkRateLimit(key, limit, windowMs, 12000);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("extracts IP correctly from x-forwarded-for and x-real-ip", () => {
    const req1 = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    expect(getClientIp(req1)).toBe("203.0.113.195");

    const req2 = new Request("http://localhost", {
      headers: { "x-real-ip": "198.51.100.42" },
    });
    expect(getClientIp(req2)).toBe("198.51.100.42");

    const req3 = new Request("http://localhost");
    expect(getClientIp(req3)).toBe("127.0.0.1");
  });

  it("ensures minimum duration for timing attack mitigation", async () => {
    const start = Date.now();
    await ensureMinimumDuration(start, 50, true);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // small tolerance for timers
  });

  describe("One-way Identity Hashing (Privacy Protection)", () => {
    it("normalizes case and whitespace before hashing", () => {
      const hash1 = hashRateLimitKey("forgot-pwd:email", "  Learner@Example.Com  ");
      const hash2 = hashRateLimitKey("forgot-pwd:email", "learner@example.com");
      expect(hash1).toBe(hash2);
    });

    it("generates 64-char SHA-256 hex string without raw identity leak", () => {
      const email = "secret.student@domain.id";
      const hash = hashRateLimitKey("forgot-pwd:email", email);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
      expect(hash).not.toContain("secret");
      expect(hash).not.toContain("student");
    });
  });

  describe("PostgreSQL Shared Rate Limiter (Multi-instance)", () => {
    function createMockRateLimitDb(): RateLimitPrismaClientLike & {
      _table: Map<string, { key: string; count: number; expiresAt: Date; createdAt: Date; updatedAt: Date }>;
    } {
      const table = new Map<
        string,
        { key: string; count: number; expiresAt: Date; createdAt: Date; updatedAt: Date }
      >();

      return {
        authRateLimit: {
          findUnique: vi.fn(async ({ where }: { where: { key: string } }) => {
            return table.get(where.key) ?? null;
          }),
          upsert: vi.fn(async ({ where, create, update }: {
            where: { key: string };
            create: { key: string; count: number; expiresAt: Date };
            update: { count: number; expiresAt: Date };
          }) => {
            const existing = table.get(where.key);
            const record = {
              key: where.key,
              count: existing ? update.count : create.count,
              expiresAt: existing ? update.expiresAt : create.expiresAt,
              createdAt: existing ? existing.createdAt : new Date(),
              updatedAt: new Date(),
            };
            table.set(where.key, record);
            return record;
          }),
          update: vi.fn(async ({ where, data }: {
            where: { key: string };
            data: { count: { increment: number } };
          }) => {
            const existing = table.get(where.key);
            if (!existing) throw new Error("Record not found");
            const record = {
              ...existing,
              count: existing.count + data.count.increment,
              updatedAt: new Date(),
            };
            table.set(where.key, record);
            return record;
          }),
          deleteMany: vi.fn(async ({ where }: {
            where: { expiresAt: { lt: Date } };
          }) => {
            let count = 0;
            for (const [key, record] of table.entries()) {
              if (record.expiresAt < where.expiresAt.lt) {
                table.delete(key);
                count++;
              }
            }
            return { count };
          }),
        },
        _table: table,
      };
    }

    it("shares rate limits across simulated multi-instance replicas", async () => {
      const sharedDb = createMockRateLimitDb();
      const key = "hashed-ip-key-1";
      const limit = 3;
      const windowMs = 60000;

      // Instance A: 1st request at t = 1000ms
      const resA1 = await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 1000 });
      expect(resA1.success).toBe(true);
      expect(resA1.remaining).toBe(2);

      // Simulate Instance B: local cache empty, queries shared database at t = 2000ms
      resetRateLimits();
      const resB1 = await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 2000 });
      expect(resB1.success).toBe(true);
      expect(resB1.remaining).toBe(1);

      // Instance A: 3rd request at t = 3000ms
      const resA2 = await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 3000 });
      expect(resA2.success).toBe(true);
      expect(resA2.remaining).toBe(0);

      // Instance B: 4th request at t = 4000ms -> should be blocked!
      resetRateLimits();
      const resB2 = await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 4000 });
      expect(resB2.success).toBe(false);
      expect(resB2.remaining).toBe(0);
      expect(resB2.retryAfterSeconds).toBe(57); // (61000 - 4000) / 1000 = 57
    });

    it("resets limit cleanly once the fixed window expires", async () => {
      const sharedDb = createMockRateLimitDb();
      const key = "hashed-ip-key-reset";
      const limit = 2;
      const windowMs = 10000;

      // 1st request at t = 1000 (expires at 11000)
      await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 1000 });
      // 2nd request at t = 2000
      await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 2000 });

      // 3rd request at t = 5000 -> blocked
      const blocked = await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 5000 });
      expect(blocked.success).toBe(false);

      // Request at boundary time t = 11001 (after 11000 expiry) -> reset!
      const resetReq = await checkRateLimitAsync(key, limit, windowMs, { db: sharedDb, now: 11001 });
      expect(resetReq.success).toBe(true);
      expect(resetReq.remaining).toBe(1);
    });

    it("falls back safely to in-memory limiter if database query throws", async () => {
      const failingDb: RateLimitPrismaClientLike = {
        authRateLimit: {
          findUnique: vi.fn().mockRejectedValue(new Error("Database connection lost")),
          upsert: vi.fn(),
          update: vi.fn(),
          deleteMany: vi.fn(),
        },
      };

      const key = "failing-db-key";
      const limit = 2;
      const windowMs = 60000;

      // Request 1 succeeds via in-memory fallback
      const res1 = await checkRateLimitAsync(key, limit, windowMs, { db: failingDb, now: 1000 });
      expect(res1.success).toBe(true);
      expect(res1.remaining).toBe(1);

      // Request 2 succeeds
      const res2 = await checkRateLimitAsync(key, limit, windowMs, { db: failingDb, now: 2000 });
      expect(res2.success).toBe(true);
      expect(res2.remaining).toBe(0);

      // Request 3 blocked via in-memory fallback
      const res3 = await checkRateLimitAsync(key, limit, windowMs, { db: failingDb, now: 3000 });
      expect(res3.success).toBe(false);
    });
  });
});
