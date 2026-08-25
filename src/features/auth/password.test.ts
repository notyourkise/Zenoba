import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("Password utility", () => {
  it("hashes a password and produces 3-part format", async () => {
    const hash = await hashPassword("P@ssword123");
    const parts = hash.split(":");
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe("100000");
    expect(parts[1]).toHaveLength(32); // 16 bytes hex
    expect(parts[2]).toHaveLength(128); // 64 bytes hex
  });

  it("produces different hashes for the same password due to random salt", async () => {
    const hash1 = await hashPassword("Secret123!");
    const hash2 = await hashPassword("Secret123!");
    expect(hash1).not.toBe(hash2);
  });

  it("correctly verifies matching password", async () => {
    const password = "mySecretPassword#99";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await hashPassword("CorrectPassword");
    const isValid = await verifyPassword("WrongPassword", hash);
    expect(isValid).toBe(false);
  });

  it("rejects invalid or malformed hash safely", async () => {
    expect(await verifyPassword("test", "")).toBe(false);
    expect(await verifyPassword("test", "invalid-hash-string")).toBe(false);
    expect(await verifyPassword("test", "100:invalid:too:many:parts")).toBe(false);
    expect(await verifyPassword("test", "NaN:salt:hash")).toBe(false);
  });

  it("throws on empty password during hashing", async () => {
    await expect(hashPassword("")).rejects.toThrow("Password must be a non-empty string");
  });
});
