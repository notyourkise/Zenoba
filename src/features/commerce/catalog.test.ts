import { describe, it, expect, vi } from "vitest";
import { getCatalogForLearner } from "./catalog";

describe("getCatalogForLearner", () => {
  it("returns catalog view with free networking and coming soon premium courses", async () => {
    const mockPrisma = {
      course: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "c-1",
            slug: "networking",
            title: "Network Foundations",
            track: "networking",
            accessTier: "FREE",
            catalogStatus: "AVAILABLE",
            description: "Desc networking",
            orderIndex: 1,
            learningPathId: "path-1",
          },
          {
            id: "c-2",
            slug: "cctv",
            title: "CCTV & Video Surveillance",
            track: "cctv",
            accessTier: "PREMIUM",
            catalogStatus: "COMING_SOON",
            description: "Desc cctv",
            orderIndex: 2,
            learningPathId: null,
          },
        ]),
      },
      package: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "pkg-1",
            slug: "field-infrastructure-bundle",
            title: "Field Infrastructure Bundle",
            kind: "COMBO",
            catalogStatus: "COMING_SOON",
            description: "Bundle desc",
            amountIdr: null,
            currency: "IDR",
            orderIndex: 1,
            packageCourses: [
              { course: { slug: "cctv", title: "CCTV" } },
            ],
          },
        ]),
      },
      entitlement: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const catalog = await getCatalogForLearner("user-1", mockPrisma as never);

    expect(catalog.courses).toHaveLength(2);
    const freeCourse = catalog.courses.find((c) => c.slug === "networking");
    expect(freeCourse).toBeDefined();
    expect(freeCourse?.accessLabel).toBe("Gratis");
    expect(freeCourse?.priceLabel).toBe("Gratis");
    expect(freeCourse?.canCheckout).toBe(false);

    const cctv = catalog.courses.find((c) => c.slug === "cctv");
    expect(cctv).toBeDefined();
    expect(cctv?.accessLabel).toBe("Premium");
    expect(cctv?.availabilityLabel).toBe("Coming soon");
    expect(cctv?.priceLabel).toBe("Price announced at launch");
    expect(cctv?.canCheckout).toBe(false);

    expect(catalog.packages).toHaveLength(1);
    const bundle = catalog.packages[0];
    expect(bundle.availabilityLabel).toBe("Coming soon");
    expect(bundle.priceLabel).toBe("Price announced at launch");
    expect(bundle.canCheckout).toBe(false);
  });
});
