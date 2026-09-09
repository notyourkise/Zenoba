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
    entitlement: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
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

    it("attaches curriculum module outcomes and finalAssessment for welcome-to-networking", async () => {
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
            id: "mod-welcome",
            pathId: "path-1",
            slug: "welcome-to-networking",
            title: "Welcome to Networking",
            description: "Fondasi awal jaringan",
            orderIndex: 1,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lessons: [
              {
                id: "l-intro",
                slug: "intro-to-networking",
                title: "Apa Itu Jaringan Komputer?",
                description: "",
                orderIndex: 1,
                xpReward: 50,
                content: null,
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                prerequisites: [],
              },
            ],
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);

      const result = await getLearningPathDetail("network-foundations", "user-1");

      expect(result).not.toBeNull();
      const welcomeMod = result!.modules[0];
      expect(welcomeMod.outcomes).toBeDefined();
      expect(welcomeMod.outcomes!.length).toBeGreaterThanOrEqual(4);
      expect(welcomeMod.finalAssessment).toBeDefined();
      expect(welcomeMod.finalAssessment?.assessmentId).toBe("assessment-welcome-final");
      expect(welcomeMod.lessons[0].outcomes).toBeDefined();
      expect(welcomeMod.lessons[0].outcomes![0].id).toBe("WN-L1-A");
      expect(welcomeMod.lessons[0].content).not.toBeNull();
    });

    it("throws CourseAccessDeniedError when path is linked to a premium course and user is unentitled", async () => {
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
        id: "path-cctv",
        slug: "cctv-course",
        title: "CCTV Course",
        published: true,
        commerceCourse: {
          id: "c-cctv",
          accessTier: "PREMIUM",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      vi.mocked(prisma.entitlement.findUnique).mockResolvedValueOnce(null);

      await expect(
        getLearningPathDetail("cctv-course", "user-1"),
      ).rejects.toMatchObject({
        code: "COURSE_ACCESS_DENIED",
      });
    });

    it("allows access to premium path when user has INTERNAL_LEARNER role without entitlement", async () => {
      vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
        id: "path-cctv",
        slug: "cctv-course",
        title: "CCTV Course",
        published: true,
        commerceCourse: {
          id: "c-cctv",
          accessTier: "PREMIUM",
        },
        modules: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.entitlement.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: "user-internal",
        role: "INTERNAL_LEARNER",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getLearningPathDetail("cctv-course", "user-internal");
      expect(result).not.toBeNull();
      expect(result?.id).toBe("path-cctv");
    });
  });
});
