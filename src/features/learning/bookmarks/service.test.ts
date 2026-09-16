import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  toggleBookmark,
  isLessonBookmarked,
  getUserBookmarks,
} from "./service";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    lessonBookmark: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
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
    assessmentAttempt: {
      create: vi.fn(),
    },
  },
}));

vi.mock("../queries", () => ({
  getCurriculumGraph: vi.fn(),
}));

import { prisma } from "@/lib/db/client";
import { getCurriculumGraph } from "../queries";

const mockBookmarkFindUnique = prisma.lessonBookmark.findUnique as unknown as ReturnType<typeof vi.fn>;
const mockBookmarkFindMany = prisma.lessonBookmark.findMany as unknown as ReturnType<typeof vi.fn>;
const mockBookmarkCreate = prisma.lessonBookmark.create as unknown as ReturnType<typeof vi.fn>;
const mockBookmarkDeleteMany = prisma.lessonBookmark.deleteMany as unknown as ReturnType<typeof vi.fn>;
const mockGetCurriculumGraph = getCurriculumGraph as unknown as ReturnType<typeof vi.fn>;

describe("LessonBookmark Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("toggleBookmark", () => {
    it("creates a bookmark when it does not already exist", async () => {
      mockBookmarkFindUnique.mockResolvedValue(null);
      mockBookmarkCreate.mockResolvedValue({
        id: "bm-1",
        userId: "user-1",
        lessonId: "les-1",
        createdAt: new Date(),
      });

      const result = await toggleBookmark("user-1", "les-1");

      expect(result).toEqual({ bookmarked: true, bookmarkId: "bm-1" });
      expect(mockBookmarkCreate).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          lessonId: "les-1",
        },
      });

      // Strict non-interference
      expect(prisma.userLessonProgress.create).not.toHaveBeenCalled();
      expect(prisma.userXpLedger.create).not.toHaveBeenCalled();
    });

    it("removes a bookmark when it already exists", async () => {
      mockBookmarkFindUnique.mockResolvedValue({
        id: "bm-1",
        userId: "user-1",
        lessonId: "les-1",
        createdAt: new Date(),
      });
      mockBookmarkDeleteMany.mockResolvedValue({ count: 1 });

      const result = await toggleBookmark("user-1", "les-1");

      expect(result).toEqual({ bookmarked: false });
      expect(mockBookmarkDeleteMany).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          lessonId: "les-1",
        },
      });
    });

    it("rejects invalid input without mutating database", async () => {
      await expect(toggleBookmark("", "les-1")).rejects.toThrow();
      await expect(toggleBookmark("user-1", "")).rejects.toThrow();
      expect(mockBookmarkCreate).not.toHaveBeenCalled();
      expect(mockBookmarkDeleteMany).not.toHaveBeenCalled();
    });
  });

  describe("isLessonBookmarked", () => {
    it("returns true if bookmark exists for user and lesson", async () => {
      mockBookmarkFindUnique.mockResolvedValue({
        id: "bm-1",
        userId: "user-1",
        lessonId: "les-1",
      });

      const result = await isLessonBookmarked("user-1", "les-1");
      expect(result).toBe(true);
      expect(mockBookmarkFindUnique).toHaveBeenCalledWith({
        where: {
          userId_lessonId: {
            userId: "user-1",
            lessonId: "les-1",
          },
        },
      });
    });

    it("returns false if bookmark does not exist", async () => {
      mockBookmarkFindUnique.mockResolvedValue(null);

      const result = await isLessonBookmarked("user-1", "les-2");
      expect(result).toBe(false);
    });

    it("returns false for falsy user or lesson ID", async () => {
      expect(await isLessonBookmarked("", "les-1")).toBe(false);
      expect(await isLessonBookmarked("user-1", "")).toBe(false);
      expect(mockBookmarkFindUnique).not.toHaveBeenCalled();
    });
  });

  describe("getUserBookmarks", () => {
    it("returns bookmarks mapped to curriculum lesson details", async () => {
      const createdAt = new Date("2026-09-16T10:00:00Z");
      mockBookmarkFindMany.mockResolvedValue([
        { id: "bm-1", userId: "user-1", lessonId: "l-1", createdAt },
      ]);

      mockGetCurriculumGraph.mockResolvedValue({
        paths: [
          {
            id: "p-1",
            slug: "network-fundamentals",
            title: "Network Fundamentals",
            orderIndex: 0,
            modules: [
              {
                id: "m-1",
                slug: "intro-networking",
                title: "Pengenalan Jaringan",
                orderIndex: 0,
                lessons: [
                  {
                    id: "l-1",
                    slug: "what-is-a-network",
                    title: "Apa Itu Jaringan Komputer?",
                    orderIndex: 0,
                  },
                ],
              },
            ],
          },
        ],
      });

      const results = await getUserBookmarks("user-1");

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        id: "bm-1",
        lessonId: "l-1",
        createdAt,
        isStale: false,
        lesson: {
          title: "Apa Itu Jaringan Komputer?",
          slug: "what-is-a-network",
          moduleSlug: "intro-networking",
          moduleTitle: "Pengenalan Jaringan",
          pathSlug: "network-fundamentals",
          pathTitle: "Network Fundamentals",
          href: "/learn/network-fundamentals/intro-networking/what-is-a-network",
        },
      });
    });

    it("handles stale or unresolvable lesson IDs gracefully without throwing", async () => {
      const createdAt = new Date("2026-09-16T10:00:00Z");
      mockBookmarkFindMany.mockResolvedValue([
        { id: "bm-deleted", userId: "user-1", lessonId: "l-non-existent", createdAt },
      ]);

      mockGetCurriculumGraph.mockResolvedValue({
        paths: [],
      });

      const results = await getUserBookmarks("user-1");

      expect(results).toHaveLength(1);
      expect(results[0].isStale).toBe(true);
      expect(results[0].lesson).toBeNull();
    });
  });
});
