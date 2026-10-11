/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db/client";
import {
  mutateDeveloperEntitlement,
  EntitlementMutationSchema,
} from "./mutations";
import { recordDeveloperAuditEvent } from "@/features/developer/audit/service";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    package: {
      findUnique: vi.fn(),
    },
    entitlement: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      updateMany: vi.fn(),
    },
    developerAuditEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    order: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/features/developer/audit/service", () => ({
  recordDeveloperAuditEvent: vi.fn(),
}));

describe("Developer Entitlement Mutations Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      return callback(prisma);
    });
  });

  const validTargetUser = {
    id: "clrkuser12345678901234567",
    email: "learner@zenoba.tech",
    name: "Learner Zenoba",
    role: "LEARNER",
  };

  const validPackage = {
    id: "clrkpkg123456789012345678",
    slug: "networking-starter",
    title: "Networking Starter Pack",
    kind: "COMBO",
    packageCourses: [
      {
        packageId: "clrkpkg123456789012345678",
        courseId: "clrkcrs123456789012345678",
        orderIndex: 0,
        course: { id: "clrkcrs123456789012345678", title: "Network Foundations" },
      },
      {
        packageId: "clrkpkg123456789012345678",
        courseId: "clrkcrs223456789012345678",
        orderIndex: 1,
        course: { id: "clrkcrs223456789012345678", title: "IPv4 Subnetting" },
      },
    ],
  };

  const validGrantInput = {
    action: "GRANT" as const,
    targetUserId: "clrkuser12345678901234567",
    packageId: "clrkpkg123456789012345678",
    reason: "Pemberian akses beasiswa pelatihan SMK TKJ",
    requestId: "11111111-2222-3333-4444-555555555555",
  };

  const actorUserId = "clrkactor1234567890123456";

  describe("Schema Validation", () => {
    it("rejects reason shorter than 12 characters", () => {
      const short = {
        ...validGrantInput,
        reason: "Pendek",
      };
      const result = EntitlementMutationSchema.safeParse(short);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("minimal 12 karakter");
      }
    });

    it("rejects invalid CUIDs or UUIDs", () => {
      const invalid = {
        ...validGrantInput,
        targetUserId: "not-a-cuid",
        requestId: "not-a-uuid",
      };
      const result = EntitlementMutationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("GRANT Action", () => {
    it("atomically grants all courses in package and logs developer audit event", async () => {
      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(validTargetUser as any);
      vi.mocked(prisma.package.findUnique).mockResolvedValueOnce(validPackage as any);
      vi.mocked(prisma.entitlement.findMany)
        .mockResolvedValueOnce([]) // beforeState
        .mockResolvedValueOnce([
          { courseId: "clrkcrs123456789012345678", state: "ACTIVE", sourceType: "ADMIN" },
          { courseId: "clrkcrs223456789012345678", state: "ACTIVE", sourceType: "ADMIN" },
        ] as any); // afterState
      vi.mocked(prisma.entitlement.upsert).mockResolvedValue({} as any);
      vi.mocked(recordDeveloperAuditEvent).mockResolvedValueOnce({ id: "audit-1" } as any);

      const result = await mutateDeveloperEntitlement(validGrantInput, { actorUserId });

      expect(result.success).toBe(true);
      expect(result.idempotentReplay).toBe(false);
      expect(result.action).toBe("GRANT");
      expect(result.affectedCourses).toEqual([
        "clrkcrs123456789012345678",
        "clrkcrs223456789012345678",
      ]);

      // Upsert was called for each course in the package
      expect(prisma.entitlement.upsert).toHaveBeenCalledTimes(2);
      expect(prisma.entitlement.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId_courseId: {
              userId: validGrantInput.targetUserId,
              courseId: "clrkcrs123456789012345678",
            },
          },
          create: expect.objectContaining({
            userId: validGrantInput.targetUserId,
            courseId: "clrkcrs123456789012345678",
            state: "ACTIVE",
            sourceType: "ADMIN",
            orderId: null,
          }),
        }),
      );

      // Audit event was recorded
      expect(recordDeveloperAuditEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          actorUserId,
          targetUserId: validGrantInput.targetUserId,
          actorKind: "DEVELOPER",
          action: "ENTITLEMENT_GRANT",
          reason: validGrantInput.reason,
          requestId: validGrantInput.requestId,
          result: "SUCCESS",
        }),
        expect.anything(),
      );

      // Invariant: Order table was NEVER touched
      expect(prisma.order.findUnique).not.toHaveBeenCalled();
      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(prisma.order.create).not.toHaveBeenCalled();
    });
  });

  describe("REVOKE Action", () => {
    it("atomically revokes all courses in package and logs developer audit event", async () => {
      const revokeInput = {
        ...validGrantInput,
        action: "REVOKE" as const,
        reason: "Pencabutan akses percobaan sesuai tiket #1234",
      };

      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(validTargetUser as any);
      vi.mocked(prisma.package.findUnique).mockResolvedValueOnce(validPackage as any);
      vi.mocked(prisma.entitlement.findMany)
        .mockResolvedValueOnce([
          { courseId: "clrkcrs123456789012345678", state: "ACTIVE", sourceType: "ADMIN" },
          { courseId: "clrkcrs223456789012345678", state: "ACTIVE", sourceType: "ADMIN" },
        ] as any) // beforeState
        .mockResolvedValueOnce([
          { courseId: "clrkcrs123456789012345678", state: "REVOKED", sourceType: "ADMIN" },
          { courseId: "clrkcrs223456789012345678", state: "REVOKED", sourceType: "ADMIN" },
        ] as any); // afterState
      vi.mocked(prisma.entitlement.updateMany).mockResolvedValue({ count: 1 } as any);
      vi.mocked(recordDeveloperAuditEvent).mockResolvedValueOnce({ id: "audit-2" } as any);

      const result = await mutateDeveloperEntitlement(revokeInput, { actorUserId });

      expect(result.success).toBe(true);
      expect(result.action).toBe("REVOKE");
      expect(result.affectedCourses).toEqual([
        "clrkcrs123456789012345678",
        "clrkcrs223456789012345678",
      ]);

      // updateMany called for each course in package
      expect(prisma.entitlement.updateMany).toHaveBeenCalledTimes(2);
      expect(prisma.entitlement.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: revokeInput.targetUserId,
            courseId: "clrkcrs123456789012345678",
            state: "ACTIVE",
          },
          data: expect.objectContaining({
            state: "REVOKED",
          }),
        }),
      );

      // Audit event was recorded with ENTITLEMENT_REVOKE
      expect(recordDeveloperAuditEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "ENTITLEMENT_REVOKE",
          reason: revokeInput.reason,
        }),
        expect.anything(),
      );

      // Invariant: Order table was NEVER touched
      expect(prisma.order.findUnique).not.toHaveBeenCalled();
      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(prisma.order.create).not.toHaveBeenCalled();
    });
  });

  describe("Security & Validation Constraints", () => {
    it("rejects entitlement mutation when target user has role DEVELOPER", async () => {
      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        ...validTargetUser,
        role: "DEVELOPER",
      } as any);

      await expect(
        mutateDeveloperEntitlement(validGrantInput, { actorUserId }),
      ).rejects.toMatchObject({
        code: "DEVELOPER_TARGET_FORBIDDEN",
        status: 403,
      });

      expect(prisma.entitlement.upsert).not.toHaveBeenCalled();
    });

    it("rejects entitlement mutation when target user is not found", async () => {
      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      await expect(
        mutateDeveloperEntitlement(validGrantInput, { actorUserId }),
      ).rejects.toMatchObject({
        code: "TARGET_NOT_FOUND",
        status: 404,
      });
    });

    it("rejects entitlement mutation when package is not found", async () => {
      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(validTargetUser as any);
      vi.mocked(prisma.package.findUnique).mockResolvedValueOnce(null);

      await expect(
        mutateDeveloperEntitlement(validGrantInput, { actorUserId }),
      ).rejects.toMatchObject({
        code: "PACKAGE_NOT_FOUND",
        status: 404,
      });
    });

    it("rejects entitlement mutation when package has no courses", async () => {
      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(validTargetUser as any);
      vi.mocked(prisma.package.findUnique).mockResolvedValueOnce({
        ...validPackage,
        packageCourses: [],
      } as any);

      await expect(
        mutateDeveloperEntitlement(validGrantInput, { actorUserId }),
      ).rejects.toMatchObject({
        code: "PACKAGE_INACTIVE_OR_EMPTY",
        status: 400,
      });
    });
  });

  describe("Idempotent Replays & Conflict Detection", () => {
    it("returns idempotent replay without re-executing mutations when requestId already processed", async () => {
      const existingAudit = {
        id: "audit-existing-1",
        requestId: validGrantInput.requestId,
        targetUserId: validGrantInput.targetUserId,
        action: "ENTITLEMENT_GRANT",
        result: "SUCCESS",
        beforeState: { packageId: validGrantInput.packageId },
        afterState: {
          packageId: validGrantInput.packageId,
          affectedCourseIds: ["clrkcrs123456789012345678", "clrkcrs223456789012345678"],
        },
      };

      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(existingAudit as any);

      const result = await mutateDeveloperEntitlement(validGrantInput, { actorUserId });

      expect(result.success).toBe(true);
      expect(result.idempotentReplay).toBe(true);
      expect(result.affectedCourses).toEqual([
        "clrkcrs123456789012345678",
        "clrkcrs223456789012345678",
      ]);

      // None of the database mutations should be called on replay
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.package.findUnique).not.toHaveBeenCalled();
      expect(prisma.entitlement.upsert).not.toHaveBeenCalled();
      expect(recordDeveloperAuditEvent).not.toHaveBeenCalled();
    });

    it("throws CONFLICT_DUPLICATE_REQUEST (409) when requestId exists with mismatched payload", async () => {
      const existingAudit = {
        id: "audit-mismatch-1",
        requestId: validGrantInput.requestId,
        targetUserId: "different-user-id", // Mismatched target user!
        action: "ENTITLEMENT_GRANT",
        result: "SUCCESS",
        beforeState: { packageId: validGrantInput.packageId },
        afterState: { packageId: validGrantInput.packageId },
      };

      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(existingAudit as any);

      await expect(
        mutateDeveloperEntitlement(validGrantInput, { actorUserId }),
      ).rejects.toMatchObject({
        code: "CONFLICT_DUPLICATE_REQUEST",
        status: 409,
      });

      expect(prisma.entitlement.upsert).not.toHaveBeenCalled();
    });
  });

  describe("Transaction Integrity", () => {
    it("rolls back and throws if audit logging fails", async () => {
      vi.mocked(prisma.developerAuditEvent.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(validTargetUser as any);
      vi.mocked(prisma.package.findUnique).mockResolvedValueOnce(validPackage as any);
      vi.mocked(prisma.entitlement.findMany)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { courseId: "clrkcrs123456789012345678", state: "ACTIVE", sourceType: "ADMIN" },
        ] as any);
      vi.mocked(prisma.entitlement.upsert).mockResolvedValue({} as any);
      vi.mocked(recordDeveloperAuditEvent).mockRejectedValueOnce(
        new Error("Database write failure for audit log"),
      );

      await expect(
        mutateDeveloperEntitlement(validGrantInput, { actorUserId }),
      ).rejects.toThrow("Database write failure for audit log");
    });
  });
});
