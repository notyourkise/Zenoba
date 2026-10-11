/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET as getSecurity } from "./route";
import { POST as postTwoFactor } from "./2fa/route";
import { DELETE as deleteGoogle } from "./google/route";
import { generateTotpToken } from "@/features/auth/totp";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    account: {
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/password", () => ({
  verifyPassword: vi.fn().mockImplementation((password) => Promise.resolve(password === "valid-password")),
}));

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

describe("User Security API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/user/security", () => {
    it("returns 401 if user is not authenticated", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(null as any);
      const response = await getSecurity();
      expect(response.status).toBe(401);
    });

    it("returns security details for authenticated user", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-123" } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
        email: "learner@zenoba.tech",
        passwordHash: "hashed-pw",
        twoFactorEnabled: true,
        twoFactorBackupCodes: JSON.stringify(["hash1", "hash2"]),
        accounts: [{ provider: "google", providerAccountId: "google-123" }],
      } as any);

      const response = await getSecurity();
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.email).toBe("learner@zenoba.tech");
      expect(data.hasPassword).toBe(true);
      expect(data.isGoogleLinked).toBe(true);
      expect(data.twoFactorEnabled).toBe(true);
      expect(data.backupCodesCount).toBe(2);
    });
  });

  describe("POST /api/user/security/2fa", () => {
    it("handles setup action by generating secret and qr code", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-123" } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
        email: "learner@zenoba.tech",
      } as any);
      vi.mocked(prisma.user.update).mockResolvedValue({} as any);

      const req = new Request("http://localhost/api/user/security/2fa", {
        method: "POST",
        body: JSON.stringify({ action: "setup" }),
      });

      const res = await postTwoFactor(req);
      expect(res.status).toBe(200);
      const body = await res.json();

      expect(body.secret).toBeDefined();
      expect(body.uri).toContain("otpauth://totp/Zenoba:learner%40zenoba.tech");
      expect(body.qrCodeDataUrl).toMatch(/^data:image\/png;base64,/);
    });

    it("handles verify action with valid TOTP code", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-123" } as any);
      const mockSecret = "JBSWY3DPEHPK3PXP";
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
        email: "learner@zenoba.tech",
        twoFactorSecret: mockSecret,
      } as any);
      vi.mocked(prisma.user.update).mockResolvedValue({} as any);

      const validToken = generateTotpToken(mockSecret);

      const req = new Request("http://localhost/api/user/security/2fa", {
        method: "POST",
        body: JSON.stringify({ action: "verify", code: validToken }),
      });

      const res = await postTwoFactor(req);
      expect(res.status).toBe(200);
      const body = await res.json();

      expect(body.success).toBe(true);
      expect(body.backupCodes).toHaveLength(8);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            twoFactorEnabled: true,
          }),
        }),
      );
    });

    it("rejects verify action with invalid code", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-123" } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
        twoFactorSecret: "JBSWY3DPEHPK3PXP",
      } as any);

      const req = new Request("http://localhost/api/user/security/2fa", {
        method: "POST",
        body: JSON.stringify({ action: "verify", code: "000000" }),
      });

      const res = await postTwoFactor(req);
      expect(res.status).toBe(400);
    });

    it("handles disable action with valid password", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-123" } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
        passwordHash: "valid-hash",
      } as any);
      vi.mocked(prisma.user.update).mockResolvedValue({} as any);

      const req = new Request("http://localhost/api/user/security/2fa", {
        method: "POST",
        body: JSON.stringify({ action: "disable", password: "valid-password" }),
      });

      const res = await postTwoFactor(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            twoFactorEnabled: false,
            twoFactorSecret: null,
            twoFactorBackupCodes: null,
          }),
        }),
      );
    });
  });

  describe("DELETE /api/user/security/google", () => {
    it("prevents disconnecting if user does not have a local password", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-123" } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
        passwordHash: null,
        accounts: [{ provider: "google", providerAccountId: "google-123" }],
      } as any);

      const res = await deleteGoogle();
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("kata sandi");
    });

    it("successfully disconnects Google if user has password", async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-123" } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-123",
        passwordHash: "existing-hash",
        accounts: [{ provider: "google", providerAccountId: "google-123" }],
      } as any);
      vi.mocked(prisma.account.deleteMany).mockResolvedValue({ count: 1 } as any);

      const res = await deleteGoogle();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(prisma.account.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
          provider: "google",
        },
      });
    });
  });
});
