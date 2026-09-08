import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET as getProfile, POST as updateProfile } from "@/app/api/user/profile/route";
import { prisma } from "@/lib/db/client";
import * as authLib from "@/lib/auth";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

describe("Profile API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/user/profile", () => {
    it("returns 401 when user is not authenticated", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

      const res = await getProfile();
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("returns profile data for authenticated user", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-123",
        email: "user@example.com",
        name: "Test User",
      });

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-123",
        email: "user@example.com",
        name: "Test User",
        emailVerified: null,
        image: null,
        role: "LEARNER",
        authVersion: 1,
        lastLoginAt: null,
        lastActiveAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: "hash",
        headline: null,
        streakCount: 1,
        lastStreakDate: null,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
      });

      const res = await getProfile();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.user.id).toBe("user-123");
      expect(data.user.name).toBe("Test User");
    });
  });

  describe("POST /api/user/profile", () => {
    it("returns 401 when unauthorized", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Updated Name" }),
      });

      const res = await updateProfile(req);
      expect(res.status).toBe(401);
    });

    it("validates that name is not empty", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-123",
        email: "user@example.com",
      });

      const req = new Request("http://localhost:3000/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "" }),
      });

      const res = await updateProfile(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe("Name is required");
    });

    it("updates allowed profile fields successfully", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-123",
        email: "user@example.com",
      });

      vi.mocked(prisma.user.update).mockResolvedValueOnce({
        id: "user-123",
        name: "New Display Name",
        email: "user@example.com",
        role: "LEARNER",
        updatedAt: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const req = new Request("http://localhost:3000/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Display Name" }),
      });

      const res = await updateProfile(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe("Profile updated successfully");
      expect(data.user.name).toBe("New Display Name");
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-123" },
          data: { name: "New Display Name" },
        })
      );
    });

    it("updates profile image successfully", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-123",
        email: "user@example.com",
      });

      vi.mocked(prisma.user.update).mockResolvedValueOnce({
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        role: "LEARNER",
        image: "data:image/png;base64,sample",
        updatedAt: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const req = new Request("http://localhost:3000/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "data:image/png;base64,sample" }),
      });

      const res = await updateProfile(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe("Profile updated successfully");
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-123" },
          data: { image: "data:image/png;base64,sample" },
        })
      );
    });

    it("updates headline and streakCount successfully", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-123",
        email: "user@example.com",
      });

      vi.mocked(prisma.user.update).mockResolvedValueOnce({
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        role: "LEARNER",
        image: null,
        headline: "Developer",
        streakCount: 5,
        lastStreakDate: "2026-09-03",
        updatedAt: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const req = new Request("http://localhost:3000/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: "Developer",
          streakCount: 5,
          lastStreakDate: "2026-09-03",
        }),
      });

      const res = await updateProfile(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe("Profile updated successfully");
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user-123" },
          data: {
            headline: "Developer",
            streakCount: 5,
            lastStreakDate: "2026-09-03",
          },
        })
      );
    });
  });
});
