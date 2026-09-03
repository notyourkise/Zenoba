import type {
  CourseInput,
  PackageInput,
  ValidatedPackageDefinition,
} from "./types";

export class CatalogRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogRuleError";
  }
}

/**
 * Validates course availability invariants:
 * - FREE courses must be AVAILABLE (never coming soon or retired in MVP)
 * - PREMIUM courses cannot be AVAILABLE without a published linked learning path
 */
export function validateCourseAvailability(course: CourseInput): void {
  if (course.accessTier === "FREE") {
    if (course.catalogStatus !== "AVAILABLE") {
      throw new CatalogRuleError("FREE course must be AVAILABLE");
    }
    return;
  }

  // PREMIUM course validation
  if (course.catalogStatus === "AVAILABLE") {
    if (!course.learningPathId || course.isLinkedPathPublished !== true) {
      throw new CatalogRuleError(
        "Premium course cannot be AVAILABLE without a published linked learning path",
      );
    }
  }
}

/**
 * Validates package definition invariants:
 * - No FREE course may be included in any commercial package
 * - Single Course package must contain exactly one premium course
 * - Combo package requires at least two premium courses
 * - No duplicate courses allowed within a package
 * - Coming soon packages cannot have a price (amountIdr must be null)
 * - Available packages must have a positive integer IDR amount
 */
export function validatePackageDefinition(
  input: PackageInput,
): ValidatedPackageDefinition {
  if (!input.courses || input.courses.length === 0) {
    throw new CatalogRuleError(
      input.kind === "SINGLE"
        ? "Single Course packages must contain exactly one premium course"
        : "Combo packages require at least two premium courses",
    );
  }

  // Check for free courses
  const hasFreeCourse = input.courses.some(
    (course) => course.accessTier === "FREE",
  );
  if (hasFreeCourse) {
    throw new CatalogRuleError(
      "No FREE course may be included in a commercial package",
    );
  }

  // Check Single Course constraint
  if (input.kind === "SINGLE" && input.courses.length !== 1) {
    throw new CatalogRuleError(
      "Single Course packages must contain exactly one premium course",
    );
  }

  // Check Combo Course constraint
  if (input.kind === "COMBO" && input.courses.length < 2) {
    throw new CatalogRuleError(
      "Combo packages require at least two premium courses",
    );
  }

  // Check duplicate courses
  const slugs = new Set<string>();
  for (const course of input.courses) {
    if (slugs.has(course.slug)) {
      throw new CatalogRuleError(`Duplicate course in package: ${course.slug}`);
    }
    slugs.add(course.slug);
    validateCourseAvailability(course);
  }

  // Check pricing constraints
  if (input.catalogStatus === "COMING_SOON") {
    if (input.amountIdr !== null) {
      throw new CatalogRuleError("Coming soon packages cannot have a price");
    }
  } else if (input.catalogStatus === "AVAILABLE") {
    if (
      input.amountIdr === null ||
      input.amountIdr <= 0 ||
      !Number.isInteger(input.amountIdr)
    ) {
      throw new CatalogRuleError(
        "Available packages must have a positive integer IDR amount",
      );
    }
  }

  return {
    slug: input.slug,
    title: input.title,
    kind: input.kind,
    catalogStatus: input.catalogStatus,
    amountIdr: input.amountIdr,
    courses: input.courses,
  };
}
