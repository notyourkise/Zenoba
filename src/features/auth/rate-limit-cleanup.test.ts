import { describe, it, expect, vi, beforeEach } from "vitest";
import { pruneExpiredRateLimits } from "./rate-limit-cleanup";
import {
  checkRateLimit,
  resetRateLimits,
  type RateLimitPrismaClientLike,
} from "./rate-limiter";

function createMockRateLimitDb(): RateLimitPrismaClientLike & {
  _table: Map<string, { key: string; count: number; expiresAt: Date; createdAt: Date; updatedAt: Date }>;
} {
  const table = new Map<
    string,
    { key: string; count: number; expiresAt: Date; createdAt: Date; updatedAt: Date }
  >();

  return {
    authRateLimit: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(async ({ where }: { where: { expiresAt: { lt: Date } } }) => {
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

describe("Rate Limit Cleanup (Task 40.2)", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("prunes persistent PostgreSQL records and in-memory entries past expiry", async () => {
    const mockDb = createMockRateLimitDb();
    const now = new Date("2026-09-17T12:00:00Z");

    // Add expired and active entries in mock DB
    mockDb._table.set("expired-1", {
      key: "expired-1",
      count: 5,
      expiresAt: new Date("2026-09-17T11:59:00Z"), // 1 min ago
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockDb._table.set("expired-2", {
      key: "expired-2",
      count: 3,
      expiresAt: new Date("2026-09-17T11:45:00Z"), // 15 mins ago
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockDb._table.set("active-1", {
      key: "active-1",
      count: 2,
      expiresAt: new Date("2026-09-17T12:10:00Z"), // in 10 mins
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Populate in-memory store
    checkRateLimit("mem-key-1", 5, 60000, now.getTime() - 4000000); // expired > 1 hour ago
    checkRateLimit("mem-key-2", 5, 60000, now.getTime()); // active

    const result = await pruneExpiredRateLimits(now, mockDb);

    expect(result.deletedCount).toBe(2);
    expect(mockDb.authRateLimit.deleteMany).toHaveBeenCalled();
    expect(mockDb._table.has("expired-1")).toBe(false);
    expect(mockDb._table.has("expired-2")).toBe(false);
    expect(mockDb._table.has("active-1")).toBe(true);
  });
});
