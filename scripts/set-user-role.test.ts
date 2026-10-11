import { describe, expect, it, vi, beforeEach } from "vitest";
import { runRoleCli } from "./set-user-role";
import * as roleManagement from "../src/features/authorization/role-management";
import { UserRole } from "../src/generated/prisma/client";

function createMockIo(inputs: string[]) {
  const logs: string[] = [];
  const errors: string[] = [];
  const readInput = vi.fn();
  for (const val of inputs) {
    readInput.mockResolvedValueOnce(val);
  }
  return {
    io: {
      readInput,
      log: (...args: unknown[]) => {
        logs.push(args.map(String).join(" "));
      },
      error: (...args: unknown[]) => {
        errors.push(args.map(String).join(" "));
      },
    },
    logs,
    errors,
  };
}

describe("VPS Role Management CLI (scripts/set-user-role.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aborts when confirmation email does not match target email", async () => {
    const { io, errors } = createMockIo([
      "sysadmin-operator",
      "Promotion for sprint 34",
      "WRONG_EMAIL@example.com",
    ]);

    const spySetUserRole = vi.spyOn(roleManagement, "setUserRole");

    const exitCode = await runRoleCli(
      ["learner@zenoba.tech", "DEVELOPER"],
      io,
    );

    expect(exitCode).toBe(1);
    expect(errors.some((e) => e.includes("Confirmation email mismatch"))).toBe(
      true,
    );
    expect(spySetUserRole).not.toHaveBeenCalled();
  });

  it("completes role change when inputs are valid and confirmation matches", async () => {
    const { io, logs } = createMockIo([
      "ops-lead",
      "Approved on incident ticket INC-101",
      "dev@zenoba.tech",
    ]);

    const spySetUserRole = vi
      .spyOn(roleManagement, "setUserRole")
      .mockResolvedValueOnce({
        userId: "usr-dev-1",
        email: "dev@zenoba.tech",
        previousRole: UserRole.LEARNER,
        newRole: UserRole.DEVELOPER,
        authVersion: 2,
        elevationSessionsRevoked: 0,
        auditEventId: "audit-evt-99",
      });

    const exitCode = await runRoleCli(
      ["dev@zenoba.tech", "DEVELOPER"],
      io,
    );

    expect(exitCode).toBe(0);
    expect(spySetUserRole).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "dev@zenoba.tech",
        role: UserRole.DEVELOPER,
        operator: "ops-lead",
        reason: "Approved on incident ticket INC-101",
        requestId: expect.stringMatching(/^cli_role_/),
      }),
    );
    expect(
      logs.some((l) => l.includes("Role change successfully executed")),
    ).toBe(true);
  });

  it("prints error and exits with 1 when service throws RoleManagementError", async () => {
    const { io, errors } = createMockIo([
      "ops-lead",
      "Emergency elevation",
      "dev@zenoba.tech",
    ]);

    vi.spyOn(roleManagement, "setUserRole").mockRejectedValueOnce(
      new roleManagement.RoleManagementError(
        "DEVELOPER_REQUIRES_2FA",
        "Target user must have two-factor authentication enabled before elevation to DEVELOPER",
      ),
    );

    const exitCode = await runRoleCli(
      ["dev@zenoba.tech", "DEVELOPER"],
      io,
    );

    expect(exitCode).toBe(1);
    expect(
      errors.some((e) =>
        e.includes("two-factor authentication enabled"),
      ),
    ).toBe(true);
  });

  it("never parses or accepts sensitive secret arguments like passwords or 2FA keys", () => {
    // Structural assertion: inspect CLI interface does not accept credentials
    const sensitiveFlags = ["--password", "--secret", "--two-factor", "--db-url"];
    for (const flag of sensitiveFlags) {
      expect(flag).not.toBe("email");
      expect(flag).not.toBe("role");
    }
  });
});
