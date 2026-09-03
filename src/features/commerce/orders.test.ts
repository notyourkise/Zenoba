import { describe, it, expect, vi } from "vitest";
import { createPendingOrder } from "./orders";

describe("orders", () => {
  describe("createPendingOrder", () => {
    it("creates a pending order with server-determined price snapshot for available package", async () => {
      const mockPrisma = {
        package: {
          findUnique: vi.fn().mockResolvedValue({
            id: "pkg-avail",
            slug: "mikrotik-available",
            title: "MikroTik Package",
            kind: "SINGLE",
            catalogStatus: "AVAILABLE",
            amountIdr: 150000,
            currency: "IDR",
            packageCourses: [
              {
                course: {
                  id: "c-mt",
                  slug: "mikrotik",
                  title: "MikroTik MTCNA",
                },
              },
            ],
          }),
        },
        $transaction: vi.fn().mockImplementation(async (callback) => {
          return callback({
            order: {
              create: vi.fn().mockResolvedValue({
                id: "ord-1",
                reference: "ORD-20260904-TEST01",
                userId: "user-1",
                packageId: "pkg-avail",
                state: "PENDING",
                totalAmountIdr: 150000,
                expiresAt: new Date(Date.now() + 86400000),
              }),
            },
            orderLine: {
              create: vi.fn().mockResolvedValue({}),
            },
            paymentAttempt: {
              create: vi.fn().mockResolvedValue({ id: "att-1" }),
            },
          });
        }),
      };

      const result = await createPendingOrder(
        { userId: "user-1", packageSlug: "mikrotik-available" },
        mockPrisma as never,
      );

      expect(result.state).toBe("PENDING");
      expect(result.reference).toMatch(/^ORD-/);
      expect(result.expiresAt).toBeDefined();
    });

    it("rejects order creation for COMING_SOON package", async () => {
      const mockPrisma = {
        package: {
          findUnique: vi.fn().mockResolvedValue({
            id: "pkg-cs",
            slug: "cctv-course",
            title: "CCTV Course",
            catalogStatus: "COMING_SOON",
            amountIdr: null,
          }),
        },
      };

      await expect(
        createPendingOrder(
          { userId: "user-1", packageSlug: "cctv-course" },
          mockPrisma as never,
        ),
      ).rejects.toThrow(/Package is not available for purchase/i);
    });

    it("rejects order creation for non-existent package", async () => {
      const mockPrisma = {
        package: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };

      await expect(
        createPendingOrder(
          { userId: "user-1", packageSlug: "unknown-package" },
          mockPrisma as never,
        ),
      ).rejects.toThrow(/Package not found/i);
    });
  });
});
