import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getLearningPathsWithProgress,
  getLearningPathDetail,
} from "./queries";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learningPath: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    userLessonProgress: {
      findMany: vi.fn(),
    },
  },
}));

describe("Learning Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLearningPathsWithProgress", () => {
    it("returns paths with computed progress percentage", async () => {
      vi.mocked(prisma.learningPath.findMany).mockResolvedValueOnce([
        {
          id: "path-1",
          slug: "network-foundations",
          title: "Network Foundations",
          description: "Learn network basics",
          icon: "BookOpen",
          orderIndex: 1,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          modules: [
            {
              id: "mod-1",
              pathId: "path-1",
              slug: "welcome",
              title: "Welcome",
              description: "",
              orderIndex: 1,
              published: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              lessons: [{ id: "l-1" }, { id: "l-2" }],
            },
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ]);

      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([
        {
          id: "p-1",
          userId: "user-1",
          lessonId: "l-1",
          status: "COMPLETED",
          completedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await getLearningPathsWithProgress("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("network-foundations");
      expect(result[0].totalLessonsCount).toBe(2);
      expect(result[0].completedLessonsCount).toBe(1);
      expect(result[0].progressPercent).toBe(50);
    });
  });

  describe("getLearningPathDetail", () => {
    it("returns null if path is not found", async () => {
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce(null);

      const result = await getLearningPathDetail("unknown-path");
      expect(result).toBeNull();
    });

    it("resolves module and lesson statuses correctly", async () => {
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
        id: "path-1",
        slug: "network-foundations",
        title: "Network Foundations",
        description: "Learn network basics",
        icon: "BookOpen",
        orderIndex: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        modules: [
          {
            id: "mod-1",
            pathId: "path-1",
            slug: "welcome",
            title: "Welcome",
            description: "Intro module",
            orderIndex: 1,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lessons: [
              {
                id: "l-1",
                moduleId: "mod-1",
                slug: "lesson-1",
                title: "Lesson 1",
                description: "",
                orderIndex: 1,
                xpReward: 50,
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                prerequisites: [],
              },
              {
                id: "l-2",
                moduleId: "mod-1",
                slug: "lesson-2",
                title: "Lesson 2",
                description: "",
                orderIndex: 2,
                xpReward: 50,
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                prerequisites: [
                  {
                    id: "rel-1",
                    lessonId: "l-2",
                    prerequisiteId: "l-1",
                    createdAt: new Date(),
                    prerequisite: {
                      id: "l-1",
                      title: "Lesson 1",
                      slug: "lesson-1",
                      moduleId: "mod-1",
                      description: "",
                      orderIndex: 1,
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
                        orderIndex: 1,
                        published: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // User has not completed any lessons
      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);

      const result = await getLearningPathDetail("network-foundations", "user-1");

      expect(result).not.toBeNull();
      expect(result?.modules[0].lessons[0].status).toBe("AVAILABLE");
      expect(result?.modules[0].lessons[1].status).toBe("LOCKED");
      expect(result?.modules[0].lessons[1].unmetPrerequisites).toHaveLength(1);
    });
  });
});
