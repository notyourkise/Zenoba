import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { getServerSession } from "next-auth";
import type { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/client";
import {
  requireDeveloperActor,
  requireLearnerActor,
} from "@/features/authorization/guards";
import { searchDeveloperUsers } from "@/features/developer/users/queries";
import { getDeveloperOverview } from "@/features/developer/overview/queries";
import { getSystemHealth } from "@/features/developer/system/health";
import { DeveloperShell } from "@/features/developer/components/developer-shell";
import {
  ELEVATION_TTL_MS,
  ELEVATION_COOKIE_NAME,
  hashElevationToken,
} from "@/features/developer/elevation/service";

// Mock next-auth and prisma
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    learningPath: {
      count: vi.fn(),
    },
    module: {
      count: vi.fn(),
    },
    lesson: {
      count: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

vi.mock("@/features/auth/auth", () => ({
  authOptions: {},
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/developer",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

type DbUser = Awaited<ReturnType<typeof prisma.user.findUnique>>;
type DbUsers = Awaited<ReturnType<typeof prisma.user.findMany>>;

describe("Sprint 35 Verification: Developer Portal & Security Invariants", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default to developer actor for query tests
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: "dev-1" } });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "dev-1",
      email: "dev@netloka.biz.id",
      name: "Developer Anto",
      role: "DEVELOPER" as UserRole,
      authVersion: 1,
      twoFactorEnabled: true,
    } as unknown as DbUser);
  });

  describe("1. Query Performance & Bounding Invariants", () => {
    it("caps user search limit to a maximum of 50 even when client requests higher", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      const result = await searchDeveloperUsers({ query: "learner", limit: 500, page: 1 });

      expect(result.limit).toBe(50);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
        }),
      );
    });

    it("requires at least 2 characters for query search unless a role filter is active", async () => {
      // Single character without role filter -> should return empty without database hit
      const singleCharResult = await searchDeveloperUsers({ query: "a" });
      expect(singleCharResult.users).toEqual([]);
      expect(singleCharResult.total).toBe(0);
      expect(prisma.user.findMany).not.toHaveBeenCalled();

      // Single character WITH role filter -> should query database bounded by role
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      await searchDeveloperUsers({ query: "a", role: "DEVELOPER" as UserRole });
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: "DEVELOPER",
          }),
        }),
      );
    });

    it("resiliently handles database latency spikes or ping failures in getDeveloperOverview via Promise.allSettled", async () => {
      // Mock db queries where count passes but raw ping fails
      vi.mocked(prisma.user.count).mockResolvedValue(10);
      vi.mocked(prisma.learningPath.count).mockResolvedValue(6);
      vi.mocked(prisma.module.count).mockResolvedValue(31);
      vi.mocked(prisma.lesson.count).mockResolvedValue(65);
      vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("Connection timeout"));

      const overview = await getDeveloperOverview();

      expect(overview.database.status).toBe("degraded");
      expect(overview.database.latencyMs).toBeNull();
      // Counts should still resolve gracefully
      expect(overview.ordinaryLearners).toBe(10);
      expect(overview.curriculum.paths).toBe(6);
    });
  });

  describe("2. Authorization & Workspace Isolation Boundaries", () => {
    it("strictly forbids LEARNER and INTERNAL_LEARNER actors from accessing developer workspace", async () => {
      // Session exists for LEARNER
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: "learner-1" } });
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "learner-1",
        email: "learner@netloka.biz.id",
        name: "Learner One",
        role: "LEARNER" as UserRole,
        authVersion: 1,
        twoFactorEnabled: false,
      } as unknown as DbUser);

      await expect(requireDeveloperActor()).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
        message: "Developer workspace access required",
      });

      // Session exists for INTERNAL_LEARNER
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "internal-1",
        email: "internal@netloka.biz.id",
        name: "Internal Tester",
        role: "INTERNAL_LEARNER" as UserRole,
        authVersion: 1,
        twoFactorEnabled: false,
      } as unknown as DbUser);

      await expect(requireDeveloperActor()).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
        message: "Developer workspace access required",
      });
    });

    it("strictly forbids unauthenticated actors with 401 UNAUTHENTICATED", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      await expect(requireDeveloperActor()).rejects.toMatchObject({
        code: "UNAUTHENTICATED",
        status: 401,
        message: "Authentication required",
      });
    });

    it("strictly prevents DEVELOPER role from mutating learner workspace flows (cross-workspace isolation)", async () => {
      vi.mocked(getServerSession).mockResolvedValue({ user: { id: "dev-1" } });
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "dev-1",
        email: "dev@netloka.biz.id",
        name: "Developer One",
        role: "DEVELOPER" as UserRole,
        authVersion: 1,
        twoFactorEnabled: true,
      } as unknown as DbUser);

      await expect(requireLearnerActor()).rejects.toMatchObject({
        code: "FORBIDDEN",
        status: 403,
        message: "Learner workspace access required",
      });
    });
  });

  describe("3. Secret Redaction & Privacy Invariants", () => {
    it("never includes passwordHash, twoFactorSecret, or session tokens in user search projections", async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([
        {
          id: "u-1",
          name: "Test Learner",
          email: "test@netloka.biz.id",
          role: "LEARNER" as UserRole,
          authVersion: 1,
          twoFactorEnabled: false,
          streakCount: 0,
          headline: null,
          lastLoginAt: null,
          lastActiveAt: null,
          createdAt: new Date(),
        },
      ] as unknown as DbUsers);
      vi.mocked(prisma.user.count).mockResolvedValue(1);

      const result = await searchDeveloperUsers({ query: "test" });
      const user = result.users[0];

      // Explicitly check for forbidden sensitive fields
      const record = user as unknown as Record<string, unknown>;
      expect(record.passwordHash).toBeUndefined();
      expect(record.twoFactorSecret).toBeUndefined();
      expect(record.twoFactorBackupCodes).toBeUndefined();
      expect(record.tokenHash).toBeUndefined();
      expect(record.resetToken).toBeUndefined();
    });

    it("redacts environment variable values in system health check", async () => {
      const originalDbUrl = process.env.DATABASE_URL;
      process.env.DATABASE_URL = "postgresql://secret_user:super_secret_password@db.internal:5432/netloka_db";

      try {
        vi.mocked(prisma.$queryRaw).mockResolvedValue([1]);

        const health = await getSystemHealth();

        expect(health.environment.variables.DATABASE_URL.redacted).toBe("[CONFIGURED / REDACTED]");
        expect(health.environment.variables.DATABASE_URL.configured).toBe(true);
        // Value must not expose connection string or credentials
        expect(JSON.stringify(health)).not.toContain("super_secret_password");
        expect(JSON.stringify(health)).not.toContain("secret_user");
      } finally {
        if (originalDbUrl !== undefined) {
          process.env.DATABASE_URL = originalDbUrl;
        } else {
          delete process.env.DATABASE_URL;
        }
      }
    });
  });

  describe("4. Visual Icon Policy & Accessibility Invariants", () => {
    const devActor = {
      id: "dev-1",
      name: "Anto Developer",
      email: "anto@netloka.biz.id",
      role: "DEVELOPER",
      twoFactorEnabled: true,
    };

    it("does not render decorative emojis or unauthorized icons in the developer workspace shell", () => {
      const { container } = render(
        <DeveloperShell actor={devActor}>
          <div>Workspace Content</div>
        </DeveloperShell>,
      );

      // Verify no emoji in text nodes
      const textContent = container.textContent || "";
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(emojiRegex.test(textContent)).toBe(false);
    });

    it("provides accessible navigation landmarks and aria-current attributes", () => {
      render(
        <DeveloperShell actor={devActor}>
          <div>Workspace Content</div>
        </DeveloperShell>,
      );

      // Active navigation item has aria-current="page"
      const currentLink = screen.getAllByRole("link", { name: /Ringkasan/i });
      expect(currentLink[0]).toHaveAttribute("aria-current", "page");

      // Non-active navigation items do NOT have aria-current="page"
      const usersLink = screen.getAllByRole("link", { name: /Pengguna/i });
      expect(usersLink[0]).not.toHaveAttribute("aria-current", "page");

      // Hamburger button has accessible name and aria-expanded
      const toggleBtn = screen.getByLabelText("Buka menu navigasi pengembang");
      expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("5. Developer Elevation & Ephemeral Session Invariants", () => {
    it("enforces elevation TTL of exactly 10 minutes", () => {
      expect(ELEVATION_TTL_MS).toBe(10 * 60 * 1000);
    });

    it("uses netloka_dev_elevation cookie name", () => {
      expect(ELEVATION_COOKIE_NAME).toBe("netloka_dev_elevation");
    });

    it("hashes elevation tokens with SHA-256 and never matches raw token", () => {
      const raw = "sample_raw_token_value_32_bytes_hex";
      const hashed = hashElevationToken(raw);

      expect(hashed).not.toBe(raw);
      expect(hashed.length).toBe(64);
      expect(hashElevationToken(raw)).toBe(hashed); // Deterministic
    });
  });
});
