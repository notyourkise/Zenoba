import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db/client";
import { verifyPassword } from "@/features/auth/password";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  hashResetToken,
} from "@/features/auth/password-reset";

const transactionClient = {
  passwordResetToken: {
    deleteMany: vi.fn(),
    findUnique: vi.fn(),
  },
  user: {
    update: vi.fn(),
  },
};

vi.mock("@/lib/db/client", () => ({
  prisma: {
    $transaction: vi.fn(),
    passwordResetToken: {
      upsert: vi.fn(),
    },
  },
}));

describe("password reset token domain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transactionClient.passwordResetToken.deleteMany.mockResolvedValue({ count: 1 });
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback(transactionClient as never),
    );
  });

  it("persists only a digest and replaces older tokens for the user", async () => {
    const now = new Date("2026-09-02T08:00:00.000Z");

    const rawToken = await createPasswordResetToken("user-1", now);

    expect(rawToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(prisma.passwordResetToken.upsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      create: {
        userId: "user-1",
        tokenHash: hashResetToken(rawToken),
        expiresAt: new Date("2026-09-02T08:30:00.000Z"),
      },
      update: {
        tokenHash: hashResetToken(rawToken),
        expiresAt: new Date("2026-09-02T08:30:00.000Z"),
      },
    });
    expect(hashResetToken(rawToken)).not.toBe(rawToken);
    expect(hashResetToken(rawToken)).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects and deletes an expired token", async () => {
    transactionClient.passwordResetToken.findUnique.mockResolvedValueOnce({
      id: "reset-1",
      userId: "user-1",
      expiresAt: new Date("2026-09-02T07:59:59.000Z"),
    });

    const result = await consumePasswordResetToken(
      "expired-token",
      "NewPassword123!",
      new Date("2026-09-02T08:00:00.000Z"),
    );

    expect(result).toBe("invalid");
    expect(transactionClient.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: { id: "reset-1", tokenHash: hashResetToken("expired-token") },
    });
    expect(transactionClient.user.update).not.toHaveBeenCalled();
  });

  it("updates the password and consumes a valid token only once", async () => {
    transactionClient.passwordResetToken.findUnique
      .mockResolvedValueOnce({
        id: "reset-1",
        userId: "user-1",
        expiresAt: new Date("2026-09-02T08:30:00.000Z"),
      })
      .mockResolvedValueOnce(null);

    const firstResult = await consumePasswordResetToken(
      "single-use-token",
      "NewPassword123!",
      new Date("2026-09-02T08:00:00.000Z"),
    );
    const secondResult = await consumePasswordResetToken(
      "single-use-token",
      "AnotherPassword123!",
      new Date("2026-09-02T08:00:01.000Z"),
    );

    expect(firstResult).toBe("updated");
    expect(secondResult).toBe("invalid");
    const passwordHash = transactionClient.user.update.mock.calls[0]?.[0].data
      .passwordHash as string;
    await expect(verifyPassword("NewPassword123!", passwordHash)).resolves.toBe(
      true,
    );
    expect(transactionClient.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "reset-1",
        tokenHash: hashResetToken("single-use-token"),
        expiresAt: { gt: new Date("2026-09-02T08:00:00.000Z") },
      },
    });
  });

  it("does not update a password when the token was concurrently replaced or consumed", async () => {
    transactionClient.passwordResetToken.findUnique.mockResolvedValueOnce({
      id: "reset-1",
      userId: "user-1",
      expiresAt: new Date("2026-09-02T08:30:00.000Z"),
    });
    transactionClient.passwordResetToken.deleteMany.mockResolvedValueOnce({ count: 0 });

    const result = await consumePasswordResetToken(
      "replaced-token", "NewPassword123!", new Date("2026-09-02T08:00:00.000Z"),
    );

    expect(result).toBe("invalid");
    expect(transactionClient.user.update).not.toHaveBeenCalled();
  });
});
