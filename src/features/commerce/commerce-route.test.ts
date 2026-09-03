import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authLib from "@/lib/auth";
import { POST as createOrderHandler } from "@/app/api/commerce/orders/route";
import { GET as getOrderHandler } from "@/app/api/commerce/orders/[reference]/route";
import { POST as sandboxEventHandler } from "@/app/api/commerce/sandbox/events/route";
import * as ordersService from "@/features/commerce/orders";
import * as paymentsService from "@/features/commerce/payments";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/auth");
vi.mock("@/lib/db/client", () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
    },
  },
}));
vi.mock("@/features/commerce/orders", async () => {
  const actual = await vi.importActual<any>("@/features/commerce/orders");
  return {
    ...actual,
    createPendingOrder: vi.fn(),
  };
});
vi.mock("@/features/commerce/payments");

describe("commerce API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PAYMENT_MODE = "sandbox";
    process.env.SANDBOX_PAYMENT_EVENT_SECRET = "test-sandbox-secret";
  });

  describe("POST /api/commerce/orders", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/commerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageSlug: "cctv-course" }),
      });

      const res = await createOrderHandler(req);
      expect(res.status).toBe(401);
    });

    it("returns 400 on malformed request body", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-1",
        email: "user@example.com",
      });

      const req = new Request("http://localhost:3000/api/commerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invalidField: "test" }),
      });

      const res = await createOrderHandler(req);
      expect(res.status).toBe(400);
    });

    it("returns 400 when package is unavailable or coming soon", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-1",
        email: "user@example.com",
      });
      vi.mocked(ordersService.createPendingOrder).mockRejectedValueOnce(
        new ordersService.OrderError("Package is not available for purchase: cctv-course"),
      );

      const req = new Request("http://localhost:3000/api/commerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug: "cctv-course",
          amount: 500, // Attacker trying to set price
          state: "PAID", // Attacker trying to set state
        }),
      });

      const res = await createOrderHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/Package is not available for purchase/i);
    });

    it("creates pending order with 201 when valid", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-1",
        email: "user@example.com",
      });
      vi.mocked(ordersService.createPendingOrder).mockResolvedValueOnce({
        id: "ord-1",
        reference: "ORD-20260904-TEST01",
        state: "PENDING",
        totalAmountIdr: 150000,
        expiresAt: new Date(),
      });

      const req = new Request("http://localhost:3000/api/commerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageSlug: "mikrotik-available" }),
      });

      const res = await createOrderHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.order.reference).toBe("ORD-20260904-TEST01");
    });
  });

  describe("GET /api/commerce/orders/[reference]", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

      const req = new Request("http://localhost:3000/api/commerce/orders/ORD-123");
      const res = await getOrderHandler(req, { params: Promise.resolve({ reference: "ORD-123" }) });
      expect(res.status).toBe(401);
    });

    it("returns 404 when order belongs to another user (owner scoping)", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-1",
        email: "user1@example.com",
      });
      vi.mocked(prisma.order.findUnique).mockResolvedValueOnce({
        id: "ord-1",
        reference: "ORD-123",
        userId: "user-other", // Different user
      } as any);

      const req = new Request("http://localhost:3000/api/commerce/orders/ORD-123");
      const res = await getOrderHandler(req, { params: Promise.resolve({ reference: "ORD-123" }) });
      expect(res.status).toBe(404);
    });

    it("returns 200 with order details for owner", async () => {
      vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
        id: "user-1",
        email: "user1@example.com",
      });
      vi.mocked(prisma.order.findUnique).mockResolvedValueOnce({
        id: "ord-1",
        reference: "ORD-123",
        userId: "user-1",
        state: "PENDING",
        totalAmountIdr: 150000,
        currency: "IDR",
        package: { title: "MikroTik Package" },
        lines: [],
      } as any);

      const req = new Request("http://localhost:3000/api/commerce/orders/ORD-123");
      const res = await getOrderHandler(req, { params: Promise.resolve({ reference: "ORD-123" }) });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.order.reference).toBe("ORD-123");
    });
  });

  describe("POST /api/commerce/sandbox/events", () => {
    it("returns 401 when bearer secret is invalid or missing", async () => {
      const req = new Request("http://localhost:3000/api/commerce/sandbox/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderReference: "ORD-123" }),
      });

      const res = await sandboxEventHandler(req);
      expect(res.status).toBe(401);
    });

    it("processes event with 200 when secret is valid in non-production", async () => {
      vi.mocked(paymentsService.recordVerifiedPaymentEvent).mockResolvedValueOnce({
        processed: true,
        orderState: "PAID",
        entitlementsGranted: 1,
      });

      const req = new Request("http://localhost:3000/api/commerce/sandbox/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-sandbox-secret",
        },
        body: JSON.stringify({
          providerEventId: "evt-01",
          providerReference: "REF-01",
          orderReference: "ORD-123",
          status: "SUCCESS",
        }),
      });

      const res = await sandboxEventHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.result.orderState).toBe("PAID");
    });
  });
});
