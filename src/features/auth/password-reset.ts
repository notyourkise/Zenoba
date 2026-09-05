import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db/client";
import { hashPassword } from "@/features/auth/password";
import { revokeUserSessions } from "@/features/auth/session-revocation";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

export function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function createPasswordResetToken(
  userId: string,
  now = new Date(),
): Promise<string> {
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(now.getTime() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.upsert({
    where: { userId },
    create: { userId, tokenHash, expiresAt },
    update: { tokenHash, expiresAt },
  });

  return rawToken;
}

export async function invalidatePasswordResetToken(rawToken: string) {
  await prisma.passwordResetToken.deleteMany({
    where: { tokenHash: hashResetToken(rawToken) },
  });
}

export async function consumePasswordResetToken(
  rawToken: string,
  newPassword: string,
  now = new Date(),
): Promise<"updated" | "invalid"> {
  const tokenHash = hashResetToken(rawToken);
  const passwordHash = await hashPassword(newPassword);

  return prisma.$transaction(async (tx) => {
    const token = await tx.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, expiresAt: true },
    });

    if (!token) {
      return "invalid";
    }

    if (token.expiresAt <= now) {
      await tx.passwordResetToken.deleteMany({ where: { id: token.id, tokenHash } });
      return "invalid";
    }

    const consumed = await tx.passwordResetToken.deleteMany({
      where: { id: token.id, tokenHash, expiresAt: { gt: now } },
    });

    if (consumed.count !== 1) {
      return "invalid";
    }

    await tx.user.update({
      where: { id: token.userId },
      data: { passwordHash },
    });

    revokeUserSessions(token.userId);

    return "updated";
  });
}
