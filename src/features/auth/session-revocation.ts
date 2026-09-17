/**
 * Shared persistent session revocation strategy (TD-08 / Task 40.1).
 * When a user changes or resets their password, or developer elevation steps down,
 * any previously issued JWT session tokens (where issuedAt < validAfter)
 * are invalidated across all application instances and server restarts.
 */

// In-memory fast cache of userId -> revocationTimestamp (ms)
const revokedSessionsStore = new Map<string, number>();

let defaultPrismaClient: PrismaClientLike | null = null;

/**
 * Registers the server-side Prisma client for persistent session operations.
 * Allows session-revocation module to be safely imported in Edge runtime/middleware
 * without pulling the database client into the Edge bundle.
 */
export function setSessionRevocationPrismaClient(client: PrismaClientLike | null): void {
  defaultPrismaClient = client;
}

export function getSessionRevocationPrismaClient(): PrismaClientLike | null {
  return defaultPrismaClient;
}

// Retention window: 30 days (standard NextAuth session maxAge)
export const MAX_REVOCATION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export interface UserSecurityStateRecord {
  userId: string;
  validAfter: Date;
  updatedAt?: Date;
}

export interface UserSecurityStateUpsertArgs {
  where: { userId: string };
  update: { validAfter: Date };
  create: { userId: string; validAfter: Date };
}

export interface UserSecurityStateFindUniqueArgs {
  where: { userId: string };
  select?: { validAfter: boolean };
}

export interface UserSecurityStateDeleteManyArgs {
  where: {
    validAfter: {
      lt: Date;
    };
  };
}

export type PrismaClientLike = {
  userSecurityState: {
    upsert: (args: UserSecurityStateUpsertArgs) => Promise<UserSecurityStateRecord>;
    findUnique: (args: UserSecurityStateFindUniqueArgs) => Promise<{ validAfter: Date } | null>;
    deleteMany: (args: UserSecurityStateDeleteManyArgs) => Promise<{ count: number }>;
  };
};

export interface SessionRevocationOptions {
  db?: PrismaClientLike;
  failClosed?: boolean;
}

/**
 * Revokes all active sessions for a user issued before `revokedAt`.
 * Updates both the process in-memory cache and persistent PostgreSQL `user_security_states`.
 */
export async function revokeUserSessions(
  userId: string,
  revokedAt: Date | number = Date.now(),
  db?: PrismaClientLike,
): Promise<void> {
  const revokedDate = revokedAt instanceof Date ? revokedAt : new Date(revokedAt);
  const timestampMs = revokedDate.getTime();

  // 1. Process-local in-memory cache update
  revokedSessionsStore.set(userId, timestampMs);

  // 2. Shared PostgreSQL persistent update
  const client = db ?? defaultPrismaClient;
  if (client && client.userSecurityState) {
    await client.userSecurityState.upsert({
      where: { userId },
      update: { validAfter: revokedDate },
      create: { userId, validAfter: revokedDate },
    });
  }
}

/**
 * Checks synchronously if a session is revoked using the fast local in-memory cache.
 * Kept for Edge middleware and synchronous callers.
 */
export function isSessionRevoked(
  userId: string,
  tokenIssuedAtMs?: number,
): boolean {
  const revokedAt = revokedSessionsStore.get(userId);
  if (!revokedAt) {
    return false;
  }

  // If the token does not contain an issued-at timestamp, treat as revoked for safety
  if (tokenIssuedAtMs === undefined || tokenIssuedAtMs === null) {
    return true;
  }

  // If token was issued before the revocation timestamp, it is invalidated
  return tokenIssuedAtMs < revokedAt;
}

/**
 * Asynchronously checks if a session is revoked against database-authoritative `UserSecurityState`.
 * Automatically updates local in-memory cache from database findings.
 *
 * Resiliency policy:
 * - Privileged / developer routes (`failClosed: true`): fails closed (returns true) if DB is down.
 * - Ordinary learner routes: falls back safely to in-memory cache to preserve read availability.
 */
export async function isSessionRevokedAsync(
  userId: string,
  tokenIssuedAtMs?: number,
  options?: SessionRevocationOptions,
): Promise<boolean> {
  // 1. Check local fast-path in-memory cache first
  const localRevocation = revokedSessionsStore.get(userId);
  if (localRevocation !== undefined) {
    if (tokenIssuedAtMs === undefined || tokenIssuedAtMs === null) {
      return true;
    }
    if (tokenIssuedAtMs < localRevocation) {
      return true;
    }
  }

  // 2. Query database-authoritative UserSecurityState
  const client = options?.db ?? defaultPrismaClient;
  try {
    if (client && client.userSecurityState) {
      const securityState = await client.userSecurityState.findUnique({
        where: { userId },
      });

      if (securityState) {
        const validAfterMs =
          securityState.validAfter instanceof Date
            ? securityState.validAfter.getTime()
            : new Date(securityState.validAfter).getTime();

        // Populate local cache from DB record
        revokedSessionsStore.set(userId, validAfterMs);

        // If a revocation record exists and token has no issued-at timestamp, treat as revoked
        if (tokenIssuedAtMs === undefined || tokenIssuedAtMs === null) {
          return true;
        }

        if (tokenIssuedAtMs < validAfterMs) {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    // 3. Database failure handling
    if (options?.failClosed) {
      console.error(
        `[SessionRevocation] Fail-closed: database query failed for user ${userId}:`,
        error,
      );
      return true;
    }

    // Documented safe behavior for ordinary learner requests
    console.warn(
      `[SessionRevocation] Fail-safe fallback to memory cache for user ${userId}:`,
      error,
    );
    return isSessionRevoked(userId, tokenIssuedAtMs);
  }
}

/**
 * Cleans up stale revocation records older than session maxAge (30 days)
 * from both local memory and PostgreSQL `user_security_states`.
 */
export async function pruneRevokedSessions(
  now: number = Date.now(),
  db?: PrismaClientLike,
): Promise<void> {
  // 1. Clean local in-memory map
  for (const [userId, revokedAt] of revokedSessionsStore.entries()) {
    if (now - revokedAt > MAX_REVOCATION_RETENTION_MS) {
      revokedSessionsStore.delete(userId);
    }
  }

  // 2. Prune persistent PostgreSQL records older than 30 days
  const client = db ?? defaultPrismaClient;
  if (client && client.userSecurityState) {
    const cutoffDate = new Date(now - MAX_REVOCATION_RETENTION_MS);
    await client.userSecurityState.deleteMany({
      where: {
        validAfter: {
          lt: cutoffDate,
        },
      },
    });
  }
}

/**
 * Clears all local in-memory revocation records. Primarily used for unit testing.
 */
export function clearRevokedSessions(): void {
  revokedSessionsStore.clear();
}
