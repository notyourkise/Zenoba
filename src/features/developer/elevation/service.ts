import crypto from "crypto";
import { prisma } from "@/lib/db/client";
import { verifyPassword } from "@/features/auth/password";
import { verifyTotpCode, verifyAndConsumeBackupCode } from "@/features/auth/totp";
import { recordSecurityEvent } from "@/features/security/events";

export const ELEVATION_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const ELEVATION_COOKIE_NAME = "zenoba_dev_elevation";

export type ElevationErrorCode =
  | "FORBIDDEN"
  | "TWO_FACTOR_REQUIRED"
  | "INVALID_ELEVATION"
  | "ELEVATION_REQUIRED"
  | "ELEVATION_REVOKED"
  | "ELEVATION_EXPIRED"
  | "ELEVATION_STALE";

export class ElevationError extends Error {
  readonly code: ElevationErrorCode;
  readonly status: number;

  constructor(code: ElevationErrorCode, message: string, status = 400) {
    super(message);
    this.name = "ElevationError";
    this.code = code;
    this.status = status;
  }
}

export interface CreateElevationInput {
  userId: string;
  password?: string;
  code?: string;
  ipAddress?: string;
  userAgent?: string;
}

export function hashElevationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashIpAddress(ip?: string): string | null {
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex");
}

/**
 * Creates an elevated developer session with 10-minute expiry upon verified password and 2FA.
 */
export async function createDeveloperElevation(input: CreateElevationInput) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
  });

  if (!user || user.role !== "DEVELOPER") {
    throw new ElevationError("FORBIDDEN", "Only developer accounts can be elevated", 403);
  }

  if (!user.twoFactorEnabled) {
    throw new ElevationError("TWO_FACTOR_REQUIRED", "Developer accounts must have two-factor authentication enabled", 403);
  }

  if (!user.passwordHash || !input.password) {
    await recordSecurityEvent({
      userId: user.id,
      type: "AUTH_ELEVATION_FAILED",
      severity: "WARN",
      metadata: { reason: "missing_password" },
    });
    throw new ElevationError("INVALID_ELEVATION", "Invalid password or two-factor code", 401);
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    await recordSecurityEvent({
      userId: user.id,
      type: "AUTH_ELEVATION_FAILED",
      severity: "WARN",
      metadata: { reason: "invalid_password" },
    });
    throw new ElevationError("INVALID_ELEVATION", "Invalid password or two-factor code", 401);
  }

  const rawCode = input.code?.trim();
  if (!rawCode) {
    await recordSecurityEvent({
      userId: user.id,
      type: "AUTH_ELEVATION_FAILED",
      severity: "WARN",
      metadata: { reason: "missing_code" },
    });
    throw new ElevationError("INVALID_ELEVATION", "Invalid password or two-factor code", 401);
  }

  let isCodeValid = false;
  if (user.twoFactorSecret && verifyTotpCode(user.twoFactorSecret, rawCode)) {
    isCodeValid = true;
  } else if (user.twoFactorBackupCodes) {
    try {
      const stored = JSON.parse(user.twoFactorBackupCodes);
      if (Array.isArray(stored)) {
        const consumption = verifyAndConsumeBackupCode(rawCode, stored);
        if (consumption.valid) {
          isCodeValid = true;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              twoFactorBackupCodes: JSON.stringify(consumption.remainingHashedCodes),
            },
          });
        }
      }
    } catch {
      // Ignore JSON parse error
    }
  }

  if (!isCodeValid) {
    await recordSecurityEvent({
      userId: user.id,
      type: "AUTH_ELEVATION_FAILED",
      severity: "WARN",
      metadata: { reason: "invalid_2fa_code" },
    });
    throw new ElevationError("INVALID_ELEVATION", "Invalid password or two-factor code", 401);
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashElevationToken(rawToken);
  const ipHash = hashIpAddress(input.ipAddress);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ELEVATION_TTL_MS);

  const session = await prisma.developerElevationSession.create({
    data: {
      userId: user.id,
      tokenHash,
      authVersion: user.authVersion,
      issuedAt: now,
      expiresAt,
      ipHash,
      userAgent: input.userAgent ?? null,
    },
  });

  await recordSecurityEvent({
    userId: user.id,
    type: "AUTH_ELEVATION_SUCCESS",
    severity: "INFO",
    metadata: { sessionId: session.id },
  });

  return {
    rawToken,
    expiresAt,
    session,
  };
}

/**
 * Validates that an elevated developer session token is active, non-revoked, and matches current auth state.
 */
export async function requireElevatedDeveloperSession(rawToken: string) {
  if (!rawToken || typeof rawToken !== "string" || !rawToken.trim()) {
    throw new ElevationError("ELEVATION_REQUIRED", "Elevation session required", 401);
  }

  const tokenHash = hashElevationToken(rawToken.trim());
  const session = await prisma.developerElevationSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) {
    throw new ElevationError("ELEVATION_REQUIRED", "Elevation session required or invalid", 401);
  }

  if (session.revokedAt) {
    throw new ElevationError("ELEVATION_REVOKED", "Elevation session has been revoked", 401);
  }

  const now = Date.now();
  if (now > session.expiresAt.getTime()) {
    throw new ElevationError("ELEVATION_EXPIRED", "Elevation session has expired", 401);
  }

  if (session.user.role !== "DEVELOPER") {
    throw new ElevationError("FORBIDDEN", "Developer privileges required", 403);
  }

  if (session.authVersion !== session.user.authVersion) {
    throw new ElevationError("ELEVATION_STALE", "Authentication state changed; re-elevation required", 401);
  }

  await prisma.developerElevationSession.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    session,
    user: session.user,
  };
}

/**
 * Revokes an active developer elevation session.
 */
export async function revokeDeveloperElevation(rawToken?: string): Promise<boolean> {
  if (!rawToken || typeof rawToken !== "string") {
    return false;
  }

  const tokenHash = hashElevationToken(rawToken.trim());
  const existing = await prisma.developerElevationSession.findUnique({
    where: { tokenHash },
  });

  if (!existing || existing.revokedAt) {
    return false;
  }

  await prisma.developerElevationSession.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });

  return true;
}

/**
 * Checks the status and remaining time of a developer elevation session.
 */
export async function getDeveloperElevationStatus(rawToken?: string) {
  if (!rawToken || typeof rawToken !== "string") {
    return { isElevated: false, remainingSeconds: 0, expiresAt: null };
  }

  const tokenHash = hashElevationToken(rawToken.trim());
  const session = await prisma.developerElevationSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !session ||
    session.revokedAt ||
    session.user.role !== "DEVELOPER" ||
    session.authVersion !== session.user.authVersion
  ) {
    return { isElevated: false, remainingSeconds: 0, expiresAt: null };
  }

  const remainingMs = session.expiresAt.getTime() - Date.now();
  if (remainingMs <= 0) {
    return { isElevated: false, remainingSeconds: 0, expiresAt: null };
  }

  return {
    isElevated: true,
    remainingSeconds: Math.floor(remainingMs / 1000),
    expiresAt: session.expiresAt.toISOString(),
  };
}
