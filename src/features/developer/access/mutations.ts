import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { recordDeveloperAuditEvent } from "@/features/developer/audit/service";

export const EntitlementMutationSchema = z.object({
  action: z.enum(["GRANT", "REVOKE"]),
  targetUserId: z.string().cuid({ message: "targetUserId must be a valid CUID" }),
  packageId: z.string().cuid({ message: "packageId must be a valid CUID" }),
  reason: z
    .string()
    .trim()
    .min(12, "Alasan tertulis wajib diisi minimal 12 karakter")
    .max(1000, "Alasan tidak boleh melebihi 1000 karakter"),
  requestId: z.string().uuid({ message: "requestId must be a valid UUID" }),
});

export type EntitlementMutationInput = z.infer<typeof EntitlementMutationSchema>;

export class EntitlementMutationError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "EntitlementMutationError";
    this.code = code;
    this.status = status;
  }
}

export interface MutateEntitlementOptions {
  actorUserId: string;
}

export interface EntitlementMutationResult {
  success: boolean;
  idempotentReplay: boolean;
  action: "GRANT" | "REVOKE";
  targetUserId: string;
  packageId: string;
  affectedCourses: string[];
}

/**
 * Atomically grants or revokes package course entitlements for a learner.
 * Enforces:
 * - Elevated developer session via caller guard
 * - Mandatory written reason (min 12 chars)
 * - Request ID deduplication and idempotent replays
 * - Developer target forbidden
 * - Immutable developer audit event with before/after state snapshots
 * - Preserves all order history (Order table is never touched)
 */
export async function mutateDeveloperEntitlement(
  input: EntitlementMutationInput,
  options: MutateEntitlementOptions,
): Promise<EntitlementMutationResult> {
  const validated = EntitlementMutationSchema.parse(input);

  return await prisma.$transaction(async (tx) => {
    // 1. Idempotent Replay Check
    const existingAudit = await tx.developerAuditEvent.findUnique({
      where: { requestId: validated.requestId },
    });

    if (existingAudit) {
      const expectedAction = validated.action === "GRANT" ? "ENTITLEMENT_GRANT" : "ENTITLEMENT_REVOKE";
      const beforeState = existingAudit.beforeState as Record<string, unknown> | null;
      const afterState = existingAudit.afterState as Record<string, unknown> | null;

      const matchesPayload =
        existingAudit.action === expectedAction &&
        existingAudit.targetUserId === validated.targetUserId &&
        existingAudit.result === "SUCCESS" &&
        (beforeState?.packageId === validated.packageId || afterState?.packageId === validated.packageId);

      if (matchesPayload) {
        return {
          success: true,
          idempotentReplay: true,
          action: validated.action,
          targetUserId: validated.targetUserId,
          packageId: validated.packageId,
          affectedCourses: (afterState?.affectedCourseIds as string[]) ?? [],
        };
      }

      throw new EntitlementMutationError(
        "CONFLICT_DUPLICATE_REQUEST",
        `Request ID '${validated.requestId}' already exists with a different payload or outcome.`,
        409,
      );
    }

    // 2. Validate Target User
    const targetUser = await tx.user.findUnique({
      where: { id: validated.targetUserId },
    });

    if (!targetUser) {
      throw new EntitlementMutationError(
        "TARGET_NOT_FOUND",
        `Pengguna target dengan ID '${validated.targetUserId}' tidak ditemukan.`,
        404,
      );
    }

    if (targetUser.role === "DEVELOPER") {
      throw new EntitlementMutationError(
        "DEVELOPER_TARGET_FORBIDDEN",
        "Mutasi hak akses manual dilarang untuk akun dengan peran DEVELOPER.",
        403,
      );
    }

    // 3. Validate Package and Courses
    const pkg = await tx.package.findUnique({
      where: { id: validated.packageId },
      include: {
        packageCourses: {
          include: {
            course: true,
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    if (!pkg) {
      throw new EntitlementMutationError(
        "PACKAGE_NOT_FOUND",
        `Paket dengan ID '${validated.packageId}' tidak ditemukan.`,
        404,
      );
    }

    if (pkg.packageCourses.length === 0) {
      throw new EntitlementMutationError(
        "PACKAGE_INACTIVE_OR_EMPTY",
        `Paket '${pkg.title}' tidak memiliki kursus aktif untuk diberikan atau dicabut.`,
        400,
      );
    }

    const affectedCourseIds = pkg.packageCourses.map((pc) => pc.courseId);

    // 4. Capture Before State
    const existingEntitlements = await tx.entitlement.findMany({
      where: {
        userId: validated.targetUserId,
        courseId: { in: affectedCourseIds },
      },
    });

    const beforeState = {
      targetUserId: validated.targetUserId,
      packageId: validated.packageId,
      packageTitle: pkg.title,
      entitlements: existingEntitlements.map((e) => ({
        courseId: e.courseId,
        state: e.state,
        sourceType: e.sourceType,
      })),
    };

    // 5. Apply Mutations
    const now = new Date();
    if (validated.action === "GRANT") {
      for (const courseId of affectedCourseIds) {
        await tx.entitlement.upsert({
          where: {
            userId_courseId: {
              userId: validated.targetUserId,
              courseId,
            },
          },
          create: {
            userId: validated.targetUserId,
            courseId,
            state: "ACTIVE",
            sourceType: "ADMIN",
            orderId: null,
            grantedAt: now,
            revokedAt: null,
          },
          update: {
            state: "ACTIVE",
            sourceType: "ADMIN",
            revokedAt: null,
          },
        });
      }
    } else {
      for (const courseId of affectedCourseIds) {
        await tx.entitlement.updateMany({
          where: {
            userId: validated.targetUserId,
            courseId,
            state: "ACTIVE",
          },
          data: {
            state: "REVOKED",
            revokedAt: now,
          },
        });
      }
    }

    // 6. Capture After State
    const updatedEntitlements = await tx.entitlement.findMany({
      where: {
        userId: validated.targetUserId,
        courseId: { in: affectedCourseIds },
      },
    });

    const afterState = {
      targetUserId: validated.targetUserId,
      packageId: validated.packageId,
      packageTitle: pkg.title,
      affectedCourseIds,
      entitlements: updatedEntitlements.map((e) => ({
        courseId: e.courseId,
        state: e.state,
        sourceType: e.sourceType,
      })),
    };

    // 7. Record Immutable Audit Event
    await recordDeveloperAuditEvent(
      {
        actorUserId: options.actorUserId,
        targetUserId: validated.targetUserId,
        actorKind: "DEVELOPER",
        action: validated.action === "GRANT" ? "ENTITLEMENT_GRANT" : "ENTITLEMENT_REVOKE",
        reason: validated.reason,
        requestId: validated.requestId,
        correlationId: validated.requestId,
        beforeState: beforeState as Record<string, unknown>,
        afterState: afterState as Record<string, unknown>,
        result: "SUCCESS",
      },
      tx as unknown as typeof prisma,
    );

    return {
      success: true,
      idempotentReplay: false,
      action: validated.action,
      targetUserId: validated.targetUserId,
      packageId: validated.packageId,
      affectedCourses: affectedCourseIds,
    };
  });
}
