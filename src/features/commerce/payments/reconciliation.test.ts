import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reconcileMidtransOrder } from "./reconciliation";
import * as paymentsModule from "../payments";
import * as securityEventsModule from "@/features/security/events";

describe("reconcileMidtransOrder", () => {
  const prevEnv = { ...process.env };

  beforeEach(() => {
    process.env.PAYMENT_MODE = "sandbox";
    process.env.MIDTRANS_SERVER_KEY = "SB-Mid-server-TESTKEY123456";
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...prevEnv };
    vi.restoreAllMocks();
  });

  it("reports no action needed when local order state matches remote status", async () => {
    const mockOrder = {
      id: "ord-1",
      reference: "ORD-MATCH-01",
      userId: "user-1",
      state: "PAID",
      totalAmountIdr: 150000,
    };

    const mockPrisma = {
      order: {
        findUnique: vi.fn().mockResolvedValue(mockOrder),
      },
    };

    const mockGateway = {
      provider: "MIDTRANS" as const,
      createCheckout: vi.fn(),
      verifyEvent: vi.fn(),
      getOrderStatus: vi.fn().mockResolvedValue({
        status_code: "200",
        transaction_id: "trx-001",
        order_id: "ORD-MATCH-01",
        gross_amount: "150000.00",
        transaction_status: "settlement",
      }),
    };

    vi.spyOn(paymentsModule, "getPaymentGateway").mockReturnValue(mockGateway as never);

    const result = await reconcileMidtransOrder({
      orderReference: "ORD-MATCH-01",
      prisma: mockPrisma as never,
    });

    expect(result.actionNeeded).toBe(false);
    expect(result.actionTaken).toBe("NONE");
    expect(result.localOrderState).toBe("PAID");
    expect(result.remoteTransactionStatus).toBe("settlement");
  });

  it("detects discrepancy in dry-run mode without mutating order", async () => {
    const mockOrder = {
      id: "ord-2",
      reference: "ORD-DISCREPANT-01",
      userId: "user-1",
      state: "PENDING",
      totalAmountIdr: 150000,
    };

    const mockPrisma = {
      order: {
        findUnique: vi.fn().mockResolvedValue(mockOrder),
      },
    };

    const mockGateway = {
      provider: "MIDTRANS" as const,
      createCheckout: vi.fn(),
      verifyEvent: vi.fn(),
      getOrderStatus: vi.fn().mockResolvedValue({
        status_code: "200",
        transaction_id: "trx-002",
        order_id: "ORD-DISCREPANT-01",
        gross_amount: "150000.00",
        transaction_status: "settlement",
      }),
    };

    vi.spyOn(paymentsModule, "getPaymentGateway").mockReturnValue(mockGateway as never);
    const recordPaymentSpy = vi.spyOn(paymentsModule, "recordVerifiedPaymentEvent");

    const result = await reconcileMidtransOrder({
      orderReference: "ORD-DISCREPANT-01",
      repair: false,
      prisma: mockPrisma as never,
    });

    expect(result.actionNeeded).toBe(true);
    expect(result.actionTaken).toBe("REPAIR_REQUIRED");
    expect(result.localOrderState).toBe("PENDING");
    expect(result.remoteTransactionStatus).toBe("settlement");
    expect(recordPaymentSpy).not.toHaveBeenCalled();
  });

  it("throws error in repair mode if reason is omitted or too short", async () => {
    const mockOrder = {
      id: "ord-3",
      reference: "ORD-REPAIR-01",
      userId: "user-1",
      state: "PENDING",
      totalAmountIdr: 150000,
    };

    const mockPrisma = {
      order: {
        findUnique: vi.fn().mockResolvedValue(mockOrder),
      },
    };

    const mockGateway = {
      provider: "MIDTRANS" as const,
      createCheckout: vi.fn(),
      verifyEvent: vi.fn(),
      getOrderStatus: vi.fn().mockResolvedValue({
        status_code: "200",
        transaction_id: "trx-003",
        order_id: "ORD-REPAIR-01",
        gross_amount: "150000.00",
        transaction_status: "settlement",
      }),
    };

    vi.spyOn(paymentsModule, "getPaymentGateway").mockReturnValue(mockGateway as never);

    await expect(
      reconcileMidtransOrder({
        orderReference: "ORD-REPAIR-01",
        repair: true,
        reason: "short",
        prisma: mockPrisma as never,
      }),
    ).rejects.toThrow("Repair mode requires an explicit justification reason");
  });

  it("executes repair when repair is true and valid reason is provided", async () => {
    const mockOrder = {
      id: "ord-4",
      reference: "ORD-REPAIR-02",
      userId: "user-1",
      state: "PENDING",
      totalAmountIdr: 150000,
    };

    const mockPrisma = {
      order: {
        findUnique: vi.fn().mockResolvedValue(mockOrder),
      },
    };

    const mockGateway = {
      provider: "MIDTRANS" as const,
      createCheckout: vi.fn(),
      verifyEvent: vi.fn(),
      getOrderStatus: vi.fn().mockResolvedValue({
        status_code: "200",
        transaction_id: "trx-004",
        order_id: "ORD-REPAIR-02",
        gross_amount: "150000.00",
        transaction_status: "settlement",
      }),
    };

    vi.spyOn(paymentsModule, "getPaymentGateway").mockReturnValue(mockGateway as never);

    const recordPaymentSpy = vi
      .spyOn(paymentsModule, "recordVerifiedPaymentEvent")
      .mockResolvedValue({
        processed: true,
        orderState: "PAID",
        entitlementsGranted: 2,
      });

    const recordSecurityEventSpy = vi
      .spyOn(securityEventsModule, "recordSecurityEvent")
      .mockResolvedValue(null as never);

    const result = await reconcileMidtransOrder({
      orderReference: "ORD-REPAIR-02",
      repair: true,
      reason: "Manual reconciliation after webhook timeout in staging test",
      prisma: mockPrisma as never,
    });

    expect(result.actionNeeded).toBe(true);
    expect(result.actionTaken).toBe("REPAIRED");
    expect(recordPaymentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "MIDTRANS",
        orderReference: "ORD-REPAIR-02",
        status: "SUCCESS",
      }),
      mockPrisma,
    );

    expect(recordSecurityEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "COMMERCE_RECONCILIATION_REPAIR",
        severity: "WARN",
      }),
    );
  });
});
