import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  startLessonProgress,
  completeLessonProgress,
  getUserProgressSummary,
} from "./progress";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    lesson: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    userLessonProgress: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

describe("Progress Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("startLessonProgress", () => {
    it("throws error if lesson does not exist", async () => {
      vi.mocked(prisma.lesson.findUnique).mockResolvedValueOnce(null);

      await expect(
        startLessonProgress("user-1", "non-existent")
      ).rejects.toThrow("Lesson not found");
    });

    it("throws error if lesson is locked due to missing prerequisite", async () => {
      vi.mocked(prisma.lesson.findUnique).mockResolvedValueOnce({
        id: "lesson-2",
        moduleId: "mod-1",
        slug: "lesson-2",
        title: "Lesson 2",
        description: "",
        orderIndex: 1,
        xpReward: 50,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        prerequisites: [
          {
            id: "rel-1",
            lessonId: "lesson-2",
            prerequisiteId: "lesson-1",
            createdAt: new Date(),
            prerequisite: {
              id: "lesson-1",
              title: "Lesson 1",
              slug: "lesson-1",
              moduleId: "mod-1",
              description: "",
              orderIndex: 0,
              xpReward: 50,
              published: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              module: {
                id: "mod-1",
                pathId: "path-1",
                slug: "welcome",
                title: "Welcome",
                description: "",
                orderIndex: 0,
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          },
        ],
        userProgress: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // User has 0 completed lessons
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);

      await expect(
        startLessonProgress("user-1", "lesson-2")
      ).rejects.toThrow("Cannot start a locked lesson");
    });

    it("successfully transitions AVAILABLE to IN_PROGRESS", async () => {
      vi.mocked(prisma.lesson.findUnique).mockResolvedValueOnce({
        id: "lesson-1",
        moduleId: "mod-1",
        slug: "lesson-1",
        title: "Lesson 1",
        description: "",
        orderIndex: 0,
        xpReward: 50,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        prerequisites: [],
        userProgress: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.userLessonProgress.upsert).mockResolvedValueOnce({
        id: "prog-1",
        userId: "user-1",
        lessonId: "lesson-1",
        status: "IN_PROGRESS",
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await startLessonProgress("user-1", "lesson-1");
      expect(result.status).toBe("IN_PROGRESS");
    });
  });

  describe("completeLessonProgress", () => {
    it("completes lesson and awards XP on first completion", async () => {
      vi.mocked(prisma.lesson.findUnique).mockResolvedValueOnce({
        id: "lesson-1",
        xpReward: 100,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      vi.mocked(prisma.userLessonProgress.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.userLessonProgress.upsert).mockResolvedValueOnce({
        id: "prog-1",
        userId: "user-1",
        lessonId: "lesson-1",
        status: "COMPLETED",
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await completeLessonProgress("user-1", "lesson-1");
      expect(result.status).toBe("COMPLETED");
      expect(result.xpAwarded).toBe(100);
    });

    it("is idempotent and does not award duplicate XP on repeat completion", async () => {
      vi.mocked(prisma.lesson.findUnique).mockResolvedValueOnce({
        id: "lesson-1",
        xpReward: 100,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      vi.mocked(prisma.userLessonProgress.findUnique).mockResolvedValueOnce({
        id: "prog-1",
        userId: "user-1",
        lessonId: "lesson-1",
        status: "COMPLETED",
        completedAt: new Date("2026-08-25T10:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.userLessonProgress.upsert).mockResolvedValueOnce({
        id: "prog-1",
        userId: "user-1",
        lessonId: "lesson-1",
        status: "COMPLETED",
        completedAt: new Date("2026-08-25T10:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await completeLessonProgress("user-1", "lesson-1");
      expect(result.status).toBe("COMPLETED");
      expect(result.xpAwarded).toBe(0);
    });
  });

  describe("getUserProgressSummary", () => {
    it("calculates summary statistics correctly", async () => {
      vi.mocked(prisma.lesson.count).mockResolvedValueOnce(10);
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "IN_PROGRESS" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);

      const summary = await getUserProgressSummary("user-1");
      expect(summary.totalLessons).toBe(10);
      expect(summary.completedCount).toBe(2);
      expect(summary.inProgressCount).toBe(1);
      expect(summary.completionPercentage).toBe(20);
    });
  });
});
