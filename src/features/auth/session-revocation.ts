/**
 * In-memory session revocation registry.
 * When a user changes or resets their password, any previously issued
 * JWT session tokens (where issuedAt < revokedAt) are immediately invalidated.
 */

// Map of userId -> revocationTimestamp (ms)
const revokedSessionsStore = new Map<string, number>();

// Retention window: 30 days (standard NextAuth session maxAge)
const MAX_REVOCATION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Revokes all active sessions for a user issued before `revokedAt`.
 */
export function revokeUserSessions(userId: string, revokedAt = Date.now()): void {
  revokedSessionsStore.set(userId, revokedAt);
}

/**
 * Checks if a session for a given user has been revoked.
 *
 * @param userId The ID of the user
 * @param tokenIssuedAtMs The timestamp (ms) when the session/token was issued (`token.iat * 1000`)
 * @returns true if the session is revoked; false if valid
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

  // If token was issued before the password change/revocation, it is invalidated
  return tokenIssuedAtMs < revokedAt;
}

/**
 * Cleans up stale revocation records older than session maxAge.
 */
export function pruneRevokedSessions(now = Date.now()): void {
  for (const [userId, revokedAt] of revokedSessionsStore.entries()) {
    if (now - revokedAt > MAX_REVOCATION_RETENTION_MS) {
      revokedSessionsStore.delete(userId);
    }
  }
}

/**
 * Clears all revocation records. Primarily used for unit testing.
 */
export function clearRevokedSessions(): void {
  revokedSessionsStore.clear();
}
