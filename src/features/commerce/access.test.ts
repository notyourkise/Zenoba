import { describe, it, expect, vi } from "vitest";
import { requireLearningPathAccess } from "./access";

describe("requireLearningPathAccess", () => {
  it("allows access to free networking path without requiring entitlement", async () => {
    const mockPrisma = {
      learningPath: {
        findUnique: vi.fn().mockResolvedValue({
          id: "path-1",
          slug: "network-foundations",
          commerceCourse: {
            id: "c-net",
            slug: "networking",
            accessTier: "FREE",
          },
        }),
      },
    };

    await expect(
      requireLearningPathAccess(
        { userId: "user-1", pathSlug: "network-foundations" },
        mockPrisma as never,
      ),
    ).resolves.toBeUndefined();
  });

  it("allows access to uncommercialized learning paths", async () => {
    const mockPrisma = {
      learningPath: {
        findUnique: vi.fn().mockResolvedValue({
          id: "path-2",
          slug: "ip-addressing",
          commerceCourse: null,
        }),
      },
    };

    await expect(
      requireLearningPathAccess(
        { userId: "user-1", pathSlug: "ip-addressing" },
        mockPrisma as never,
      ),
    ).resolves.toBeUndefined();
  });

  it("allows access to premium path when user has ACTIVE entitlement", async () => {
    const mockPrisma = {
      learningPath: {
        findUnique: vi.fn().mockResolvedValue({
          id: "path-cctv",
          slug: "cctv-course",
          commerceCourse: {
            id: "c-cctv",
            slug: "cctv",
            accessTier: "PREMIUM",
          },
        }),
      },
      entitlement: {
        findUnique: vi.fn().mockResolvedValue({
          id: "ent-1",
          state: "ACTIVE",
        }),
      },
    };

    await expect(
      requireLearningPathAccess(
        { userId: "user-1", pathSlug: "cctv-course" },
        mockPrisma as never,
      ),
    ).resolves.toBeUndefined();
  });

  it("rejects access to premium path when user lacks active entitlement", async () => {
    const mockPrisma = {
      learningPath: {
        findUnique: vi.fn().mockResolvedValue({
          id: "path-cctv",
          slug: "cctv-course",
          commerceCourse: {
            id: "c-cctv",
            slug: "cctv",
            accessTier: "PREMIUM",
          },
        }),
      },
      entitlement: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      requireLearningPathAccess(
        { userId: "user-1", pathSlug: "cctv-course" },
        mockPrisma as never,
      ),
    ).rejects.toMatchObject({
      code: "COURSE_ACCESS_DENIED",
      message: "Akses kursus premium diperlukan",
    });
  });

  it("allows access to premium path when user has INTERNAL_LEARNER role without active entitlement", async () => {
    const mockPrisma = {
      learningPath: {
        findUnique: vi.fn().mockResolvedValue({
          id: "path-cctv",
          slug: "cctv-course",
          commerceCourse: {
            id: "c-cctv",
            slug: "cctv",
            accessTier: "PREMIUM",
          },
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "user-internal",
          role: "INTERNAL_LEARNER",
        }),
      },
      entitlement: {
        findUnique: vi.fn(),
      },
    };

    await expect(
      requireLearningPathAccess(
        { userId: "user-internal", pathSlug: "cctv-course" },
        mockPrisma as never,
      ),
    ).resolves.toBeUndefined();
    expect(mockPrisma.entitlement.findUnique).not.toHaveBeenCalled();
  });

  it("rejects access to premium path when user has standard LEARNER role and lacks active entitlement", async () => {
    const mockPrisma = {
      learningPath: {
        findUnique: vi.fn().mockResolvedValue({
          id: "path-cctv",
          slug: "cctv-course",
          commerceCourse: {
            id: "c-cctv",
            slug: "cctv",
            accessTier: "PREMIUM",
          },
        }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "user-learner",
          role: "LEARNER",
        }),
      },
      entitlement: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    };

    await expect(
      requireLearningPathAccess(
        { userId: "user-learner", pathSlug: "cctv-course" },
        mockPrisma as never,
      ),
    ).rejects.toMatchObject({
      code: "COURSE_ACCESS_DENIED",
      message: "Akses kursus premium diperlukan",
    });
  });
});
