import { describe, it, expect, vi } from "vitest";
import { seedCommerceCatalog, INITIAL_COURSES, INITIAL_PACKAGES } from "../../../prisma/commerce-seed";

describe("catalog-seed", () => {
  it("defines the free networking course and 7 coming soon premium courses", () => {
    const networking = INITIAL_COURSES.find((c) => c.slug === "networking");
    expect(networking).toBeDefined();
    expect(networking?.accessTier).toBe("FREE");
    expect(networking?.catalogStatus).toBe("AVAILABLE");

    const premiumCourses = INITIAL_COURSES.filter((c) => c.accessTier === "PREMIUM");
    expect(premiumCourses).toHaveLength(7);
    for (const c of premiumCourses) {
      expect(c.catalogStatus).toBe("COMING_SOON");
    }

    const slugs = INITIAL_COURSES.map((c) => c.slug);
    expect(slugs).toContain("cctv");
    expect(slugs).toContain("fiber-optic");
    expect(slugs).toContain("voip");
    expect(slugs).toContain("mikrotik");
    expect(slugs).toContain("cisco");
    expect(slugs).toContain("linux-server");
    expect(slugs).toContain("security");
  });

  it("defines 7 single packages and 3 combo packages, all COMING_SOON without price", () => {
    const singles = INITIAL_PACKAGES.filter((p) => p.kind === "SINGLE");
    expect(singles).toHaveLength(7);

    const combos = INITIAL_PACKAGES.filter((p) => p.kind === "COMBO");
    expect(combos).toHaveLength(3);

    const comboSlugs = combos.map((c) => c.slug);
    expect(comboSlugs).toEqual([
      "field-infrastructure-bundle",
      "network-operations-bundle",
      "secure-connectivity-bundle",
    ]);

    for (const p of INITIAL_PACKAGES) {
      expect(p.catalogStatus).toBe("COMING_SOON");
      expect(p.amountIdr).toBeNull();
    }
  });

  it("seeds the database idempotently via mock prisma", async () => {
    const mockPrisma = {
      course: {
        upsert: vi.fn().mockImplementation((args) => Promise.resolve({ id: `id-${args.where.slug}`, ...args.create })),
        findUnique: vi.fn(),
      },
      package: {
        upsert: vi.fn().mockImplementation((args) => Promise.resolve({ id: `id-${args.where.slug}`, ...args.create })),
      },
      packageCourse: {
        upsert: vi.fn().mockResolvedValue({}),
      },
    };

    await seedCommerceCatalog(mockPrisma as never);

    expect(mockPrisma.course.upsert).toHaveBeenCalledTimes(INITIAL_COURSES.length);
    expect(mockPrisma.package.upsert).toHaveBeenCalledTimes(INITIAL_PACKAGES.length);
  });
});
