import { prisma } from "@/lib/db/client";

export const MAX_DRAFT_PAYLOAD_BYTES = 64 * 1024; // 64 KB

export class DraftPayloadTooLargeError extends Error {
  constructor(message = "Draft payload melebihi batas maksimum 64 KB.") {
    super(message);
    this.name = "DraftPayloadTooLargeError";
  }
}

export class DraftPayloadInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DraftPayloadInvalidError";
  }
}

export class DraftUnauthorizedError extends Error {
  constructor(message = "Tidak memiliki akses ke draf ini.") {
    super(message);
    this.name = "DraftUnauthorizedError";
  }
}

const FORBIDDEN_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /answerkey/i,
  /correctanswer/i,
  /gradingkey/i,
];

function validatePayloadContent(val: unknown): void {
  if (val === undefined || val === null) return;

  if (typeof val === "string") {
    if (/<script\b/i.test(val) || /javascript:/i.test(val)) {
      throw new DraftPayloadInvalidError("Payload mengandung skrip yang tidak diizinkan.");
    }
    return;
  }

  if (typeof val === "object") {
    if (Array.isArray(val)) {
      for (const item of val) {
        validatePayloadContent(item);
      }
      return;
    }

    for (const [key, propVal] of Object.entries(val as Record<string, unknown>)) {
      for (const pattern of FORBIDDEN_KEY_PATTERNS) {
        if (pattern.test(key)) {
          throw new DraftPayloadInvalidError(
            `Kunci '${key}' tidak diizinkan disimpan di draf.`
          );
        }
      }
      validatePayloadContent(propVal);
    }
  }
}

export interface SaveDraftParams {
  userId: string;
  lessonId: string;
  activityId: string;
  contentVersion?: string;
  payload: unknown;
}

export interface SaveDraftResult {
  success: boolean;
  activityId: string;
  updatedAt: Date;
}

/**
 * Saves or updates a learner's in-progress exercise draft.
 *
 * Guarantees:
 * 1. Strictly isolated by authenticated userId.
 * 2. Hard limit of 64KB per draft payload.
 * 3. Sanitized against dangerous scripts and secrets.
 * 4. Zero progress, XP, or assessment side-effects.
 */
export async function saveLearningDraft(
  params: SaveDraftParams
): Promise<SaveDraftResult> {
  const { userId, lessonId, activityId, contentVersion = "1.0", payload } = params;

  if (!userId || typeof userId !== "string" || !userId.trim()) {
    throw new DraftPayloadInvalidError("User ID wajib diisi.");
  }
  if (!lessonId || typeof lessonId !== "string" || !lessonId.trim()) {
    throw new DraftPayloadInvalidError("Lesson ID wajib diisi.");
  }
  if (!activityId || typeof activityId !== "string" || !activityId.trim()) {
    throw new DraftPayloadInvalidError("Activity ID wajib diisi.");
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(payload);
  } catch {
    throw new DraftPayloadInvalidError("Payload harus berupa data JSON serializable.");
  }

  const byteLength = Buffer.byteLength(serialized, "utf8");
  if (byteLength > MAX_DRAFT_PAYLOAD_BYTES) {
    throw new DraftPayloadTooLargeError(
      `Ukuran payload draf (${byteLength} bytes) melebihi batas 64 KB.`
    );
  }

  validatePayloadContent(payload);

  const record = await prisma.learningDraft.upsert({
    where: {
      userId_lessonId_activityId: {
        userId,
        lessonId,
        activityId,
      },
    },
    update: {
      payload: payload as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      contentVersion,
    },
    create: {
      userId,
      lessonId,
      activityId,
      contentVersion,
      payload: payload as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    },
  });

  return {
    success: true,
    activityId: record.activityId,
    updatedAt: record.updatedAt,
  };
}

export interface GetDraftParams {
  userId: string;
  lessonId: string;
  activityId: string;
}

/**
 * Retrieves a learner's draft strictly isolated by authenticated userId.
 */
export async function getLearningDraft(params: GetDraftParams) {
  const { userId, lessonId, activityId } = params;
  if (!userId || !lessonId || !activityId) return null;

  return prisma.learningDraft.findUnique({
    where: {
      userId_lessonId_activityId: {
        userId,
        lessonId,
        activityId,
      },
    },
  });
}

export interface DeleteDraftParams {
  userId: string;
  lessonId: string;
  activityId: string;
}

/**
 * Deletes a learner's draft upon authoritative submission or manual reset.
 */
export async function deleteLearningDraft(params: DeleteDraftParams) {
  const { userId, lessonId, activityId } = params;
  if (!userId || !lessonId || !activityId) return { deleted: false };

  const result = await prisma.learningDraft.deleteMany({
    where: {
      userId,
      lessonId,
      activityId,
    },
  });

  return { deleted: result.count > 0 };
}

export interface ListLessonDraftsParams {
  userId: string;
  lessonId: string;
}

/**
 * Lists all drafts for a given lesson belonging to the learner.
 */
export async function listLessonDrafts(params: ListLessonDraftsParams) {
  const { userId, lessonId } = params;
  if (!userId || !lessonId) return [];

  return prisma.learningDraft.findMany({
    where: {
      userId,
      lessonId,
    },
    orderBy: { updatedAt: "desc" },
  });
}
