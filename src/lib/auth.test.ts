/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCurrentUser, currentUser, isAuthenticated } from "./auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/client";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/features/auth/auth", () => ({
  authOptions: {},
}));

describe("auth helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentUser", () => {
    it("returns null when session does not exist", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const user = await getCurrentUser();
      expect(user).toBeNull();
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("fetches fresh user data from database when session has user id", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "user-123",
          name: "Stale Name",
          email: "learner@zenoba.tech",
        },
      } as any);

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-123",
        name: "Fresh Name from DB",
        email: "learner@zenoba.tech",
        role: "LEARNER",
        image: "https://avatar.png",
        headline: "Infrastructure Enthusiast",
        streakCount: 7,
        lastStreakDate: "2026-09-05",
      } as any);

      const user = await getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.name).toBe("Fresh Name from DB");
      expect(user?.headline).toBe("Infrastructure Enthusiast");
      expect(user?.streakCount).toBe(7);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          authVersion: true,
          image: true,
          headline: true,
          streakCount: true,
          lastStreakDate: true,
          securityState: {
            select: {
              validAfter: true,
            },
          },
        },
      });
    });

    it("invalidates session if token was issued prior to securityState validAfter", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "user-123",
          name: "Old Session",
          issuedAtMs: 100000,
        },
      } as any);

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-123",
        name: "Old Session",
        email: "user@example.com",
        role: "LEARNER",
        authVersion: 1,
        image: null,
        headline: null,
        streakCount: 1,
        lastStreakDate: null,
        securityState: {
          validAfter: new Date(150000), // revoked after token issuance
        },
      } as any);

      const user = await getCurrentUser();
      expect(user).toBeNull();
    });

    it("falls back to session.user if database query fails for learner", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "user-123",
          name: "Session Fallback Name",
          role: "LEARNER",
        },
      } as any);

      vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(new Error("Database disconnected"));

      const user = await getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.name).toBe("Session Fallback Name");
    });

    it("fails closed (returns null) if database query fails for developer", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: {
          id: "dev-123",
          name: "Dev User",
          role: "DEVELOPER",
        },
      } as any);

      vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(new Error("Database disconnected"));

      const user = await getCurrentUser();
      expect(user).toBeNull();
    });

    it("aliases currentUser to getCurrentUser", () => {
      expect(currentUser).toBe(getCurrentUser);
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when session has user", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user-1" },
      } as any);

      const authed = await isAuthenticated();
      expect(authed).toBe(true);
    });

    it("returns false when session has no user", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const authed = await isAuthenticated();
      expect(authed).toBe(false);
    });
  });
});
