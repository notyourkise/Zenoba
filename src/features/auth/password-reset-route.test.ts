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

vi.mock("@/features/auth/password-reset", () => ({
  createPasswordResetToken: vi.fn(),
  consumePasswordResetToken: vi.fn(),
  invalidatePasswordResetToken: vi.fn(),
}));

vi.mock("@/features/auth/email/password-reset-email", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

const genericMessage =
  "If an account exists for that email, a password reset link has been sent.";

function postJson(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.APP_URL = "https://netloka.biz.id";
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
      resetUrl: "https://netloka.biz.id/reset-password?token=raw-token",
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
});

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => vi.clearAllMocks());

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
});
