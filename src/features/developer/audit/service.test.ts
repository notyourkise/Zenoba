import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db/client";
import {
  recordDeveloperAuditEvent,
  getDeveloperAuditEvents,
  sanitizeAuditState,
  DuplicateAuditRequestConflictError,
} from "./service";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    developerAuditEvent: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("Developer Audit Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sanitizeAuditState", () => {
    it("redacts credentials and sensitive tokens from audit state snapshots", () => {
      const state = {
        userId: "user-1",
        email: "learner@zenoba.tech",
        passwordHash: "$2b$10$abcdef...",
        twoFactorSecret: "SECRETKEY123",
        nested: {
          sessionToken: "opaque_token_xyz",
          courseId: "course-1",
        },
      };

      const sanitized = sanitizeAuditState(state) as Record<string, unknown>;

      expect(sanitized.userId).toBe("user-1");
      expect(sanitized.email).toBe("learner@zenoba.tech");
      expect(sanitized.passwordHash).toBe("[REDACTED]");
      expect(sanitized.twoFactorSecret).toBe("[REDACTED]");
      expect((sanitized.nested as Record<string, unknown>).sessionToken).toBe("[REDACTED]");
      expect((sanitized.nested as Record<string, unknown>).courseId).toBe("course-1");
    });
  });

  describe("recordDeveloperAuditEvent", () => {
    it("creates a new audit record when requestId is fresh", async () => {
      const now = new Date();
      const mockCreated = {
        id: "audit-1",
        actorUserId: "dev-1",
        targetUserId: "learner-1",
        actorKind: "DEVELOPER_WEB",
        action: "ENTITLEMENT_GRANT",
        reason: "Manual package unlock for workshop",
        requestId: "req-12345",
        correlationId: "corr-67890",
        beforeState: { entitled: false },
        afterState: { entitled: true },
        result: "SUCCESS",
        createdAt: now,
      };

      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.developerAuditEvent.create).mockResolvedValueOnce(mockCreated);

      const result = await recordDeveloperAuditEvent({
        actorUserId: "dev-1",
        targetUserId: "learner-1",
        actorKind: "DEVELOPER_WEB",
        action: "ENTITLEMENT_GRANT",
        reason: "Manual package unlock for workshop",
        requestId: "req-12345",
        correlationId: "corr-67890",
        beforeState: { entitled: false },
        afterState: { entitled: true },
        result: "SUCCESS",
      });

      expect(result.id).toBe("audit-1");
      expect(result.idempotentReplay).toBe(false);
      expect(prisma.developerAuditEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          requestId: "req-12345",
          action: "ENTITLEMENT_GRANT",
          result: "SUCCESS",
        }),
      });
    });

    it("returns existing event with idempotentReplay: true on matching replay", async () => {
      const existing = {
        id: "audit-existing",
        actorUserId: "dev-1",
        targetUserId: "learner-1",
        actorKind: "DEVELOPER_WEB",
        action: "ENTITLEMENT_GRANT",
        reason: "Manual unlock",
        requestId: "req-12345",
        correlationId: "corr-67890",
        beforeState: null,
        afterState: null,
        result: "SUCCESS",
        createdAt: new Date(),
      };

      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(existing);

      const result = await recordDeveloperAuditEvent({
        actorUserId: "dev-1",
        targetUserId: "learner-1",
        actorKind: "DEVELOPER_WEB",
        action: "ENTITLEMENT_GRANT",
        reason: "Manual unlock",
        requestId: "req-12345",
        correlationId: "corr-67890",
        result: "SUCCESS",
      });

      expect(result.id).toBe("audit-existing");
      expect(result.idempotentReplay).toBe(true);
      expect(prisma.developerAuditEvent.create).not.toHaveBeenCalled();
    });

    it("throws DuplicateAuditRequestConflictError on mismatched requestId replay", async () => {
      const existing = {
        id: "audit-existing",
        actorUserId: "dev-1",
        targetUserId: "learner-1",
        actorKind: "DEVELOPER_WEB",
        action: "ENTITLEMENT_GRANT",
        reason: "Manual unlock",
        requestId: "req-12345",
        correlationId: "corr-67890",
        beforeState: null,
        afterState: null,
        result: "SUCCESS",
        createdAt: new Date(),
      };

      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(existing);

      await expect(
        recordDeveloperAuditEvent({
          actorUserId: "dev-1",
          targetUserId: "different-user", // mismatch!
          actorKind: "DEVELOPER_WEB",
          action: "ENTITLEMENT_GRANT",
          reason: "Manual unlock",
          requestId: "req-12345",
          correlationId: "corr-67890",
          result: "SUCCESS",
        })
      ).rejects.toThrow(DuplicateAuditRequestConflictError);
    });

    it("supports executing inside an external Prisma transaction", async () => {
      const mockTx = {
        developerAuditEvent: {
          findUnique: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockResolvedValue({
            id: "audit-tx-1",
            actorUserId: "dev-1",
            targetUserId: "learner-1",
            actorKind: "CLI",
            action: "ENTITLEMENT_REVOKE",
            reason: "Revoke request",
            requestId: "req-tx",
            correlationId: "corr-tx",
            beforeState: null,
            afterState: null,
            result: "SUCCESS",
            createdAt: new Date(),
          }),
        },
      };

      const result = await recordDeveloperAuditEvent(
        {
          actorUserId: "dev-1",
          targetUserId: "learner-1",
          actorKind: "CLI",
          action: "ENTITLEMENT_REVOKE",
          reason: "Revoke request",
          requestId: "req-tx",
          correlationId: "corr-tx",
          result: "SUCCESS",
        },
        mockTx as unknown as typeof prisma
      );

      expect(result.id).toBe("audit-tx-1");
      expect(mockTx.developerAuditEvent.create).toHaveBeenCalled();
      expect(prisma.developerAuditEvent.create).not.toHaveBeenCalled();
    });
  });

  describe("getDeveloperAuditEvents", () => {
    it("caps query limit at 50 and orders by createdAt desc", async () => {
      vi.mocked(prisma.developerAuditEvent.findMany).mockResolvedValueOnce([]);

      await getDeveloperAuditEvents({ limit: 100, targetUserId: "user-123" });

      expect(prisma.developerAuditEvent.findMany).toHaveBeenCalledWith({
        where: { targetUserId: "user-123" },
        take: 50,
        orderBy: { createdAt: "desc" },
      });
    });
  });
});
