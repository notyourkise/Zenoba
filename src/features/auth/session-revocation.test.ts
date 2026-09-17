import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  revokeUserSessions,
  isSessionRevoked,
  isSessionRevokedAsync,
  clearRevokedSessions,
  pruneRevokedSessions,
  type PrismaClientLike,
  type UserSecurityStateUpsertArgs,
  type UserSecurityStateFindUniqueArgs,
  type UserSecurityStateDeleteManyArgs,
} from "./session-revocation";

// In-memory mock database representing the PostgreSQL user_security_states table
function createMockPrismaDb(): PrismaClientLike & {
  _table: Map<string, { userId: string; validAfter: Date; updatedAt: Date }>;
} {
  const table = new Map<string, { userId: string; validAfter: Date; updatedAt: Date }>();

  return {
    userSecurityState: {
      upsert: vi.fn(async ({ where, update, create }: UserSecurityStateUpsertArgs) => {
        const record = {
          userId: where.userId,
          validAfter: update.validAfter ?? create.validAfter ?? new Date(),
          updatedAt: new Date(),
        };
        table.set(where.userId, record);
        return record;
      }),
      findUnique: vi.fn(async ({ where }: UserSecurityStateFindUniqueArgs) => {
        return table.get(where.userId) ?? null;
      }),
      deleteMany: vi.fn(async ({ where }: UserSecurityStateDeleteManyArgs) => {
        let count = 0;
        for (const [userId, record] of table.entries()) {
          if (where?.validAfter?.lt && record.validAfter < where.validAfter.lt) {
            table.delete(userId);
            count++;
          }
        }
        return { count };
      }),
    },
    _table: table,
  };
}

describe("Session Revocation Strategy (TD-08 / Task 40.1)", () => {
  beforeEach(() => {
    clearRevokedSessions();
  });

  describe("In-memory synchronous compatibility", () => {
    it("treats tokens as valid when no revocation exists", () => {
      expect(isSessionRevoked("user-1", Date.now())).toBe(false);
    });

    it("invalidates tokens issued prior to revocation", () => {
      const revocationTime = 100000;
      revokeUserSessions("user-1", revocationTime);

      // Old token issued at 90000 (before revocation)
      expect(isSessionRevoked("user-1", 90000)).toBe(true);

      // Token without iat
      expect(isSessionRevoked("user-1", undefined)).toBe(true);

      // New token issued at 105000 (after revocation)
      expect(isSessionRevoked("user-1", 105000)).toBe(false);

      // Different user is unaffected
      expect(isSessionRevoked("user-2", 90000)).toBe(false);
    });

    it("prunes old revocation records after 30-day window", () => {
      const oldTime = 1000;
      revokeUserSessions("user-old", oldTime);

      // 31 days later
      const futureTime = oldTime + 31 * 24 * 60 * 60 * 1000;
      pruneRevokedSessions(futureTime);

      // Record should be pruned
      expect(isSessionRevoked("user-old", 500)).toBe(false);
    });
  });

  describe("Shared PostgreSQL Persistence (Multi-instance)", () => {
    it("simulates two application instances sharing persistent database state", async () => {
      const sharedDb = createMockPrismaDb();

      // Instance A revokes session at timestamp 100,000
      const revocationDate = new Date(100000);
      await revokeUserSessions("user-shared", revocationDate, sharedDb);

      expect(sharedDb.userSecurityState.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-shared" },
          update: expect.objectContaining({ validAfter: revocationDate }),
        }),
      );

      // Simulate Instance B: local cache is empty (different container/restart)
      clearRevokedSessions();

      // Instance B checks old token issued at 90,000 ms (before revocation)
      const isRevokedOld = await isSessionRevokedAsync("user-shared", 90000, {
        db: sharedDb,
      });
      expect(isRevokedOld).toBe(true);

      // Instance B checks token issued after revocation at 110,000 ms
      const isRevokedNew = await isSessionRevokedAsync("user-shared", 110000, {
        db: sharedDb,
      });
      expect(isRevokedNew).toBe(false);

      // Instance B checks different user with no revocation record
      const isUnrelatedRevoked = await isSessionRevokedAsync("user-other", 90000, {
        db: sharedDb,
      });
      expect(isUnrelatedRevoked).toBe(false);
    });

    it("invalidates all previous tokens upon password reset", async () => {
      const sharedDb = createMockPrismaDb();
      const resetTime = new Date(200000);

      // Password reset triggers revocation
      await revokeUserSessions("user-pw-reset", resetTime, sharedDb);

      // Token issued 1 second before reset
      expect(
        await isSessionRevokedAsync("user-pw-reset", 199000, { db: sharedDb }),
      ).toBe(true);

      // Token issued without timestamp fails closed for safety
      expect(
        await isSessionRevokedAsync("user-pw-reset", undefined, { db: sharedDb }),
      ).toBe(true);

      // New token issued 1 second after reset succeeds
      expect(
        await isSessionRevokedAsync("user-pw-reset", 201000, { db: sharedDb }),
      ).toBe(false);
    });

    it("supports explicit developer-session invalidation with fail-closed security", async () => {
      const sharedDb = createMockPrismaDb();
      const devRevocationTime = new Date(300000);

      // Invalidate developer sessions
      await revokeUserSessions("dev-user", devRevocationTime, sharedDb);

      // Old developer session is revoked
      expect(
        await isSessionRevokedAsync("dev-user", 250000, {
          db: sharedDb,
          failClosed: true,
        }),
      ).toBe(true);

      // Newer developer session after re-auth is valid
      expect(
        await isSessionRevokedAsync("dev-user", 350000, {
          db: sharedDb,
          failClosed: true,
        }),
      ).toBe(false);
    });

    it("prunes persistent database records older than 30 days", async () => {
      const sharedDb = createMockPrismaDb();
      const now = Date.now();
      const thirtyFiveDaysAgo = new Date(now - 35 * 24 * 60 * 60 * 1000);
      const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000);

      // Seed old record and recent record
      await revokeUserSessions("user-stale", thirtyFiveDaysAgo, sharedDb);
      await revokeUserSessions("user-recent", fiveDaysAgo, sharedDb);

      expect(sharedDb._table.size).toBe(2);

      // Run persistent pruning
      await pruneRevokedSessions(now, sharedDb);

      expect(sharedDb.userSecurityState.deleteMany).toHaveBeenCalled();
      expect(sharedDb._table.has("user-stale")).toBe(false);
      expect(sharedDb._table.has("user-recent")).toBe(true);
    });

    describe("Database failure resilience and role-aware fail-closed policy", () => {
      it("fails closed for privileged / developer routes when database is down", async () => {
        const failingDb: PrismaClientLike = {
          userSecurityState: {
            upsert: vi.fn(),
            findUnique: vi.fn().mockRejectedValue(new Error("Database connection lost")),
            deleteMany: vi.fn(),
          },
        };

        // Privileged route with failClosed: true must treat session as revoked
        const result = await isSessionRevokedAsync("dev-user", 100000, {
          db: failingDb,
          failClosed: true,
        });

        expect(result).toBe(true);
      });

      it("uses documented safe fallback to in-memory cache for ordinary learner requests when database is down", async () => {
        const failingDb: PrismaClientLike = {
          userSecurityState: {
            upsert: vi.fn(),
            findUnique: vi.fn().mockRejectedValue(new Error("Transient connection timeout")),
            deleteMany: vi.fn(),
          },
        };

        // Case A: User has NO local revocation recorded -> allowed through (fail-safe for learner read availability)
        const unrevokedResult = await isSessionRevokedAsync("learner-user", 100000, {
          db: failingDb,
          failClosed: false,
        });
        expect(unrevokedResult).toBe(false);

        // Case B: User has a local in-memory revocation recorded -> properly revoked despite DB error
        revokeUserSessions("learner-revoked-local", 200000);
        const revokedResult = await isSessionRevokedAsync("learner-revoked-local", 150000, {
          db: failingDb,
          failClosed: false,
        });
        expect(revokedResult).toBe(true);
      });
    });
  });
});
