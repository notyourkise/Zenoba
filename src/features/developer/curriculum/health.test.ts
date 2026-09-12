import { describe, expect, it, vi, beforeEach } from "vitest";
import { getCurriculumHealth } from "./health";
import { requireDeveloperActor } from "@/lib/auth";
import { AuthorizationError } from "@/features/authorization/types";
import { UserRole } from "@/generated/prisma/client";

vi.mock("@/lib/auth", () => ({
  requireDeveloperActor: vi.fn(),
}));

describe("Curriculum Health Read Model (getCurriculumHealth)", () => {
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

    await expect(getCurriculumHealth()).rejects.toThrow(
      "Developer workspace access required"
    );
  });

  it("inspects the curriculum registry and returns health status with 65 lessons, 195 quizzes, and 6 capstones", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);

    const health = await getCurriculumHealth();

    expect(health.status).toBe("healthy");
    expect(health.summary.pathsCount).toBe(6);
    expect(health.summary.modulesCount).toBe(31);
    expect(health.summary.lessonsCount).toBe(65);
    expect(health.summary.quizzesCount).toBe(195);
    expect(health.summary.assessmentsCount).toBe(6);
    expect(health.summary.capstonesCount).toBe(6);
    expect(health.issues).toHaveLength(0);
    expect(health.checks.length).toBeGreaterThanOrEqual(4);
    expect(health.checks.every((c) => c.passed)).toBe(true);
  });
});
