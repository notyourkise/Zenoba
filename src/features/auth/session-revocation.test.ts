import { describe, it, expect, beforeEach } from "vitest";
import {
  revokeUserSessions,
  isSessionRevoked,
  clearRevokedSessions,
  pruneRevokedSessions,
} from "./session-revocation";

describe("Session Revocation Strategy (TD-08)", () => {
  beforeEach(() => {
    clearRevokedSessions();
  });

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
