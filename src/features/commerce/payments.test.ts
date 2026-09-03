import { describe, it, expect, vi } from "vitest";
import { recordVerifiedPaymentEvent } from "./payments";

describe("payments", () => {
  describe("recordVerifiedPaymentEvent", () => {
    it("transitions PENDING order to PAID and grants entitlements for all courses in package", async () => {
      let createdEntitlements: any[] = [];
      const mockOrder = {
        id: "ord-1",
        reference: "ORD-TEST-123",
        userId: "user-1",
        state: "PENDING",
        package: {
          packageCourses: [
            { course: { id: "c-1", slug: "cctv" } },
            { course: { id: "c-2", slug: "fiber" } },
          ],
        },
        paymentAttempts: [{ id: "att-1" }],
      };

      const mockPrisma = {
        paymentEvent: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
        order: {
          findUnique: vi.fn().mockResolvedValue(mockOrder),
        },
        $transaction: vi.fn().mockImplementation(async (callback) => {
          return callback({
            paymentEvent: {
              create: vi.fn().mockResolvedValue({ id: "evt-1" }),
            },
            paymentAttempt: {
              update: vi.fn().mockResolvedValue({}),
            },
            order: {
              update: vi.fn().mockResolvedValue({ ...mockOrder, state: "PAID" }),
            },
            entitlement: {
              upsert: vi.fn().mockImplementation((args) => {
                createdEntitlements.push(args);
                return Promise.resolve(args);
              }),
            },
          });
        }),
      };

      const result = await recordVerifiedPaymentEvent(
        {
          provider: "SANDBOX",
          providerEventId: "evt-sandbox-01",
          providerReference: "REF-SB-01",
          orderReference: "ORD-TEST-123",
          status: "SUCCESS",
        },
        mockPrisma as any,
      );

      expect(result.processed).toBe(true);
      expect(result.orderState).toBe("PAID");
      expect(result.entitlementsGranted).toBe(2);
      expect(createdEntitlements).toHaveLength(2);
    });

    it("handles replayed event idempotently without duplicating grants", async () => {
      const mockPrisma = {
        paymentEvent: {
          findUnique: vi.fn().mockResolvedValue({
            id: "evt-1",
            providerEventId: "evt-sandbox-01",
            processedAt: new Date(),
          }),
        },
      };

      const result = await recordVerifiedPaymentEvent(
        {
          provider: "SANDBOX",
          providerEventId: "evt-sandbox-01",
          providerReference: "REF-SB-01",
          orderReference: "ORD-TEST-123",
          status: "SUCCESS",
        },
        mockPrisma as any,
      );

      expect(result.processed).toBe(false);
      expect(result.alreadyProcessed).toBe(true);
      expect(result.entitlementsGranted).toBe(0);
    });

    it("rejects transition if order is already PAID", async () => {
      const mockOrder = {
        id: "ord-1",
        reference: "ORD-TEST-123",
        userId: "user-1",
        state: "PAID",
      };

      const mockPrisma = {
        paymentEvent: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
        order: {
          findUnique: vi.fn().mockResolvedValue(mockOrder),
        },
      };

      const result = await recordVerifiedPaymentEvent(
        {
          provider: "SANDBOX",
          providerEventId: "evt-new-02",
          providerReference: "REF-SB-02",
          orderReference: "ORD-TEST-123",
          status: "SUCCESS",
        },
        mockPrisma as any,
      );

      expect(result.processed).toBe(false);
      expect(result.orderState).toBe("PAID");
      expect(result.entitlementsGranted).toBe(0);
    });
  });
});
