/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db/client";
import { getAvailablePackagesForAccess } from "./queries";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    package: {
      findMany: vi.fn(),
    },
  },
}));

describe("Developer Access Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves available packages and counts courses", async () => {
    vi.mocked(prisma.package.findMany).mockResolvedValueOnce([
      {
        id: "pkg-1",
        slug: "networking-starter",
        title: "Networking Starter Pack",
        kind: "COMBO",
        catalogStatus: "AVAILABLE",
        packageCourses: [{ packageId: "pkg-1", courseId: "c-1" }, { packageId: "pkg-1", courseId: "c-2" }],
      },
      {
        id: "pkg-2",
        slug: "switching-pro",
        title: "Switching Pro",
        kind: "SINGLE",
        catalogStatus: "AVAILABLE",
        packageCourses: [{ packageId: "pkg-2", courseId: "c-1" }],
      },
    ] as any);

    const result = await getAvailablePackagesForAccess();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "pkg-1",
      slug: "networking-starter",
      title: "Networking Starter Pack",
      kind: "COMBO",
      catalogStatus: "AVAILABLE",
      courseCount: 2,
    });
    expect(result[1].courseCount).toBe(1);
    expect(prisma.package.findMany).toHaveBeenCalledWith({
      include: { packageCourses: true },
      orderBy: { orderIndex: "asc" },
    });
  });
});
