import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import type { UserRole } from "@/generated/prisma/client";

// Mock read models
vi.mock("@/features/developer/overview/queries", () => ({
  getDeveloperOverview: vi.fn(),
}));

vi.mock("@/features/developer/users/queries", () => ({
  searchDeveloperUsers: vi.fn(),
  getDeveloperUserDetail: vi.fn(),
  getDeveloperUserPackageHistory: vi.fn(),
}));

vi.mock("@/features/developer/curriculum/health", () => ({
  getCurriculumHealth: vi.fn(),
}));

vi.mock("@/features/developer/system/health", () => ({
  getSystemHealth: vi.fn(),
}));

vi.mock("@/features/authorization/guards", () => ({
  requireDeveloperActor: vi.fn(),
  getFreshActor: vi.fn(),
}));

vi.mock("@/features/analytics/activity", () => ({
  touchUserActivity: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learningPath: {
      findMany: vi.fn(),
    },
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  usePathname: () => "/developer",
  useRouter: () => ({ push: vi.fn() }),
}));

import { getDeveloperOverview } from "@/features/developer/overview/queries";
import {
  searchDeveloperUsers,
  getDeveloperUserDetail,
  getDeveloperUserPackageHistory,
} from "@/features/developer/users/queries";
import { getCurriculumHealth } from "@/features/developer/curriculum/health";
import { getSystemHealth } from "@/features/developer/system/health";
import { requireDeveloperActor, getFreshActor } from "@/features/authorization/guards";
import { AuthorizationError, type Actor } from "@/features/authorization/types";
import { touchUserActivity } from "@/features/analytics/activity";
import { prisma } from "@/lib/db/client";

import DeveloperLayout from "./layout";
import DeveloperOverviewPage from "./page";
import DeveloperUsersPage from "./users/page";
import DeveloperUserDetailPage from "./users/[userId]/page";
import DeveloperAccessPage from "./access/page";
import DeveloperCurriculumPage from "./curriculum/page";
import DeveloperSystemPage from "./system/page";
import DeveloperSecurityPage from "./security/page";
import DeveloperAccountPage from "./account/page";

describe("Developer Portal Pages & Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DeveloperLayout", () => {
    it("renders shell when actor is developer", async () => {
      const mockActor: Actor = {
        id: "dev-1",
        email: "dev@netloka.biz.id",
        name: "Dev Anto",
        role: "DEVELOPER" as UserRole,
        authVersion: 1,
        twoFactorEnabled: false,
      };
      vi.mocked(requireDeveloperActor).mockResolvedValue(mockActor);
      vi.mocked(getFreshActor).mockResolvedValue(mockActor);

      const jsx = await DeveloperLayout({ children: <div>Inner Content</div> });
      render(jsx);

      expect(screen.getByText("Inner Content")).toBeInTheDocument();
      expect(screen.getAllByText("Netloka Developer Workspace").length).toBeGreaterThanOrEqual(1);
      expect(touchUserActivity).toHaveBeenCalledWith("dev-1");
    });

    it("throws when requireDeveloperActor fails", async () => {
      vi.mocked(requireDeveloperActor).mockRejectedValue(
        new AuthorizationError("FORBIDDEN", "Developer workspace access required"),
      );

      await expect(DeveloperLayout({ children: <div>Inner Content</div> })).rejects.toThrow(
        "Developer workspace access required",
      );
    });
  });

  describe("DeveloperOverviewPage", () => {
    it("renders overview metrics and health panels", async () => {
      vi.mocked(getDeveloperOverview).mockResolvedValue({
        ordinaryLearners: 120,
        internalLearners: 4,
        newLearners7d: 18,
        newLearners30d: 55,
        activeLearners7d: 42,
        database: { status: "healthy", latencyMs: 5 },
        curriculum: {
          paths: 6,
          modules: 31,
          lessons: 65,
          assessments: 195,
          capstones: 6,
        },
      });

      const jsx = await DeveloperOverviewPage();
      render(jsx);

      expect(screen.getByText("Ringkasan Operasional")).toBeInTheDocument();
      expect(screen.getByText("120")).toBeInTheDocument();
      expect(screen.getByText("Learner Publik")).toBeInTheDocument();
      expect(screen.getByText("Internal Test Accounts")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5 ms")).toBeInTheDocument();
      expect(screen.getByText("6 Jalur Pembelajaran")).toBeInTheDocument();
    });
  });

  describe("DeveloperUsersPage", () => {
    it("renders search input, role filters, and user list", async () => {
      vi.mocked(searchDeveloperUsers).mockResolvedValue({
        users: [
          {
            id: "user-1",
            email: "student@example.com",
            name: "Siswa Satu",
            role: "LEARNER" as UserRole,
            authVersion: 1,
            twoFactorEnabled: false,
            streakCount: 0,
            headline: null,
            lastLoginAt: null,
            lastActiveAt: null,
            createdAt: new Date("2026-09-01T10:00:00Z"),
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      const searchParams = Promise.resolve({ q: "siswa", role: "LEARNER", page: "1" });
      const jsx = await DeveloperUsersPage({ searchParams });
      render(jsx);

      expect(screen.getByText("Direktori Pengguna")).toBeInTheDocument();
      expect(screen.getByText("student@example.com")).toBeInTheDocument();
      expect(screen.getByText("Siswa Satu")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Detail/i })).toHaveAttribute(
        "href",
        "/developer/users/user-1",
      );
    });

    it("renders empty state when no users found", async () => {
      vi.mocked(searchDeveloperUsers).mockResolvedValue({
        users: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      const searchParams = Promise.resolve({ q: "nonexistent" });
      const jsx = await DeveloperUsersPage({ searchParams });
      render(jsx);

      expect(
        screen.getByText("Tidak ada pengguna yang sesuai dengan kriteria pencarian."),
      ).toBeInTheDocument();
    });
  });

  describe("DeveloperUserDetailPage", () => {
    it("renders user details, progress, and package history", async () => {
      vi.mocked(getDeveloperUserDetail).mockResolvedValue({
        id: "user-1",
        email: "learner@netloka.biz.id",
        name: "Learner Budi",
        role: "LEARNER" as UserRole,
        authVersion: 1,
        twoFactorEnabled: false,
        streakCount: 3,
        headline: null,
        lastLoginAt: new Date("2026-09-01T00:00:00Z"),
        lastActiveAt: new Date("2026-09-10T12:00:00Z"),
        createdAt: new Date("2026-08-01T00:00:00Z"),
        progressSummary: {
          completedLessonsCount: 12,
          totalXp: 350,
          quizAttemptsCount: 20,
          assessmentAttemptsCount: 2,
          consultantProjectsCount: 1,
        },
      });

      vi.mocked(getDeveloperUserPackageHistory).mockResolvedValue({
        entitlements: [
          {
            id: "ent-1",
            courseId: "networking-foundations",
            courseTitle: "Network Foundations",
            state: "ACTIVE",
            grantedAt: new Date("2026-08-01T00:00:00Z"),
            revokedAt: null,
            sourceType: "SYSTEM_INITIAL",
          },
        ],
        orders: [],
      });

      const params = Promise.resolve({ userId: "user-1" });
      const jsx = await DeveloperUserDetailPage({ params });
      render(jsx);

      expect(screen.getByText("Detail Pengguna")).toBeInTheDocument();
      expect(screen.getByText("learner@netloka.biz.id")).toBeInTheDocument();
      expect(screen.getByText("Learner Budi")).toBeInTheDocument();
      expect(screen.getByText("Network Foundations")).toBeInTheDocument();
      expect(screen.getByText("350 XP")).toBeInTheDocument();
    });

    it("triggers notFound when user does not exist", async () => {
      vi.mocked(getDeveloperUserDetail).mockResolvedValue(null);
      vi.mocked(getDeveloperUserPackageHistory).mockResolvedValue(null);

      const params = Promise.resolve({ userId: "unknown" });
      await expect(DeveloperUserDetailPage({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    });
  });

  describe("DeveloperAccessPage", () => {
    it("renders access and package explanation", async () => {
      const jsx = await DeveloperAccessPage();
      render(jsx);

      expect(screen.getByText("Akses & Riwayat Paket")).toBeInTheDocument();
      expect(screen.getByText(/Manajemen Hak Akses & Entitlement/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Sprint 36/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("DeveloperCurriculumPage", () => {
    it("renders curriculum health status and paths", async () => {
      vi.mocked(getCurriculumHealth).mockResolvedValue({
        status: "healthy",
        summary: {
          pathsCount: 6,
          modulesCount: 31,
          lessonsCount: 65,
          quizzesCount: 195,
          assessmentsCount: 6,
          capstonesCount: 6,
        },
        checks: [
          {
            name: "Curriculum Paths Integrity",
            passed: true,
            message: "All 6 learning paths are present and sequenced.",
          },
        ],
        issues: [],
      });

      vi.mocked(prisma.learningPath.findMany).mockResolvedValue([
        {
          id: "path-1",
          slug: "network-foundations",
          title: "Network Foundations",
          description: "Dasar-dasar jaringan",
          icon: null,
          orderIndex: 0,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          modules: [
            {
              id: "mod-1",
              learningPathId: "path-1",
              title: "Welcome",
              slug: "welcome",
              orderIndex: 0,
              published: true,
              lessons: [{ id: "les-1" }],
            },
          ],
        },
      ] as unknown as Awaited<ReturnType<typeof prisma.learningPath.findMany>>);

      const jsx = await DeveloperCurriculumPage();
      render(jsx);

      expect(screen.getByText("Kesehatan Kurikulum")).toBeInTheDocument();
      expect(screen.getByText("VALID & SEHAT")).toBeInTheDocument();
      expect(screen.getByText("Network Foundations")).toBeInTheDocument();
    });
  });

  describe("DeveloperSystemPage", () => {
    it("renders database, runtime, memory, and environment checklist", async () => {
      vi.mocked(getSystemHealth).mockResolvedValue({
        status: "healthy",
        timestamp: "2026-09-13T00:00:00.000Z",
        database: {
          status: "healthy",
          latencyMs: 3,
        },
        environment: {
          nodeVersion: "v20.18.0",
          environment: "development",
          variables: {
            DATABASE_URL: {
              configured: true,
              redacted: "[CONFIGURED / REDACTED]",
            },
          },
        },
        memory: {
          rssMb: 120,
          heapTotalMb: 90,
          heapUsedMb: 60,
        },
        uptimeSeconds: 3600,
      });

      const jsx = await DeveloperSystemPage();
      render(jsx);

      expect(screen.getByText("Kesehatan Sistem")).toBeInTheDocument();
      expect(screen.getByText("v20.18.0")).toBeInTheDocument();
      expect(screen.getByText(/DATABASE_URL/i)).toBeInTheDocument();
    });
  });

  describe("DeveloperSecurityPage", () => {
    it("renders security invariants and isolation overview", async () => {
      const jsx = await DeveloperSecurityPage();
      render(jsx);

      expect(screen.getByText("Keamanan & Postur Audit")).toBeInTheDocument();
      expect(screen.getByText(/Isolasi Workspace/i)).toBeInTheDocument();
      expect(screen.getByText(/Penghilangan Rahasia/i)).toBeInTheDocument();
    });
  });

  describe("DeveloperAccountPage", () => {
    it("renders current developer actor account details", async () => {
      vi.mocked(requireDeveloperActor).mockResolvedValue({
        id: "dev-1",
        email: "dev@netloka.biz.id",
        name: "Dev Anto",
        role: "DEVELOPER" as UserRole,
        authVersion: 2,
        twoFactorEnabled: true,
      });

      const jsx = await DeveloperAccountPage();
      render(jsx);

      expect(screen.getByText("Akun Pengembang")).toBeInTheDocument();
      expect(screen.getByText("dev@netloka.biz.id")).toBeInTheDocument();
      expect(screen.getByText("Dev Anto")).toBeInTheDocument();
      expect(screen.getByText("Aktif")).toBeInTheDocument();
    });
  });
});
