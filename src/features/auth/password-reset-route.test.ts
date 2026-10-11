import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/client";
import {
  createPasswordResetToken,
  consumePasswordResetToken,
  invalidatePasswordResetToken,
} from "@/features/auth/password-reset";
import { sendPasswordResetEmail } from "@/features/auth/email/password-reset-email";
import { POST as forgotPassword } from "@/app/api/auth/forgot-password/route";
import { POST as resetPassword } from "@/app/api/auth/reset-password/route";

vi.mock("@/lib/db/client", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

import { resetRateLimits } from "@/features/auth/rate-limiter";

vi.mock("@/features/auth/password-reset", () => ({
  createPasswordResetToken: vi.fn(),
  consumePasswordResetToken: vi.fn(),
  invalidatePasswordResetToken: vi.fn(),
  hashResetToken: vi.fn(() => "dummy-hash"),
}));

vi.mock("@/features/auth/email/password-reset-email", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

const genericMessage =
  "If an account exists for that email, a password reset link has been sent.";

function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
    process.env.APP_URL = "https://zenoba.tech";
    vi.mocked(invalidatePasswordResetToken).mockResolvedValue(undefined);
  });

  it("rejects malformed email input", async () => {
    const response = await forgotPassword(
      postJson("http://localhost/api/auth/forgot-password", {
        email: "not-an-email",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid email format" });
  });

  it("returns the same generic response for unknown and known accounts", async () => {
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "user-1",
        email: "learner@example.com",
        passwordHash: "stored-hash",
      } as never);
    vi.mocked(createPasswordResetToken).mockResolvedValue("raw-token");

    const unknownResponse = await forgotPassword(
      postJson("http://localhost/api/auth/forgot-password", {
        email: "unknown@example.com",
      }),
    );
    const knownResponse = await forgotPassword(
      postJson("http://localhost/api/auth/forgot-password", {
        email: "Learner@Example.com",
      }),
    );

    expect(unknownResponse.status).toBe(200);
    expect(knownResponse.status).toBe(200);
    expect(await unknownResponse.json()).toEqual({ message: genericMessage });
    const knownBody = await knownResponse.json();
    expect(knownBody).toEqual({ message: genericMessage });
    expect(sendPasswordResetEmail).toHaveBeenCalledWith({
      to: "learner@example.com",
      resetUrl: "https://zenoba.tech/reset-password?token=raw-token",
    });
    expect(JSON.stringify(knownBody)).not.toContain("raw-token");
  });

  it("invalidates a new token when email delivery fails without exposing the failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "learner@example.com",
      passwordHash: "stored-hash",
    } as never);
    vi.mocked(createPasswordResetToken).mockResolvedValue("raw-token");
    vi.mocked(sendPasswordResetEmail).mockRejectedValue(new Error("SMTP unavailable"));

    const response = await forgotPassword(
      postJson("http://localhost/api/auth/forgot-password", {
        email: "learner@example.com",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: genericMessage });
    expect(invalidatePasswordResetToken).toHaveBeenCalledWith("raw-token");
  });

  it("rate limits repeated requests from the same IP (TD-06)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    // Max 5 attempts allowed for IP
    for (let i = 0; i < 5; i++) {
      const res = await forgotPassword(
        postJson("http://localhost/api/auth/forgot-password", {
          email: `user${i}@example.com`,
        }, { "x-forwarded-for": "198.51.100.1" }),
      );
      expect(res.status).toBe(200);
    }

    // 6th attempt from the same IP should be blocked with 429
    const blockedRes = await forgotPassword(
      postJson("http://localhost/api/auth/forgot-password", {
        email: "user6@example.com",
      }, { "x-forwarded-for": "198.51.100.1" }),
    );
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get("Retry-After")).toBeDefined();
    await expect(blockedRes.json()).resolves.toEqual({
      error: "Too many requests. Please try again later.",
    });
  });

  it("rate limits repeated requests for the same email (TD-06)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    // Max 3 attempts allowed for same email across different IPs
    for (let i = 0; i < 3; i++) {
      const res = await forgotPassword(
        postJson("http://localhost/api/auth/forgot-password", {
          email: "target@example.com",
        }, { "x-forwarded-for": `198.51.100.${i + 10}` }),
      );
      expect(res.status).toBe(200);
    }

    // 4th attempt for the same email should be blocked with 429
    const blockedRes = await forgotPassword(
      postJson("http://localhost/api/auth/forgot-password", {
        email: "target@example.com",
      }, { "x-forwarded-for": "198.51.100.99" }),
    );
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get("Retry-After")).toBeDefined();
  });
});

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
  });

  it("rejects passwords shorter than eight characters", async () => {
    const response = await resetPassword(
      postJson("http://localhost/api/auth/reset-password", {
        token: "token",
        password: "short",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Password must be at least 8 characters",
    });
  });

  it("rejects invalid, expired, or previously used tokens", async () => {
    vi.mocked(consumePasswordResetToken).mockResolvedValue("invalid");

    const response = await resetPassword(
      postJson("http://localhost/api/auth/reset-password", {
        token: "invalid-token",
        password: "NewPassword123!",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "This password reset link is invalid or has expired.",
    });
  });

  it("accepts a valid token and new password", async () => {
    vi.mocked(consumePasswordResetToken).mockResolvedValue("updated");

    const response = await resetPassword(
      postJson("http://localhost/api/auth/reset-password", {
        token: "valid-token",
        password: "NewPassword123!",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: "Your password has been reset successfully.",
    });
  });

  it("rate limits repeated reset attempts from the same IP (TD-06)", async () => {
    vi.mocked(consumePasswordResetToken).mockResolvedValue("invalid");

    // Max 10 attempts allowed for IP
    for (let i = 0; i < 10; i++) {
      const res = await resetPassword(
        postJson("http://localhost/api/auth/reset-password", {
          token: `token-${i}`,
          password: "NewPassword123!",
        }, { "x-forwarded-for": "203.0.113.88" }),
      );
      expect(res.status).toBe(400);
    }

    // 11th attempt from the same IP should be blocked with 429
    const blockedRes = await resetPassword(
      postJson("http://localhost/api/auth/reset-password", {
        token: "token-11",
        password: "NewPassword123!",
      }, { "x-forwarded-for": "203.0.113.88" }),
    );
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get("Retry-After")).toBeDefined();
    await expect(blockedRes.json()).resolves.toEqual({
      error: "Too many requests. Please try again later.",
    });
  });
});
