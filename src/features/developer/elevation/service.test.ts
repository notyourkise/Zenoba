/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db/client";
import {
  createDeveloperElevation,
  requireElevatedDeveloperSession,
  revokeDeveloperElevation,
  getDeveloperElevationStatus,
  ELEVATION_TTL_MS,
} from "./service";
import { verifyPassword } from "@/features/auth/password";
import { verifyTotpCode, verifyAndConsumeBackupCode } from "@/features/auth/totp";
import { recordSecurityEvent } from "@/features/security/events";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    developerElevationSession: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/password", () => ({
  verifyPassword: vi.fn(),
}));

vi.mock("@/features/auth/totp", () => ({
  verifyTotpCode: vi.fn(),
  verifyAndConsumeBackupCode: vi.fn(),
}));

vi.mock("@/features/security/events", () => ({
  recordSecurityEvent: vi.fn().mockResolvedValue(null),
}));

describe("Developer Elevation Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defines ELEVATION_TTL_MS as exactly 10 minutes", () => {
    expect(ELEVATION_TTL_MS).toBe(10 * 60 * 1000);
  });

  describe("createDeveloperElevation", () => {
    const mockDeveloper = {
      id: "dev-1",
      email: "dev@netloka.biz.id",
      passwordHash: "valid-hash",
      role: "DEVELOPER",
      authVersion: 1,
      twoFactorEnabled: true,
      twoFactorSecret: "SECRETKEY",
      twoFactorBackupCodes: null,
    };

    it("rejects non-developer accounts", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        ...mockDeveloper,
        role: "LEARNER",
      } as any);

      await expect(
        createDeveloperElevation({
          userId: "dev-1",
          password: "password123",
          code: "123456",
        }),
      ).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });

    it("rejects when twoFactorEnabled is false", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        ...mockDeveloper,
        twoFactorEnabled: false,
      } as any);

      await expect(
        createDeveloperElevation({
          userId: "dev-1",
          password: "password123",
          code: "123456",
        }),
      ).rejects.toMatchObject({
        code: "TWO_FACTOR_REQUIRED",
      });
    });

    it("rejects incorrect password and records security event", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockDeveloper as any);
      vi.mocked(verifyPassword).mockResolvedValueOnce(false);

      await expect(
        createDeveloperElevation({
          userId: "dev-1",
          password: "wrong-password",
          code: "123456",
        }),
      ).rejects.toMatchObject({
        code: "INVALID_ELEVATION",
      });

      expect(recordSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "dev-1",
          type: "AUTH_ELEVATION_FAILED",
          severity: "WARN",
        }),
      );
    });

    it("rejects invalid TOTP code and records security event", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockDeveloper as any);
      vi.mocked(verifyPassword).mockResolvedValueOnce(true);
      vi.mocked(verifyTotpCode).mockReturnValueOnce(false);

      await expect(
        createDeveloperElevation({
          userId: "dev-1",
          password: "valid-password",
          code: "000000",
        }),
      ).rejects.toMatchObject({
        code: "INVALID_ELEVATION",
      });

      expect(recordSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "dev-1",
          type: "AUTH_ELEVATION_FAILED",
          severity: "WARN",
        }),
      );
    });

    it("creates elevation session with 10-minute expiry on valid password and TOTP", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockDeveloper as any);
      vi.mocked(verifyPassword).mockResolvedValueOnce(true);
      vi.mocked(verifyTotpCode).mockReturnValueOnce(true);

      const mockSession = {
        id: "elev-1",
        userId: "dev-1",
        tokenHash: "hashed-token",
        authVersion: 1,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + ELEVATION_TTL_MS),
        revokedAt: null,
      };
      vi.mocked(prisma.developerElevationSession.create).mockResolvedValueOnce(mockSession as any);

      const result = await createDeveloperElevation({
        userId: "dev-1",
        password: "valid-password",
        code: "123456",
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
      });

      expect(result.rawToken).toBeDefined();
      expect(result.rawToken.length).toBe(64); // 32 bytes hex
      expect(result.session.id).toBe("elev-1");
      expect(prisma.developerElevationSession.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "dev-1",
          authVersion: 1,
          userAgent: "Mozilla/5.0",
        }),
      });
      expect(recordSecurityEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "dev-1",
          type: "AUTH_ELEVATION_SUCCESS",
          severity: "INFO",
        }),
      );
    });

    it("allows elevation via valid backup code and consumes it", async () => {
      const devWithBackup = {
        ...mockDeveloper,
        twoFactorSecret: null,
        twoFactorBackupCodes: JSON.stringify(["hashed-backup-1", "hashed-backup-2"]),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(devWithBackup as any);
      vi.mocked(verifyPassword).mockResolvedValueOnce(true);
      vi.mocked(verifyAndConsumeBackupCode).mockReturnValueOnce({
        valid: true,
        remainingHashedCodes: ["hashed-backup-2"],
      });

      vi.mocked(prisma.developerElevationSession.create).mockResolvedValueOnce({
        id: "elev-2",
      } as any);

      const result = await createDeveloperElevation({
        userId: "dev-1",
        password: "valid-password",
        code: "BACKUP-CODE-1",
      });

      expect(result.rawToken).toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "dev-1" },
        data: {
          twoFactorBackupCodes: JSON.stringify(["hashed-backup-2"]),
        },
      });
    });
  });

  describe("requireElevatedDeveloperSession", () => {
    it("throws ELEVATION_REQUIRED when token is missing", async () => {
      await expect(requireElevatedDeveloperSession("")).rejects.toMatchObject({
        code: "ELEVATION_REQUIRED",
      });
    });

    it("throws ELEVATION_REQUIRED when token does not match any session", async () => {
      vi.mocked(prisma.developerElevationSession.findUnique).mockResolvedValueOnce(null);

      await expect(requireElevatedDeveloperSession("unknown-token")).rejects.toMatchObject({
        code: "ELEVATION_REQUIRED",
      });
    });

    it("throws ELEVATION_REVOKED when session was revoked", async () => {
      vi.mocked(prisma.developerElevationSession.findUnique).mockResolvedValueOnce({
        id: "elev-revoked",
        userId: "dev-1",
        authVersion: 1,
        expiresAt: new Date(Date.now() + 60000),
        revokedAt: new Date(),
        user: { id: "dev-1", role: "DEVELOPER", authVersion: 1 },
      } as any);

      await expect(requireElevatedDeveloperSession("revoked-token")).rejects.toMatchObject({
        code: "ELEVATION_REVOKED",
      });
    });

    it("throws ELEVATION_EXPIRED when session has passed expiresAt", async () => {
      vi.mocked(prisma.developerElevationSession.findUnique).mockResolvedValueOnce({
        id: "elev-expired",
        userId: "dev-1",
        authVersion: 1,
        expiresAt: new Date(Date.now() - 5000), // in the past
        revokedAt: null,
        user: { id: "dev-1", role: "DEVELOPER", authVersion: 1 },
      } as any);

      await expect(requireElevatedDeveloperSession("expired-token")).rejects.toMatchObject({
        code: "ELEVATION_EXPIRED",
      });
    });

    it("throws ELEVATION_STALE when user authVersion has incremented", async () => {
      vi.mocked(prisma.developerElevationSession.findUnique).mockResolvedValueOnce({
        id: "elev-stale",
        userId: "dev-1",
        authVersion: 1,
        expiresAt: new Date(Date.now() + 60000),
        revokedAt: null,
        user: { id: "dev-1", role: "DEVELOPER", authVersion: 2 }, // changed!
      } as any);

      await expect(requireElevatedDeveloperSession("stale-token")).rejects.toMatchObject({
        code: "ELEVATION_STALE",
      });
    });

    it("returns session and user on valid elevation", async () => {
      const mockSession = {
        id: "elev-valid",
        userId: "dev-1",
        authVersion: 1,
        expiresAt: new Date(Date.now() + 60000),
        revokedAt: null,
        user: { id: "dev-1", email: "dev@netloka.biz.id", role: "DEVELOPER", authVersion: 1 },
      };

      vi.mocked(prisma.developerElevationSession.findUnique).mockResolvedValueOnce(mockSession as any);
      vi.mocked(prisma.developerElevationSession.update).mockResolvedValueOnce(mockSession as any);

      const result = await requireElevatedDeveloperSession("valid-token");

      expect(result.session.id).toBe("elev-valid");
      expect(result.user.email).toBe("dev@netloka.biz.id");
      expect(prisma.developerElevationSession.update).toHaveBeenCalledWith({
        where: { id: "elev-valid" },
        data: expect.objectContaining({
          lastUsedAt: expect.any(Date),
        }),
      });
    });
  });

  describe("revokeDeveloperElevation", () => {
    it("marks session revokedAt to current time", async () => {
      vi.mocked(prisma.developerElevationSession.findUnique).mockResolvedValueOnce({
        id: "elev-1",
        revokedAt: null,
      } as any);

      const revoked = await revokeDeveloperElevation("valid-token");

      expect(revoked).toBe(true);
      expect(prisma.developerElevationSession.update).toHaveBeenCalledWith({
        where: { tokenHash: expect.any(String) },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe("getDeveloperElevationStatus", () => {
    it("returns isElevated: false when token is absent", async () => {
      const status = await getDeveloperElevationStatus(undefined);
      expect(status.isElevated).toBe(false);
      expect(status.remainingSeconds).toBe(0);
    });

    it("returns isElevated: true and remainingSeconds when valid", async () => {
      const futureExpiry = new Date(Date.now() + 300000); // 5 minutes
      vi.mocked(prisma.developerElevationSession.findUnique).mockResolvedValueOnce({
        id: "elev-active",
        userId: "dev-1",
        authVersion: 1,
        expiresAt: futureExpiry,
        revokedAt: null,
        user: { id: "dev-1", role: "DEVELOPER", authVersion: 1 },
      } as any);

      const status = await getDeveloperElevationStatus("valid-token");

      expect(status.isElevated).toBe(true);
      expect(status.remainingSeconds).toBeGreaterThan(290);
      expect(status.remainingSeconds).toBeLessThanOrEqual(300);
    });
  });
});
