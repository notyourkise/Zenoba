import { describe, expect, it, vi, beforeEach } from "vitest";
import { getSystemHealth } from "./health";
import { prisma } from "@/lib/db/client";
import { requireDeveloperActor } from "@/lib/auth";
import { AuthorizationError } from "@/features/authorization/types";
import { UserRole } from "@/generated/prisma/client";

vi.mock("@/lib/auth", () => ({
  requireDeveloperActor: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe("System Health Read Model (getSystemHealth)", () => {
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

    await expect(getSystemHealth()).rejects.toThrow(
      "Developer workspace access required"
    );
  });

  it("returns healthy system diagnostics when database responds", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ "?column?": 1 }]);

    const health = await getSystemHealth();

    expect(health.status).toBe("healthy");
    expect(health.database.status).toBe("healthy");
    expect(typeof health.database.latencyMs).toBe("number");
    expect(health.memory.rssMb).toBeGreaterThan(0);
    expect(health.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(health.environment.nodeVersion).toBeTruthy();
  });

  it("marks database degraded when query fails", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error("DB Down"));

    const health = await getSystemHealth();

    expect(health.status).toBe("degraded");
    expect(health.database.status).toBe("degraded");
    expect(health.database.latencyMs).toBeNull();
  });

  it("strictly redacts sensitive environment variables and never exposes raw secrets", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockDeveloperActor);
    vi.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ "?column?": 1 }]);

    const health = await getSystemHealth();
    const serialized = JSON.stringify(health);

    // Verify raw secret patterns are NEVER present
    expect(serialized).not.toContain("postgresql://");
    expect(serialized).not.toContain("netloka_ci_password");
    expect(serialized).not.toContain("passwordHash");
    expect(serialized).not.toContain("twoFactorSecret");

    // Verify environment variables are masked / redacted objects
    for (const [, val] of Object.entries(health.environment.variables)) {
      expect(typeof val.configured).toBe("boolean");
      expect(val.redacted).toMatch(/^\[.*\]$/);
    }
  });
});
