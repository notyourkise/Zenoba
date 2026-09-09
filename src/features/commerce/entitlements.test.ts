import { describe, it, expect, vi } from "vitest";
import {
  resolveCourseAccess,
  getMyLearning,
  getMyPackages,
  getMyOrders,
} from "./entitlements";

describe("entitlements", () => {
  describe("resolveCourseAccess", () => {
    it("returns FREE for free courses without checking entitlements", async () => {
      const mockPrisma = {
        course: {
          findUnique: vi.fn().mockResolvedValue({
            id: "c-free",
            accessTier: "FREE",
          }),
        },
        entitlement: {
          findUnique: vi.fn(),
        },
      };

      const access = await resolveCourseAccess(
        { userId: "user-1", courseId: "c-free" },
        mockPrisma as never,
      );
      expect(access).toBe("FREE");
      expect(mockPrisma.entitlement.findUnique).not.toHaveBeenCalled();
    });

    it("returns ENTITLED for premium course with active entitlement", async () => {
      const mockPrisma = {
        course: {
          findUnique: vi.fn().mockResolvedValue({
            id: "c-prem",
            accessTier: "PREMIUM",
          }),
        },
        entitlement: {
          findUnique: vi.fn().mockResolvedValue({
            state: "ACTIVE",
          }),
        },
      };

      const access = await resolveCourseAccess(
        { userId: "user-1", courseId: "c-prem" },
        mockPrisma as never,
      );
      expect(access).toBe("ENTITLED");
    });

    it("returns DENIED for premium course without active entitlement", async () => {
      const mockPrisma = {
        course: {
          findUnique: vi.fn().mockResolvedValue({
            id: "c-prem",
            accessTier: "PREMIUM",
          }),
        },
        entitlement: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };

      const access = await resolveCourseAccess(
        { userId: "user-1", courseId: "c-prem" },
        mockPrisma as never,
      );
      expect(access).toBe("DENIED");
    });

    it("returns INTERNAL for user with INTERNAL_LEARNER role without checking entitlements", async () => {
      const mockPrisma = {
        course: {
          findUnique: vi.fn().mockResolvedValue({
            id: "c-prem",
            accessTier: "PREMIUM",
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

      const access = await resolveCourseAccess(
        { userId: "user-internal", courseId: "c-prem" },
        mockPrisma as never,
      );
      expect(access).toBe("INTERNAL");
      expect(mockPrisma.entitlement.findUnique).not.toHaveBeenCalled();
    });
  });

  describe("getMyLearning", () => {
    it("always includes free courses and includes entitled premium courses", async () => {
      const mockPrisma = {
        course: {
          findMany: vi.fn().mockResolvedValue([
            { id: "c-1", slug: "networking", title: "Network Foundations", accessTier: "FREE", learningPath: { slug: "network-foundations" } },
          ]),
        },
        entitlement: {
          findMany: vi.fn().mockResolvedValue([
            {
              course: {
                id: "c-2",
                slug: "mikrotik",
                title: "MikroTik Certified",
                accessTier: "PREMIUM",
                learningPath: { slug: "mikrotik-path" },
              },
            },
          ]),
        },
      };

      const learning = await getMyLearning("user-1", mockPrisma as never);
      expect(learning.courses).toHaveLength(2);
      expect(learning.courses.map((c) => c.slug)).toEqual(["networking", "mikrotik"]);
    });

    it("returns all available courses for INTERNAL_LEARNER without requiring entitlements", async () => {
      const mockPrisma = {
        user: {
          findUnique: vi.fn().mockResolvedValue({
            id: "user-internal",
            role: "INTERNAL_LEARNER",
          }),
        },
        course: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: "c-1",
              slug: "networking",
              title: "Network Foundations",
              accessTier: "FREE",
              track: "foundation",
              description: null,
              learningPath: { slug: "network-foundations" },
            },
            {
              id: "c-2",
              slug: "mikrotik",
              title: "MikroTik Certified",
              accessTier: "PREMIUM",
              track: "certification",
              description: "Desc",
              learningPath: { slug: "mikrotik-path" },
            },
          ]),
        },
        entitlement: {
          findMany: vi.fn(),
        },
      };

      const learning = await getMyLearning("user-internal", mockPrisma as never);
      expect(learning.courses).toHaveLength(2);
      expect(learning.courses.map((c) => c.slug)).toEqual(["networking", "mikrotik"]);
      expect(mockPrisma.entitlement.findMany).not.toHaveBeenCalled();
    });
  });

  describe("getMyPackages & getMyOrders owner isolation", () => {
    it("scopes getMyPackages query to current user", async () => {
      const mockPrisma = {
        entitlement: {
          findMany: vi.fn().mockImplementation((args) => {
            expect(args.where.userId).toBe("user-1");
            return Promise.resolve([]);
          }),
        },
      };
      await getMyPackages("user-1", mockPrisma as never);
      expect(mockPrisma.entitlement.findMany).toHaveBeenCalled();
    });

    it("scopes getMyOrders query to current user", async () => {
      const mockPrisma = {
        order: {
          findMany: vi.fn().mockImplementation((args) => {
            expect(args.where.userId).toBe("user-1");
            return Promise.resolve([]);
          }),
        },
      };
      await getMyOrders("user-1", mockPrisma as never);
      expect(mockPrisma.order.findMany).toHaveBeenCalled();
    });
  });
});
