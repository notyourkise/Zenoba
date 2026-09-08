import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as changePassword } from "./route";
import { prisma } from "@/lib/db/client";
import * as authLib from "@/lib/auth";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

describe("POST /api/user/password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/user/password", {
      method: "POST",
      body: JSON.stringify({
        newPassword: "NewSecurePassword123!",
        confirmPassword: "NewSecurePassword123!",
      }),
    });

    const res = await changePassword(request);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 when passwords do not match", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-123",
      email: "user@example.com",
    });

    const request = new Request("http://localhost:3000/api/user/password", {
      method: "POST",
      body: JSON.stringify({
        newPassword: "NewSecurePassword123!",
        confirmPassword: "DifferentPassword123!",
      }),
    });

    const res = await changePassword(request);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/tidak cocok/i);
  });

  it("returns 400 when new password is too short", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-123",
      email: "user@example.com",
    });

    const request = new Request("http://localhost:3000/api/user/password", {
      method: "POST",
      body: JSON.stringify({
        newPassword: "short",
        confirmPassword: "short",
      }),
    });

    const res = await changePassword(request);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/minimal 8 karakter/i);
  });

  it("successfully updates password for authenticated user without requiring current password", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-123",
      email: "user@example.com",
    });
    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      id: "user-123",
      name: "Test User",
      email: "user@example.com",
      passwordHash: "new_hash",
      role: "LEARNER",
      authVersion: 1,
      lastLoginAt: null,
      lastActiveAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: null,
      image: null,
      headline: null,
      streakCount: 1,
      lastStreakDate: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    });

    const request = new Request("http://localhost:3000/api/user/password", {
      method: "POST",
      body: JSON.stringify({
        newPassword: "BrandNewPassword123!",
        confirmPassword: "BrandNewPassword123!",
      }),
    });

    const res = await changePassword(request);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toMatch(/berhasil diperbarui/i);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-123" },
        data: expect.objectContaining({
          passwordHash: expect.stringMatching(/^\d+:[a-f0-9]+:[a-f0-9]+$/),
        }),
      }),
    );
  });
});
