import { describe, it, expect } from "vitest";
import {
  validateCourseAvailability,
  validatePackageDefinition,
} from "./catalog-rules";
import type { CourseInput, PackageInput } from "./types";

describe("catalog-rules", () => {
  describe("validateCourseAvailability", () => {
    it("allows valid free Networking course", () => {
      const freeCourse: CourseInput = {
        slug: "networking",
        title: "Network Foundations",
        accessTier: "FREE",
        catalogStatus: "AVAILABLE",
        learningPathId: "path-1",
      };
      expect(() => validateCourseAvailability(freeCourse)).not.toThrow();
    });

    it("allows valid coming-soon premium course without published content", () => {
      const comingSoon: CourseInput = {
        slug: "cctv",
        title: "CCTV & Surveillance",
        accessTier: "PREMIUM",
        catalogStatus: "COMING_SOON",
        learningPathId: null,
      };
      expect(() => validateCourseAvailability(comingSoon)).not.toThrow();
    });

    it("allows valid available premium course with a published linked path", () => {
      const availablePremium: CourseInput = {
        slug: "mikrotik",
        title: "MikroTik Certified",
        accessTier: "PREMIUM",
        catalogStatus: "AVAILABLE",
        learningPathId: "path-mikrotik",
        isLinkedPathPublished: true,
      };
      expect(() => validateCourseAvailability(availablePremium)).not.toThrow();
    });

    it("rejects available premium course without linked learning path or when unpublished", () => {
      expect(() =>
        validateCourseAvailability({
          slug: "cisco",
          title: "Cisco Routing",
          accessTier: "PREMIUM",
          catalogStatus: "AVAILABLE",
          learningPathId: null,
        }),
      ).toThrow(/Premium course cannot be AVAILABLE without a published linked learning path/i);

      expect(() =>
        validateCourseAvailability({
          slug: "cisco",
          title: "Cisco Routing",
          accessTier: "PREMIUM",
          catalogStatus: "AVAILABLE",
          learningPathId: "path-cisco",
          isLinkedPathPublished: false,
        }),
      ).toThrow(/Premium course cannot be AVAILABLE without a published linked learning path/i);
    });

    it("rejects coming soon or retired for a free course", () => {
      expect(() =>
        validateCourseAvailability({
          slug: "networking",
          title: "Networking",
          accessTier: "FREE",
          catalogStatus: "COMING_SOON",
        }),
      ).toThrow(/FREE course must be AVAILABLE/i);
    });
  });

  describe("validatePackageDefinition", () => {
    it("validates a valid SINGLE coming-soon package with null price", () => {
      const pkg: PackageInput = {
        slug: "cctv-single",
        title: "CCTV Single Course",
        kind: "SINGLE",
        catalogStatus: "COMING_SOON",
        amountIdr: null,
        courses: [
          { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
        ],
      };
      const validated = validatePackageDefinition(pkg);
      expect(validated.slug).toBe("cctv-single");
      expect(validated.amountIdr).toBeNull();
    });

    it("validates a valid COMBO coming-soon package with >= 2 premium courses", () => {
      const pkg: PackageInput = {
        slug: "field-infra-bundle",
        title: "Field Infrastructure Bundle",
        kind: "COMBO",
        catalogStatus: "COMING_SOON",
        amountIdr: null,
        courses: [
          { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
          { slug: "fiber-optic", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
        ],
      };
      const validated = validatePackageDefinition(pkg);
      expect(validated.courses).toHaveLength(2);
    });

    it("validates a valid AVAILABLE package with positive integer IDR amount", () => {
      const pkg: PackageInput = {
        slug: "mikrotik-available",
        title: "MikroTik Package",
        kind: "SINGLE",
        catalogStatus: "AVAILABLE",
        amountIdr: 150000,
        courses: [
          {
            slug: "mikrotik",
            accessTier: "PREMIUM",
            catalogStatus: "AVAILABLE",
            learningPathId: "path-mt",
            isLinkedPathPublished: true,
          },
        ],
      };
      const validated = validatePackageDefinition(pkg);
      expect(validated.amountIdr).toBe(150000);
    });

    it("rejects packages containing free courses", () => {
      expect(() =>
        validatePackageDefinition({
          slug: "invalid-free-combo",
          title: "Invalid",
          kind: "COMBO",
          catalogStatus: "COMING_SOON",
          amountIdr: null,
          courses: [
            { slug: "networking", accessTier: "FREE", catalogStatus: "AVAILABLE" },
            { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
          ],
        }),
      ).toThrow(/No FREE course may be included in a commercial package/i);
    });

    it("rejects SINGLE package with more or less than 1 course", () => {
      expect(() =>
        validatePackageDefinition({
          slug: "empty-single",
          title: "Empty Single",
          kind: "SINGLE",
          catalogStatus: "COMING_SOON",
          amountIdr: null,
          courses: [],
        }),
      ).toThrow(/Single Course packages must contain exactly one premium course/i);

      expect(() =>
        validatePackageDefinition({
          slug: "multi-single",
          title: "Multi Single",
          kind: "SINGLE",
          catalogStatus: "COMING_SOON",
          amountIdr: null,
          courses: [
            { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
            { slug: "fiber", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
          ],
        }),
      ).toThrow(/Single Course packages must contain exactly one premium course/i);
    });

    it("rejects COMBO package with less than 2 courses", () => {
      expect(() =>
        validatePackageDefinition({
          slug: "small-combo",
          title: "Small Combo",
          kind: "COMBO",
          catalogStatus: "COMING_SOON",
          amountIdr: null,
          courses: [
            { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
          ],
        }),
      ).toThrow(/Combo packages require at least two premium courses/i);
    });

    it("rejects duplicate courses in a package", () => {
      expect(() =>
        validatePackageDefinition({
          slug: "dup-combo",
          title: "Dup Combo",
          kind: "COMBO",
          catalogStatus: "COMING_SOON",
          amountIdr: null,
          courses: [
            { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
            { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
          ],
        }),
      ).toThrow(/Duplicate course in package/i);
    });

    it("rejects price on COMING_SOON package", () => {
      expect(() =>
        validatePackageDefinition({
          slug: "priced-coming-soon",
          title: "Priced Coming Soon",
          kind: "SINGLE",
          catalogStatus: "COMING_SOON",
          amountIdr: 100000,
          courses: [
            { slug: "cctv", accessTier: "PREMIUM", catalogStatus: "COMING_SOON" },
          ],
        }),
      ).toThrow(/Coming soon packages cannot have a price/i);
    });

    it("rejects missing, negative, or non-integer price on AVAILABLE package", () => {
      expect(() =>
        validatePackageDefinition({
          slug: "unpriced-available",
          title: "Unpriced Available",
          kind: "SINGLE",
          catalogStatus: "AVAILABLE",
          amountIdr: null,
          courses: [
            {
              slug: "mikrotik",
              accessTier: "PREMIUM",
              catalogStatus: "AVAILABLE",
              learningPathId: "path-1",
              isLinkedPathPublished: true,
            },
          ],
        }),
      ).toThrow(/Available packages must have a positive integer IDR amount/i);

      expect(() =>
        validatePackageDefinition({
          slug: "negative-price",
          title: "Negative Price",
          kind: "SINGLE",
          catalogStatus: "AVAILABLE",
          amountIdr: -50000,
          courses: [
            {
              slug: "mikrotik",
              accessTier: "PREMIUM",
              catalogStatus: "AVAILABLE",
              learningPathId: "path-1",
              isLinkedPathPublished: true,
            },
          ],
        }),
      ).toThrow(/Available packages must have a positive integer IDR amount/i);

      expect(() =>
        validatePackageDefinition({
          slug: "float-price",
          title: "Float Price",
          kind: "SINGLE",
          catalogStatus: "AVAILABLE",
          amountIdr: 125000.5,
          courses: [
            {
              slug: "mikrotik",
              accessTier: "PREMIUM",
              catalogStatus: "AVAILABLE",
              learningPathId: "path-1",
              isLinkedPathPublished: true,
            },
          ],
        }),
      ).toThrow(/Available packages must have a positive integer IDR amount/i);
    });
  });
});
