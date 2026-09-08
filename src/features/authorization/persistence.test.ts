import { describe, expect, it } from "vitest";
import { UserRole, type Prisma } from "@/generated/prisma/client";

describe("persistence role and audit models", () => {
  it("exports the UserRole enum with exact canonical values", () => {
    expect(UserRole.LEARNER).toBe("LEARNER");
    expect(UserRole.INTERNAL_LEARNER).toBe("INTERNAL_LEARNER");
    expect(UserRole.DEVELOPER).toBe("DEVELOPER");
    expect(Object.values(UserRole)).toEqual(["LEARNER", "INTERNAL_LEARNER", "DEVELOPER"]);
  });

  it("conforms to Prisma model type contracts for User with UserRole and authVersion", () => {
    const mockUserInput: Prisma.UserCreateInput = {
      email: "user@example.com",
      role: UserRole.LEARNER,
      authVersion: 1,
      lastLoginAt: new Date("2026-09-08T00:00:00Z"),
      lastActiveAt: new Date("2026-09-08T00:05:00Z"),
    };

    expect(mockUserInput.role).toBe(UserRole.LEARNER);
    expect(mockUserInput.authVersion).toBe(1);
    expect(mockUserInput.lastLoginAt).toBeInstanceOf(Date);
  });

  it("conforms to Prisma model type contracts for DeveloperElevationSession", () => {
    const mockSessionInput: Prisma.DeveloperElevationSessionCreateInput = {
      user: { connect: { id: "dev-user-id" } },
      tokenHash: "hashed-token-string",
      authVersion: 1,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      ipHash: "hashed-ip-123",
      userAgent: "NetlokaDeveloperAgent/1.0",
    };

    expect(mockSessionInput.tokenHash).toBe("hashed-token-string");
    expect(mockSessionInput.authVersion).toBe(1);
    expect(mockSessionInput.ipHash).toBe("hashed-ip-123");
  });

  it("conforms to Prisma model type contracts for DeveloperAuditEvent", () => {
    const mockAuditInput: Prisma.DeveloperAuditEventCreateInput = {
      actorUserId: "dev-user-id",
      targetUserId: "learner-user-id",
      actorKind: "DEVELOPER_WEB",
      action: "ENTITLEMENT_GRANT",
      reason: "Course enrollment support ticket #42",
      requestId: "req-dev-elevation-001",
      correlationId: "corr-dev-elevation-001",
      beforeState: { granted: false },
      afterState: { granted: true },
      result: "SUCCESS",
    };

    expect(mockAuditInput.action).toBe("ENTITLEMENT_GRANT");
    expect(mockAuditInput.requestId).toBe("req-dev-elevation-001");
    expect(mockAuditInput.result).toBe("SUCCESS");
  });

  it("conforms to Prisma model type contracts for SecurityEvent", () => {
    const mockSecurityInput: Prisma.SecurityEventCreateInput = {
      userId: "suspicious-user-id",
      type: "ELEVATION_FAILED_PASSWORD",
      severity: "HIGH",
      metadata: { attempts: 3, ip: "192.168.1.100" },
    };

    expect(mockSecurityInput.type).toBe("ELEVATION_FAILED_PASSWORD");
    expect(mockSecurityInput.severity).toBe("HIGH");
  });
});
