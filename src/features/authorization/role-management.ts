import { prisma } from "@/lib/db/client";
import { UserRole } from "@/generated/prisma/client";

export type RoleChangeInput = {
  email: string;
  role: UserRole;
  operator: string;
  reason: string;
  requestId: string;
};

export type RoleChangeResult = {
  userId: string;
  email: string;
  previousRole: UserRole;
  newRole: UserRole;
  authVersion: number;
  elevationSessionsRevoked: number;
  auditEventId: string;
};

export class RoleManagementError extends Error {
  constructor(
    public readonly code:
      | "USER_NOT_FOUND"
      | "DEVELOPER_REQUIRES_PASSWORD"
      | "DEVELOPER_REQUIRES_2FA"
      | "INVALID_INPUT",
    message: string,
  ) {
    super(message);
    this.name = "RoleManagementError";
  }
}

export async function setUserRole(
  input: RoleChangeInput,
  client = prisma,
): Promise<RoleChangeResult> {
  const email = input.email?.trim().toLowerCase();
  const operator = input.operator?.trim();
  const reason = input.reason?.trim();
  const requestId = input.requestId?.trim();

  if (!email) {
    throw new RoleManagementError("INVALID_INPUT", "Email is required");
  }
  if (!operator) {
    throw new RoleManagementError("INVALID_INPUT", "Operator identifier is required");
  }
  if (!reason) {
    throw new RoleManagementError("INVALID_INPUT", "Audit reason is required");
  }
  if (!requestId) {
    throw new RoleManagementError("INVALID_INPUT", "Request ID is required");
  }
  if (!Object.values(UserRole).includes(input.role)) {
    throw new RoleManagementError("INVALID_INPUT", `Invalid role: ${input.role}`);
  }

  // Find user by email
  const user = await client.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      authVersion: true,
      passwordHash: true,
      twoFactorEnabled: true,
    },
  });

  if (!user) {
    throw new RoleManagementError(
      "USER_NOT_FOUND",
      `User with email "${email}" not found`,
    );
  }

  // Preconditions for DEVELOPER elevation
  if (input.role === UserRole.DEVELOPER) {
    if (!user.passwordHash) {
      throw new RoleManagementError(
        "DEVELOPER_REQUIRES_PASSWORD",
        "Target user must have password credentials before elevation to DEVELOPER",
      );
    }
    if (!user.twoFactorEnabled) {
      throw new RoleManagementError(
        "DEVELOPER_REQUIRES_2FA",
        "Target user must have two-factor authentication enabled before elevation to DEVELOPER",
      );
    }
  }

  return await client.$transaction(async (tx) => {
    // 1. Update user role and increment authVersion
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        role: input.role,
        authVersion: { increment: 1 },
        lastActiveAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        role: true,
        authVersion: true,
      },
    });

    // 2. Revoke any active elevation sessions
    const revocationResult = await tx.developerElevationSession.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    // 3. Create immutable audit event
    const auditEvent = await tx.developerAuditEvent.create({
      data: {
        actorUserId: null,
        targetUserId: user.id,
        actorKind: "CLI_OPERATOR",
        action: "ROLE_CHANGE",
        reason,
        requestId,
        correlationId: requestId,
        beforeState: {
          role: user.role,
          authVersion: user.authVersion,
        },
        afterState: {
          role: updatedUser.role,
          authVersion: updatedUser.authVersion,
        },
        result: "SUCCESS",
      },
      select: {
        id: true,
      },
    });

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      previousRole: user.role,
      newRole: updatedUser.role,
      authVersion: updatedUser.authVersion,
      elevationSessionsRevoked: revocationResult.count,
      auditEventId: auditEvent.id,
    };
  });
}

export const setUserRoleFromCli = setUserRole;
