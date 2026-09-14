import { prisma } from "@/lib/db/client";
import type { Prisma } from "@/generated/prisma/client";

export type SecurityEventSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "WARN";

export interface RecordSecurityEventInput {
  userId?: string | null;
  type: string;
  severity?: SecurityEventSeverity;
  metadata?: Record<string, unknown> | null;
}

const FORBIDDEN_KEY_PATTERNS = [
  "password",
  "token",
  "secret",
  "hash",
  "cookie",
  "credential",
  "authheader",
  "authorization",
  "backupcode",
  "answer",
  "privkey",
  "privatekey",
];

function isForbiddenKey(key: string): boolean {
  const lower = key.toLowerCase();
  return FORBIDDEN_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Deeply sanitizes metadata records, replacing sensitive credentials and tokens with [REDACTED].
 */
export function sanitizeMetadata(metadata: unknown, maxDepth: number = 5): unknown {
  if (metadata === null || metadata === undefined) {
    return metadata;
  }

  if (typeof metadata !== "object" || maxDepth < 0) {
    return metadata;
  }

  if (Array.isArray(metadata)) {
    return metadata.map((item) => sanitizeMetadata(item, maxDepth - 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata as Record<string, unknown>)) {
    if (isForbiddenKey(key)) {
      result[key] = "[REDACTED]";
    } else if (value !== null && typeof value === "object") {
      result[key] = sanitizeMetadata(value, maxDepth - 1);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Persists a security event with sanitized metadata in a best-effort, non-throwing manner.
 */
export async function recordSecurityEvent(input: RecordSecurityEventInput) {
  try {
    const trimmedType = input.type.trim();
    const severity = (input.severity ?? "INFO").toUpperCase() as SecurityEventSeverity;
    const sanitized = input.metadata ? (sanitizeMetadata(input.metadata) as Record<string, unknown>) : null;

    return await prisma.securityEvent.create({
      data: {
        userId: input.userId ?? null,
        type: trimmedType,
        severity,
        metadata: (sanitized as unknown as Prisma.InputJsonValue) ?? undefined,
      },
    });
  } catch (error) {
    console.error("[SecurityEvent] Failed to persist security event:", error);
    return null;
  }
}

/**
 * Queries security events for developer/security audits, strictly bounded to max 50 records.
 */
export async function getSecurityEvents(options?: {
  userId?: string;
  type?: string;
  limit?: number;
}) {
  const boundedLimit = Math.min(options?.limit ?? 50, 50);

  return await prisma.securityEvent.findMany({
    where: {
      userId: options?.userId,
      type: options?.type,
    },
    take: boundedLimit,
    orderBy: {
      createdAt: "desc",
    },
  });
}
