/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  searchDeveloperUsers,
  getDeveloperUserDetail,
  getDeveloperUserPackageHistory,
} from "./queries";
import { prisma } from "@/lib/db/client";
import { requireDeveloperActor } from "@/lib/auth";
import { AuthorizationError } from "@/features/authorization/types";
import { UserRole } from "@/generated/prisma/client";

vi.mock("@/lib/auth", () => ({
  requireDeveloperActor: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    userLessonProgress: {
      count: vi.fn(),
    },
    userXpLedger: {
      aggregate: vi.fn(),
    },
    quizAttempt: {
      count: vi.fn(),
    },
    assessmentAttempt: {
      count: vi.fn(),
    },
    consultantProject: {
      count: vi.fn(),
    },
    entitlement: {
      findMany: vi.fn(),
    },
    order: {
      findMany: vi.fn(),
    },
  },
}));

describe("Developer Users Read Models (searchDeveloperUsers / getDeveloperUserDetail / getDeveloperUserPackageHistory)", () => {
  const mockDeveloperActor = {
    id: "dev-1",
    email: "dev@netloka.biz.id",
    name: "Developer One",
    role: UserRole.DEVELOPER,
    authVersion: 1,
    twoFactorEnabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchDeveloperUsers", () => {
    it("throws AuthorizationError when caller is not an authorized developer", async () => {
      vi.mocked(requireDeveloperActor).mockRejectedValueOnce(
        new AuthorizationError("FORBIDDEN", "Developer workspace access required")
      );

      await expect(searchDeveloperUsers({ query: "john" })).rejects.toThrow(
        "Developer workspace access required"
      );
    });

    it("returns empty result if query has less than 2 characters and no role filter is provided", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

      const result = await searchDeveloperUsers({ query: "a" });
      expect(result.users).toEqual([]);
      expect(result.total).toBe(0);
      expect(prisma.user.findMany).not.toHaveBeenCalled();
    });

    it("searches users by name or email with pagination and caps limit at 50", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

      const mockUsers = [
        {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          role: UserRole.LEARNER,
          authVersion: 1,
          twoFactorEnabled: false,
          streakCount: 3,
          headline: "Siswa TKJ",
          lastLoginAt: new Date("2026-09-10"),
          lastActiveAt: new Date("2026-09-12"),
          createdAt: new Date("2026-09-01"),
        },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValueOnce(mockUsers as any);
      vi.mocked(prisma.user.count).mockResolvedValueOnce(1);

      const result = await searchDeveloperUsers({
        query: "john",
        page: 1,
        limit: 100, // Requesting 100, should be capped at 50
      });

      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.limit).toBe(50);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
          skip: 0,
          where: expect.objectContaining({
            OR: [
              { email: { contains: "john", mode: "insensitive" } },
              { name: { contains: "john", mode: "insensitive" } },
            ],
          }),
        })
      );
    });

    it("ensures sensitive fields (passwordHash, twoFactorSecret, etc.) are omitted from search results", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

      vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
        {
          id: "user-2",
          name: "Jane",
          email: "jane@example.com",
          role: UserRole.INTERNAL_LEARNER,
          authVersion: 1,
          twoFactorEnabled: false,
          streakCount: 0,
          headline: null,
          lastLoginAt: null,
          lastActiveAt: null,
          createdAt: new Date(),
        },
      ] as any);
      vi.mocked(prisma.user.count).mockResolvedValueOnce(1);

      const result = await searchDeveloperUsers({ role: UserRole.INTERNAL_LEARNER });
      const serialized = JSON.stringify(result);

      expect(serialized).not.toContain("passwordHash");
      expect(serialized).not.toContain("twoFactorSecret");
      expect(serialized).not.toContain("twoFactorBackupCodes");
      expect(serialized).not.toContain("tokenHash");
    });
  });

  describe("getDeveloperUserDetail", () => {
    it("returns null when user is not found", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      const result = await getDeveloperUserDetail("nonexistent-id");
      expect(result).toBeNull();
    });

    it("returns sanitized user detail with aggregated learning progress", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-10",
        name: "Learner 10",
        email: "l10@example.com",
        role: UserRole.LEARNER,
        authVersion: 1,
        twoFactorEnabled: false,
        streakCount: 5,
        headline: "TKJ Student",
        lastLoginAt: new Date("2026-09-11"),
        lastActiveAt: new Date("2026-09-12"),
        createdAt: new Date("2026-08-15"),
      } as any);

      vi.mocked(prisma.userLessonProgress.count).mockResolvedValueOnce(12);
      vi.mocked(prisma.userXpLedger.aggregate).mockResolvedValueOnce({
        _sum: { amount: 350 },
      } as any);
      vi.mocked(prisma.quizAttempt.count).mockResolvedValueOnce(18);
      vi.mocked(prisma.assessmentAttempt.count).mockResolvedValueOnce(2);
      vi.mocked(prisma.consultantProject.count).mockResolvedValueOnce(1);

      const detail = await getDeveloperUserDetail("user-10");
      expect(detail).not.toBeNull();
      expect(detail?.id).toBe("user-10");
      expect(detail?.progressSummary).toEqual({
        completedLessonsCount: 12,
        totalXp: 350,
        quizAttemptsCount: 18,
        assessmentAttemptsCount: 2,
        consultantProjectsCount: 1,
      });

      const serialized = JSON.stringify(detail);
      expect(serialized).not.toContain("passwordHash");
      expect(serialized).not.toContain("twoFactorSecret");
    });
  });

  describe("getDeveloperUserPackageHistory", () => {
    it("returns entitlements and orders history for user distinguishing active/revoked access", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

      vi.mocked(prisma.entitlement.findMany).mockResolvedValueOnce([
        {
          id: "ent-1",
          courseId: "course-101",
          sourceType: "PURCHASE",
          state: "ACTIVE",
          grantedAt: new Date("2026-09-01"),
          revokedAt: null,
          course: { title: "Switching & VLAN" },
        } as any,
        {
          id: "ent-2",
          courseId: "course-102",
          sourceType: "ADMIN",
          state: "REVOKED",
          grantedAt: new Date("2026-08-15"),
          revokedAt: new Date("2026-09-02"),
          course: { title: "Network Planning" },
        } as any,
      ]);

      vi.mocked(prisma.order.findMany).mockResolvedValueOnce([
        {
          id: "order-1",
          state: "PAID",
          packageId: "pkg-1",
          totalAmountIdr: 150000,
          createdAt: new Date("2026-09-01"),
          paidAt: new Date("2026-09-01"),
          package: { title: "Core Networking Bundle" },
        } as any,
      ]);

      const history = await getDeveloperUserPackageHistory("user-10");
      expect(history).not.toBeNull();
      expect(history?.entitlements).toHaveLength(2);
      expect(history?.entitlements[0].courseTitle).toBe("Switching & VLAN");
      expect(history?.entitlements[0].state).toBe("ACTIVE");
      expect(history?.entitlements[1].state).toBe("REVOKED");
      expect(history?.orders).toHaveLength(1);
      expect(history?.orders[0].packageTitle).toBe("Core Networking Bundle");
      expect(history?.orders[0].state).toBe("PAID");
    });
  });
});
