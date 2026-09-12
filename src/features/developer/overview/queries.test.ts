import { describe, expect, it, vi, beforeEach } from "vitest";
import { getDeveloperOverview } from "./queries";
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
      count: vi.fn(),
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

describe("Developer Overview Read Model (getDeveloperOverview)", () => {
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

  it("throws AuthorizationError when caller is not an authorized developer", async () => {
    vi.mocked(requireDeveloperActor).mockRejectedValueOnce(
      new AuthorizationError("FORBIDDEN", "Developer workspace access required")
    );

    await expect(getDeveloperOverview()).rejects.toThrow(
      "Developer workspace access required"
    );
  });

  it("returns overview metrics excluding internal learners from ordinary metrics", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

    // Mock count calls:
    // 1. ordinaryLearners
    // 2. internalLearners
    // 3. newLearners7d
    // 4. newLearners30d
    // 5. activeLearners7d
    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(150) // ordinaryLearners
      .mockResolvedValueOnce(5)   // internalLearners
      .mockResolvedValueOnce(20)  // newLearners7d
      .mockResolvedValueOnce(45)  // newLearners30d
      .mockResolvedValueOnce(35); // activeLearners7d

    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ "?column?": 1 }]);
    vi.mocked(prisma.learningPath.count).mockResolvedValueOnce(6);
    vi.mocked(prisma.module.count).mockResolvedValueOnce(31);
    vi.mocked(prisma.lesson.count).mockResolvedValueOnce(65);

    const fixedNow = new Date("2026-09-13T00:00:00.000Z");
    const overview = await getDeveloperOverview(fixedNow);

    expect(overview.ordinaryLearners).toBe(150);
    expect(overview.internalLearners).toBe(5);
    expect(overview.newLearners7d).toBe(20);
    expect(overview.newLearners30d).toBe(45);
    expect(overview.activeLearners7d).toBe(35);
    expect(overview.database.status).toBe("healthy");
    expect(typeof overview.database.latencyMs).toBe("number");
    expect(overview.curriculum.paths).toBe(6);
    expect(overview.curriculum.modules).toBe(31);
    expect(overview.curriculum.lessons).toBe(65);
    expect(overview.curriculum.assessments).toBe(6);
    expect(overview.curriculum.capstones).toBe(6);

    // Verify first count call uses ORDINARY_LEARNER_FILTER (role: "LEARNER")
    expect(vi.mocked(prisma.user.count)).toHaveBeenNthCalledWith(1, {
      where: { role: "LEARNER" },
    });
    // Verify second count call uses role: "INTERNAL_LEARNER"
    expect(vi.mocked(prisma.user.count)).toHaveBeenNthCalledWith(2, {
      where: { role: "INTERNAL_LEARNER" },
    });
  });

  it("handles database latency query failure gracefully with degraded status", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

    vi.mocked(prisma.user.count)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(4);

    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error("Connection timeout"));
    vi.mocked(prisma.learningPath.count).mockResolvedValueOnce(6);
    vi.mocked(prisma.module.count).mockResolvedValueOnce(31);
    vi.mocked(prisma.lesson.count).mockResolvedValueOnce(65);

    const overview = await getDeveloperOverview();

    expect(overview.database.status).toBe("degraded");
    expect(overview.database.latencyMs).toBeNull();
  });

  it("never includes sensitive user fields in the overview output", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
    vi.mocked(prisma.user.count).mockResolvedValue(0);
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([]);
    vi.mocked(prisma.learningPath.count).mockResolvedValueOnce(6);
    vi.mocked(prisma.module.count).mockResolvedValueOnce(31);
    vi.mocked(prisma.lesson.count).mockResolvedValueOnce(65);

    const overview = await getDeveloperOverview();
    const serialized = JSON.stringify(overview);

    expect(serialized).not.toContain("passwordHash");
    expect(serialized).not.toContain("twoFactorSecret");
    expect(serialized).not.toContain("twoFactorBackupCodes");
    expect(serialized).not.toContain("tokenHash");
  });
});
