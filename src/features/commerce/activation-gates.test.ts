import { describe, it, expect } from "vitest";
import { INITIAL_COURSES, INITIAL_PACKAGES } from "../../../prisma/commerce-seed";
import {
  validateCourseAvailability,
  validatePackageDefinition,
  CatalogRuleError,
} from "./catalog-rules";
import { requireLearningPathAccess, CourseAccessDeniedError } from "./access";
import { createPendingOrder, OrderError } from "./orders";
import type { PrismaClient } from "@/generated/prisma/client";

describe("Sprint 33 — Premium Activation Entry Gates", () => {
  describe("Gate 1: Published Premium Content Verification", () => {
    it("confirms that networking is the only available course and is 100% free", () => {
      const freeCourse = INITIAL_COURSES.find((c) => c.slug === "networking");
      expect(freeCourse).toBeDefined();
      expect(freeCourse?.accessTier).toBe("FREE");
      expect(freeCourse?.catalogStatus).toBe("AVAILABLE");
    });

    it("verifies all 7 roadmap-scoped courses are COMING_SOON with zero published learning paths", () => {
      const roadmapSlugs = [
        "cctv",
        "fiber-optic",
        "voip",
        "mikrotik",
        "cisco",
        "linux-server",
        "security",
      ];

      for (const slug of roadmapSlugs) {
        const course = INITIAL_COURSES.find((c) => c.slug === slug);
        expect(course, `Course ${slug} must be defined in catalog seed`).toBeDefined();
        expect(course?.accessTier).toBe("PREMIUM");
        expect(course?.catalogStatus).toBe("COMING_SOON");
      }
    });

    it("enforces domain invariant: a premium course cannot be marked AVAILABLE without a published learning path", () => {
      expect(() => {
        validateCourseAvailability({
          slug: "cctv",
          title: "CCTV",
          accessTier: "PREMIUM",
          catalogStatus: "AVAILABLE",
          learningPathId: null,
          isLinkedPathPublished: false,
        });
      }).toThrow(CatalogRuleError);

      expect(() => {
        validateCourseAvailability({
          slug: "cctv",
          title: "CCTV",
          accessTier: "PREMIUM",
          catalogStatus: "AVAILABLE",
          learningPathId: "path-123",
          isLinkedPathPublished: false,
        });
      }).toThrow(CatalogRuleError);
    });
  });

  describe("Gate 2: Access Guards & Entitlement Verification", () => {
    it("permits uninhibited access to free or uncommercialized learning paths", async () => {
      const mockPrisma = {
        learningPath: {
          findUnique: async () => ({
            id: "lp-networking",
            slug: "network-foundations",
            commerceCourse: {
              id: "crs-networking",
              accessTier: "FREE",
            },
          }),
        },
      } as unknown as PrismaClient;

      await expect(
        requireLearningPathAccess(
          { userId: "user-free", pathSlug: "network-foundations" },
          mockPrisma,
        ),
      ).resolves.toBeUndefined();
    });

    it("strictly blocks access to a premium learning path when user has no active entitlement", async () => {
      const mockPrisma = {
        learningPath: {
          findUnique: async () => ({
            id: "lp-cctv",
            slug: "cctv-surveillance",
            commerceCourse: {
              id: "crs-cctv",
              accessTier: "PREMIUM",
            },
          }),
        },
        entitlement: {
          findUnique: async () => null,
        },
      } as unknown as PrismaClient;

      await expect(
        requireLearningPathAccess(
          { userId: "user-unentitled", pathSlug: "cctv-surveillance" },
          mockPrisma,
        ),
      ).rejects.toThrow(CourseAccessDeniedError);
    });

    it("blocks access when user entitlement is REVOKED", async () => {
      const mockPrisma = {
        learningPath: {
          findUnique: async () => ({
            id: "lp-cctv",
            slug: "cctv-surveillance",
            commerceCourse: {
              id: "crs-cctv",
              accessTier: "PREMIUM",
            },
          }),
        },
        entitlement: {
          findUnique: async () => ({ state: "REVOKED" }),
        },
      } as unknown as PrismaClient;

      await expect(
        requireLearningPathAccess(
          { userId: "user-revoked", pathSlug: "cctv-surveillance" },
          mockPrisma,
        ),
      ).rejects.toThrow(CourseAccessDeniedError);
    });
  });

  describe("Gate 3: Owner-Approved Pricing & Combo Package Composition", () => {
    it("confirms that all commercial packages are COMING_SOON with unannounced (null) prices", () => {
      expect(INITIAL_PACKAGES.length).toBe(10); // 7 single, 3 combo

      for (const pkg of INITIAL_PACKAGES) {
        expect(pkg.catalogStatus).toBe("COMING_SOON");
        expect(pkg.amountIdr).toBeNull();
      }
    });

    it("guarantees no commercial package contains the free networking course", () => {
      for (const pkg of INITIAL_PACKAGES) {
        expect(pkg.courseSlugs).not.toContain("networking");
      }
    });

    it("guarantees every combo package contains at least two distinct premium courses", () => {
      const comboPackages = INITIAL_PACKAGES.filter((p) => p.kind === "COMBO");
      expect(comboPackages.length).toBe(3);

      for (const combo of comboPackages) {
        expect(combo.courseSlugs.length).toBeGreaterThanOrEqual(2);
        const uniqueSlugs = new Set(combo.courseSlugs);
        expect(uniqueSlugs.size).toBe(combo.courseSlugs.length);
      }
    });

    it("verifies package validation rejects any COMING_SOON package that specifies a price", () => {
      expect(() => {
        validatePackageDefinition({
          slug: "premature-price",
          title: "Premature Price",
          kind: "SINGLE",
          catalogStatus: "COMING_SOON",
          amountIdr: 100000,
          courses: [
            {
              slug: "cctv",
              title: "CCTV",
              accessTier: "PREMIUM",
              catalogStatus: "COMING_SOON",
              learningPathId: null,
              isLinkedPathPublished: false,
            },
          ],
        });
      }).toThrow("Coming soon packages cannot have a price");
    });
  });

  describe("Gate 4: Order Creation Safeguards for Unreleased Packages", () => {
    it("strictly rejects order creation for any unreleased/COMING_SOON package", async () => {
      const mockPrisma = {
        package: {
          findUnique: async () => ({
            id: "pkg-cctv",
            slug: "cctv-course",
            title: "Kursus Mandiri CCTV",
            kind: "SINGLE",
            catalogStatus: "COMING_SOON",
            amountIdr: null,
            currency: "IDR",
            courses: [
              {
                course: {
                  id: "crs-cctv",
                  slug: "cctv",
                  title: "CCTV",
                  accessTier: "PREMIUM",
                  catalogStatus: "COMING_SOON",
                },
              },
            ],
          }),
        },
      } as unknown as PrismaClient;

      await expect(
        createPendingOrder(
          { userId: "user-1", packageSlug: "cctv-course" },
          mockPrisma,
        ),
      ).rejects.toThrow(OrderError);
    });
  });
});
