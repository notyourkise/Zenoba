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
        mockPrisma as any,
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
        mockPrisma as any,
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
        mockPrisma as any,
      );
      expect(access).toBe("DENIED");
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

      const learning = await getMyLearning("user-1", mockPrisma as any);
      expect(learning.courses).toHaveLength(2);
      expect(learning.courses.map((c) => c.slug)).toEqual(["networking", "mikrotik"]);
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
      await getMyPackages("user-1", mockPrisma as any);
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
      await getMyOrders("user-1", mockPrisma as any);
      expect(mockPrisma.order.findMany).toHaveBeenCalled();
    });
  });
});
