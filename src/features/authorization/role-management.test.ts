/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  setUserRole,
  setUserRoleFromCli,
  RoleManagementError,
  type RoleChangeInput,
} from "./role-management";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    developerElevationSession: {
      updateMany: vi.fn(),
    },
    developerAuditEvent: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("Role Management Service (setUserRole / setUserRoleFromCli)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default transaction mock implementation executes the callback with prisma
    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      return callback(prisma);
    });
  });

  const validLearner = {
    id: "user-123",
    email: "learner@netloka.biz.id",
    role: UserRole.LEARNER,
    authVersion: 1,
    passwordHash: "$2b$10$abcdefghijklmnopqrstuv",
    twoFactorEnabled: false,
  };

  const validDeveloperCandidate = {
    id: "user-456",
    email: "candidate@netloka.biz.id",
    role: UserRole.LEARNER,
    authVersion: 2,
    passwordHash: "$2b$10$abcdefghijklmnopqrstuv",
    twoFactorEnabled: true,
  };

  it("successfully changes role from LEARNER to INTERNAL_LEARNER", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(validLearner as any);
    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      id: "user-123",
      email: "learner@netloka.biz.id",
      role: UserRole.INTERNAL_LEARNER,
      authVersion: 2,
    } as any);
    vi.mocked(prisma.developerElevationSession.updateMany).mockResolvedValueOnce({
      count: 0,
    });
    vi.mocked(prisma.developerAuditEvent.create).mockResolvedValueOnce({
      id: "audit-1",
    } as any);

    const input: RoleChangeInput = {
      email: "learner@netloka.biz.id",
      role: UserRole.INTERNAL_LEARNER,
      operator: "sysadmin-ali",
      reason: "Granting internal evaluation access",
      requestId: "req-abc-123",
    };

    const result = await setUserRole(input);

    expect(result).toEqual({
      userId: "user-123",
      email: "learner@netloka.biz.id",
      previousRole: UserRole.LEARNER,
      newRole: UserRole.INTERNAL_LEARNER,
      authVersion: 2,
      elevationSessionsRevoked: 0,
      auditEventId: "audit-1",
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: expect.objectContaining({
        role: UserRole.INTERNAL_LEARNER,
        authVersion: { increment: 1 },
      }),
      select: expect.any(Object),
    });

    expect(prisma.developerAuditEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorKind: "CLI_OPERATOR",
        action: "ROLE_CHANGE",
        reason: "Granting internal evaluation access",
        requestId: "req-abc-123",
        targetUserId: "user-123",
        beforeState: { role: UserRole.LEARNER, authVersion: 1 },
        afterState: { role: UserRole.INTERNAL_LEARNER, authVersion: 2 },
        result: "SUCCESS",
      }),
      select: { id: true },
    });
  });

  it("successfully elevates candidate to DEVELOPER when password and 2FA exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(
      validDeveloperCandidate as any,
    );
    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      id: "user-456",
      email: "candidate@netloka.biz.id",
      role: UserRole.DEVELOPER,
      authVersion: 3,
    } as any);
    vi.mocked(prisma.developerElevationSession.updateMany).mockResolvedValueOnce({
      count: 1,
    });
    vi.mocked(prisma.developerAuditEvent.create).mockResolvedValueOnce({
      id: "audit-2",
    } as any);

    const input: RoleChangeInput = {
      email: "candidate@netloka.biz.id",
      role: UserRole.DEVELOPER,
      operator: "super-admin",
      reason: "Promoted to core platform engineer",
      requestId: "req-dev-elevation",
    };

    const result = await setUserRoleFromCli(input);

    expect(result.newRole).toBe(UserRole.DEVELOPER);
    expect(result.authVersion).toBe(3);
    expect(result.elevationSessionsRevoked).toBe(1);
  });

  it("rejects promotion to DEVELOPER if user has no passwordHash (OAuth-only)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      ...validDeveloperCandidate,
      passwordHash: null,
      twoFactorEnabled: true,
    } as any);

    const input: RoleChangeInput = {
      email: "oauth@netloka.biz.id",
      role: UserRole.DEVELOPER,
      operator: "super-admin",
      reason: "Attempted elevation without credentials",
      requestId: "req-no-pass",
    };

    await expect(setUserRole(input)).rejects.toMatchObject({
      name: "RoleManagementError",
      code: "DEVELOPER_REQUIRES_PASSWORD",
    });

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("rejects promotion to DEVELOPER if user has not enabled 2FA", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      ...validDeveloperCandidate,
      twoFactorEnabled: false,
    } as any);

    const input: RoleChangeInput = {
      email: "candidate@netloka.biz.id",
      role: UserRole.DEVELOPER,
      operator: "super-admin",
      reason: "Attempted elevation without 2FA",
      requestId: "req-no-2fa",
    };

    await expect(setUserRole(input)).rejects.toMatchObject({
      name: "RoleManagementError",
      code: "DEVELOPER_REQUIRES_2FA",
    });

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("throws USER_NOT_FOUND when email does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

    const input: RoleChangeInput = {
      email: "ghost@netloka.biz.id",
      role: UserRole.LEARNER,
      operator: "admin",
      reason: "Unknown user test",
      requestId: "req-ghost",
    };

    await expect(setUserRole(input)).rejects.toThrow(RoleManagementError);
    await expect(setUserRole(input)).rejects.toMatchObject({
      code: "USER_NOT_FOUND",
    });
  });

  it("validates mandatory fields and rejects empty input with INVALID_INPUT", async () => {
    await expect(
      setUserRole({
        email: "",
        role: UserRole.LEARNER,
        operator: "admin",
        reason: "Test",
        requestId: "req-1",
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      setUserRole({
        email: "user@example.com",
        role: UserRole.LEARNER,
        operator: "",
        reason: "Test",
        requestId: "req-1",
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      setUserRole({
        email: "user@example.com",
        role: UserRole.LEARNER,
        operator: "admin",
        reason: "",
        requestId: "req-1",
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      setUserRole({
        email: "user@example.com",
        role: "SUPERMAN" as any,
        operator: "admin",
        reason: "Test",
        requestId: "req-1",
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("revokes active elevation sessions on role change", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(
      validDeveloperCandidate as any,
    );
    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      id: "user-456",
      email: "candidate@netloka.biz.id",
      role: UserRole.LEARNER,
      authVersion: 3,
    } as any);
    vi.mocked(prisma.developerElevationSession.updateMany).mockResolvedValueOnce({
      count: 3,
    });
    vi.mocked(prisma.developerAuditEvent.create).mockResolvedValueOnce({
      id: "audit-3",
    } as any);

    const input: RoleChangeInput = {
      email: "candidate@netloka.biz.id",
      role: UserRole.LEARNER,
      operator: "security-auditor",
      reason: "Demoting developer back to learner",
      requestId: "req-demote",
    };

    const result = await setUserRole(input);

    expect(result.elevationSessionsRevoked).toBe(3);
    expect(prisma.developerElevationSession.updateMany).toHaveBeenCalledWith({
      where: {
        userId: "user-456",
        revokedAt: null,
      },
      data: expect.objectContaining({
        revokedAt: expect.any(Date),
      }),
    });
  });
});
