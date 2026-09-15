import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveLearningDraft,
  getLearningDraft,
  deleteLearningDraft,
  listLessonDrafts,
  DraftPayloadTooLargeError,
  DraftPayloadInvalidError,
} from "./service";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learningDraft: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    userLessonProgress: {
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    userXpLedger: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/client";

const mockDraftUpsert = prisma.learningDraft.upsert as unknown as ReturnType<typeof vi.fn>;
const mockDraftFindUnique = prisma.learningDraft.findUnique as unknown as ReturnType<typeof vi.fn>;
const mockDraftFindMany = prisma.learningDraft.findMany as unknown as ReturnType<typeof vi.fn>;
const mockDraftDeleteMany = prisma.learningDraft.deleteMany as unknown as ReturnType<typeof vi.fn>;

describe("LearningDraft Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveLearningDraft", () => {
    it("saves a valid draft and returns metadata without side effects", async () => {
      const updatedAt = new Date("2026-09-15T10:00:00Z");
      mockDraftUpsert.mockResolvedValue({
        id: "draft-1",
        userId: "user-1",
        lessonId: "lesson-intro",
        activityId: "activity-concept",
        contentVersion: "1.0",
        payload: { answers: { pc: "endpoint", cable: "media" } },
        updatedAt,
        createdAt: updatedAt,
      });

      const result = await saveLearningDraft({
        userId: "user-1",
        lessonId: "lesson-intro",
        activityId: "activity-concept",
        contentVersion: "1.0",
        payload: { answers: { pc: "endpoint", cable: "media" } },
      });

      expect(result.success).toBe(true);
      expect(result.activityId).toBe("activity-concept");
      expect(result.updatedAt).toEqual(updatedAt);

      // Verify Prisma upsert was called with composite key
      expect(mockDraftUpsert).toHaveBeenCalledWith({
        where: {
          userId_lessonId_activityId: {
            userId: "user-1",
            lessonId: "lesson-intro",
            activityId: "activity-concept",
          },
        },
        update: {
          payload: { answers: { pc: "endpoint", cable: "media" } },
          contentVersion: "1.0",
        },
        create: {
          userId: "user-1",
          lessonId: "lesson-intro",
          activityId: "activity-concept",
          contentVersion: "1.0",
          payload: { answers: { pc: "endpoint", cable: "media" } },
        },
      });

      // Strict guarantee: NO progress or XP side effects
      expect(prisma.userLessonProgress.create).not.toHaveBeenCalled();
      expect(prisma.userLessonProgress.update).not.toHaveBeenCalled();
      expect(prisma.userLessonProgress.upsert).not.toHaveBeenCalled();
      expect(prisma.userXpLedger.create).not.toHaveBeenCalled();
    });

    it("rejects payload exceeding 64KB with DraftPayloadTooLargeError", async () => {
      // 65 KB string
      const largeData = "x".repeat(65 * 1024);

      await expect(
        saveLearningDraft({
          userId: "user-1",
          lessonId: "lesson-intro",
          activityId: "activity-large",
          payload: { data: largeData },
        })
      ).rejects.toThrow(DraftPayloadTooLargeError);

      expect(mockDraftUpsert).not.toHaveBeenCalled();
    });

    it("rejects payload containing forbidden keys like password or secret", async () => {
      await expect(
        saveLearningDraft({
          userId: "user-1",
          lessonId: "lesson-intro",
          activityId: "activity-bad",
          payload: { secret: "leaked_secret" },
        })
      ).rejects.toThrow(DraftPayloadInvalidError);

      await expect(
        saveLearningDraft({
          userId: "user-1",
          lessonId: "lesson-intro",
          activityId: "activity-bad",
          payload: { answerKey: { q1: "correct" } },
        })
      ).rejects.toThrow(DraftPayloadInvalidError);

      expect(mockDraftUpsert).not.toHaveBeenCalled();
    });

    it("rejects payload containing script injection", async () => {
      await expect(
        saveLearningDraft({
          userId: "user-1",
          lessonId: "lesson-intro",
          activityId: "activity-xss",
          payload: { text: "<script>alert('xss')</script>" },
        })
      ).rejects.toThrow(DraftPayloadInvalidError);

      expect(mockDraftUpsert).not.toHaveBeenCalled();
    });

    it("throws error for missing required identifiers", async () => {
      await expect(
        saveLearningDraft({
          userId: "",
          lessonId: "lesson-intro",
          activityId: "act-1",
          payload: {},
        })
      ).rejects.toThrow(DraftPayloadInvalidError);

      await expect(
        saveLearningDraft({
          userId: "user-1",
          lessonId: "",
          activityId: "act-1",
          payload: {},
        })
      ).rejects.toThrow(DraftPayloadInvalidError);
    });
  });

  describe("getLearningDraft", () => {
    it("returns draft when found for authenticated user", async () => {
      mockDraftFindUnique.mockResolvedValue({
        id: "draft-1",
        userId: "user-1",
        lessonId: "lesson-intro",
        activityId: "act-1",
        contentVersion: "1.0",
        payload: { count: 42 },
        updatedAt: new Date("2026-09-15T10:00:00Z"),
      });

      const draft = await getLearningDraft({
        userId: "user-1",
        lessonId: "lesson-intro",
        activityId: "act-1",
      });

      expect(draft).not.toBeNull();
      expect(draft?.payload).toEqual({ count: 42 });
      expect(mockDraftFindUnique).toHaveBeenCalledWith({
        where: {
          userId_lessonId_activityId: {
            userId: "user-1",
            lessonId: "lesson-intro",
            activityId: "act-1",
          },
        },
      });
    });

    it("returns null when draft does not exist", async () => {
      mockDraftFindUnique.mockResolvedValue(null);

      const draft = await getLearningDraft({
        userId: "user-1",
        lessonId: "lesson-intro",
        activityId: "non-existent",
      });

      expect(draft).toBeNull();
    });
  });

  describe("deleteLearningDraft", () => {
    it("deletes draft scoped by user, lesson, and activity", async () => {
      mockDraftDeleteMany.mockResolvedValue({ count: 1 });

      const result = await deleteLearningDraft({
        userId: "user-1",
        lessonId: "lesson-intro",
        activityId: "act-1",
      });

      expect(result.deleted).toBe(true);
      expect(mockDraftDeleteMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          lessonId: "lesson-intro",
          activityId: "act-1",
        },
      });
    });
  });

  describe("listLessonDrafts", () => {
    it("returns all drafts for a lesson belonging to the user", async () => {
      mockDraftFindMany.mockResolvedValue([
        {
          id: "draft-1",
          activityId: "act-1",
          payload: { opt: 1 },
          contentVersion: "1.0",
          updatedAt: new Date(),
        },
        {
          id: "draft-2",
          activityId: "act-2",
          payload: { opt: 2 },
          contentVersion: "1.0",
          updatedAt: new Date(),
        },
      ]);

      const drafts = await listLessonDrafts({
        userId: "user-1",
        lessonId: "lesson-intro",
      });

      expect(drafts).toHaveLength(2);
      expect(mockDraftFindMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          lessonId: "lesson-intro",
        },
        orderBy: { updatedAt: "desc" },
      });
    });
  });
});
