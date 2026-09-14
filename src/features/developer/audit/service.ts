import { prisma } from "@/lib/db/client";
import { sanitizeMetadata } from "@/features/security/events";
import type { Prisma } from "@/generated/prisma/client";

export type AuditActionResult = "SUCCESS" | "FAILURE" | "REJECTED";

export class DuplicateAuditRequestConflictError extends Error {
  constructor(message: string = "Mismatched duplicate audit request ID") {
    super(message);
    this.name = "DuplicateAuditRequestConflictError";
  }
}

export interface RecordDeveloperAuditEventInput {
  actorUserId?: string | null;
  targetUserId?: string | null;
  actorKind: string;
  action: string;
  reason?: string | null;
  requestId: string;
  correlationId: string;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  result: AuditActionResult;
}

/**
 * Sanitizes audit state snapshots to ensure no credentials or sensitive tokens are stored.
 */
export function sanitizeAuditState(state: unknown): unknown {
  return sanitizeMetadata(state);
}

type DatabaseClient = typeof prisma;

/**
 * Persists an immutable developer audit event with request deduplication and safe state redaction.
 */
export async function recordDeveloperAuditEvent(
  input: RecordDeveloperAuditEventInput,
  tx?: DatabaseClient,
) {
  const db = tx ?? prisma;

  // Check for existing event with the same requestId to guarantee idempotency
  const existing = await db.developerAuditEvent.findUnique({
    where: { requestId: input.requestId },
  });

  if (existing) {
    const isMatchingReplay =
      existing.action === input.action &&
      existing.targetUserId === (input.targetUserId ?? null) &&
      existing.actorUserId === (input.actorUserId ?? null) &&
      existing.result === input.result;

    if (isMatchingReplay) {
      return {
        ...existing,
        idempotentReplay: true,
      };
    }

    throw new DuplicateAuditRequestConflictError(
      `Audit request ID '${input.requestId}' already exists with different payload or outcome.`,
    );
  }

  const sanitizedBefore = input.beforeState ? sanitizeAuditState(input.beforeState) : null;
  const sanitizedAfter = input.afterState ? sanitizeAuditState(input.afterState) : null;

  const created = await db.developerAuditEvent.create({
    data: {
      actorUserId: input.actorUserId ?? null,
      targetUserId: input.targetUserId ?? null,
      actorKind: input.actorKind,
      action: input.action,
      reason: input.reason?.trim() ?? null,
      requestId: input.requestId,
      correlationId: input.correlationId,
      beforeState: (sanitizedBefore as unknown as Prisma.InputJsonValue) ?? undefined,
      afterState: (sanitizedAfter as unknown as Prisma.InputJsonValue) ?? undefined,
      result: input.result,
    },
  });

  return {
    ...created,
    idempotentReplay: false,
  };
}

/**
 * Queries developer audit records, bounded to a maximum of 50 items.
 */
export async function getDeveloperAuditEvents(options?: {
  actorUserId?: string;
  targetUserId?: string;
  action?: string;
  limit?: number;
}) {
  const boundedLimit = Math.min(options?.limit ?? 50, 50);

  return await prisma.developerAuditEvent.findMany({
    where: {
      ...(options?.actorUserId ? { actorUserId: options.actorUserId } : {}),
      ...(options?.targetUserId ? { targetUserId: options.targetUserId } : {}),
      ...(options?.action ? { action: options.action } : {}),
    },
    take: boundedLimit,
    orderBy: {
      createdAt: "desc",
    },
  });
}
