import { describe, expect, it } from "vitest";
import {
  base32Decode,
  base32Encode,
  generateBackupCodes,
  generateTotpSecret,
  generateTotpToken,
  generateTotpUri,
  hashBackupCode,
  verifyAndConsumeBackupCode,
  verifyTotpCode,
} from "./totp";

describe("TOTP Authentication Engine (RFC 6238)", () => {
  it("encodes and decodes base32 symmetrically", () => {
    const original = Buffer.from("Zenoba2FASecretKey123");
    const encoded = base32Encode(original);
    const decoded = base32Decode(encoded);
    expect(decoded.toString()).toBe("Zenoba2FASecretKey123");
  });

  it("generates valid base32 secrets of expected length", () => {
    const secret = generateTotpSecret(20);
    expect(secret).toMatch(/^[A-Z2-7]+$/);
    expect(secret.length).toBe(32);
  });

  it("generates 6-digit TOTP tokens deterministically for the same time step", () => {
    const secret = "JBSWY3DPEHPK3PXP"; // Base32 RFC test secret
    const time = 1700000000000;
    const token1 = generateTotpToken(secret, time);
    const token2 = generateTotpToken(secret, time);

    expect(token1).toHaveLength(6);
    expect(token1).toMatch(/^\d{6}$/);
    expect(token1).toBe(token2);
  });

  it("verifies valid tokens within the ±1 step window", () => {
    const secret = generateTotpSecret();
    const now = Date.now();
    const currentToken = generateTotpToken(secret, now);
    const pastToken = generateTotpToken(secret, now - 30000); // 30s ago
    const futureToken = generateTotpToken(secret, now + 30000); // 30s in future
    const tooOldToken = generateTotpToken(secret, now - 90000); // 90s ago

    expect(verifyTotpCode(secret, currentToken, 1, now)).toBe(true);
    expect(verifyTotpCode(secret, pastToken, 1, now)).toBe(true);
    expect(verifyTotpCode(secret, futureToken, 1, now)).toBe(true);
    expect(verifyTotpCode(secret, tooOldToken, 1, now)).toBe(false);
    expect(verifyTotpCode(secret, "000000", 1, now)).toBe(false);
    expect(verifyTotpCode(secret, "invalid", 1, now)).toBe(false);
  });

  it("generates compliant otpauth URI", () => {
    const uri = generateTotpUri("learner@zenoba.tech", "JBSWY3DPEHPK3PXP");
    expect(uri).toContain("otpauth://totp/Zenoba:learner%40zenoba.tech");
    expect(uri).toContain("secret=JBSWY3DPEHPK3PXP");
    expect(uri).toContain("issuer=Zenoba");
  });

  it("generates, hashes, and consumes one-time backup recovery codes", () => {
    const codes = generateBackupCodes(8);
    expect(codes).toHaveLength(8);
    expect(codes[0]).toMatch(/^[a-f0-9]{4}-[a-f0-9]{4}$/);

    const hashedCodes = codes.map(hashBackupCode);

    // Consume the first code
    const result1 = verifyAndConsumeBackupCode(codes[0], hashedCodes);
    expect(result1.valid).toBe(true);
    expect(result1.remainingHashedCodes).toHaveLength(7);

    // Cannot consume the same code again
    const result2 = verifyAndConsumeBackupCode(codes[0], result1.remainingHashedCodes);
    expect(result2.valid).toBe(false);

    // Invalid code returns valid: false
    const result3 = verifyAndConsumeBackupCode("wrong-code", result1.remainingHashedCodes);
    expect(result3.valid).toBe(false);
  });
});
