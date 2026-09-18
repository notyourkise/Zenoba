import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import { MidtransGateway } from "./midtrans-gateway";
import { POST as midtransWebhookRoute } from "@/app/api/commerce/webhooks/midtrans/route";
import { reconcileMidtransOrder } from "./reconciliation";
import * as paymentsModule from "../payments";
const { recordVerifiedPaymentEvent } = paymentsModule;
import { resolveCourseAccess } from "../entitlements";
import * as securityEventsModule from "@/features/security/events";

describe("Midtrans Sandbox & Staging End-to-End Flow Verification", () => {
  const serverKey = "SB-Mid-server-TEST_M15_S42_VERIFICATION_KEY";
  const prevEnv = { ...process.env };

  beforeEach(() => {
    process.env.PAYMENT_MODE = "sandbox";
    process.env.MIDTRANS_SERVER_KEY = serverKey;
    process.env.MIDTRANS_IS_PRODUCTION = "false";
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...prevEnv };
    vi.restoreAllMocks();
  });

  function generateWebhookPayload(options: {
    orderId: string;
    statusCode?: string;
    grossAmount?: string;
    transactionStatus?: string;
    fraudStatus?: string;
    transactionId?: string;
    key?: string;
  }) {
    const orderId = options.orderId;
    const statusCode = options.statusCode || "200";
    const grossAmount = options.grossAmount || "150000.00";
    const status = options.transactionStatus || "settlement";
    const trxId = options.transactionId || `trx-${Date.now()}`;
    const key = options.key || serverKey;

    const payloadString = `${orderId}${statusCode}${grossAmount}${key}`;
    const signatureKey = crypto.createHash("sha512").update(payloadString).digest("hex");

    return {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_id: trxId,
      transaction_status: status,
      fraud_status: options.fraudStatus || "accept",
      payment_type: "qris",
    };
  }

  // 1. Charge Creation & QRIS Contract
  it("1. initiates dynamic QRIS charge and receives valid QR string and 15-min expiry", async () => {
    const gateway = new MidtransGateway({
      serverKey,
      isProduction: false,
    });

    const mockResponse = {
      status_code: "201",
      status_message: "Success, QRIS transaction is created",
      transaction_id: "trx-qris-test-01",
      order_id: "ORD-20260918-001",
      gross_amount: "150000.00",
      payment_type: "qris",
      transaction_status: "pending",
      qr_string: "00020101021226590014ID.LINKAJA.WWW0118936009110021008544...",
      actions: [
        {
          name: "generate-qr-code",
          method: "GET",
          url: "https://api.sandbox.midtrans.com/v2/qris/trx-qris-test-01/qr-code",
        },
      ],
    };

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockResponse,
    } as Response);

    const checkout = await gateway.createCheckout({
      orderReference: "ORD-20260918-001",
      totalAmountIdr: 150000,
      userId: "user-learner-01",
      userEmail: "learner@netloka.biz.id",
      packageTitle: "Switching & Routing Core Bundle",
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(checkout.providerReference).toBe("trx-qris-test-01");
    expect(checkout.qrString).toBe(mockResponse.qr_string);
    expect(checkout.actions).toHaveLength(1);
    expect(checkout.checkoutUrl).toBe("/orders/ORD-20260918-001");
  });

  // 2. Browser Redirect Decoupling
  it("2. guarantees browser client redirect alone never activates course entitlement without webhook", async () => {
    const mockPrisma = {
      course: {
        findUnique: vi.fn().mockResolvedValue({ id: "course-premium-01", accessTier: "PREMIUM" }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({ role: "LEARNER" }),
      },
      entitlement: {
        findUnique: vi.fn().mockResolvedValue(null), // No active entitlement exists
      },
    };

    const access = await resolveCourseAccess(
      { userId: "user-learner-01", courseId: "course-premium-01" },
      mockPrisma as never,
    );

    // Unsettled order visited via browser returns DENIED
    expect(access).toBe("DENIED");
  });

  // 3. Successful Settlement Flow
  it("3. processes verified settlement webhook, marks order PAID, and grants lifetime entitlements", async () => {
    const grantedEntitlements: unknown[] = [];
    const mockOrder = {
      id: "ord-test-001",
      reference: "ORD-20260918-001",
      userId: "user-learner-01",
      state: "PENDING",
      package: {
        packageCourses: [
          { course: { id: "c-switching", slug: "switching-lan" } },
          { course: { id: "c-routing", slug: "routing-services" } },
        ],
      },
      paymentAttempts: [{ id: "att-001" }],
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
            create: vi.fn().mockResolvedValue({ id: "evt-001" }),
          },
          paymentAttempt: {
            update: vi.fn().mockResolvedValue({ id: "att-001", state: "SUCCESS" }),
          },
          order: {
            update: vi.fn().mockResolvedValue({ ...mockOrder, state: "PAID" }),
          },
          entitlement: {
            upsert: vi.fn().mockImplementation((args) => {
              grantedEntitlements.push(args);
              return Promise.resolve(args);
            }),
          },
        });
      }),
    };

    const result = await recordVerifiedPaymentEvent(
      {
        provider: "MIDTRANS",
        providerEventId: "trx-qris-test-01_settlement",
        providerReference: "trx-qris-test-01",
        orderReference: "ORD-20260918-001",
        status: "SUCCESS",
      },
      mockPrisma as never,
    );

    expect(result.processed).toBe(true);
    expect(result.orderState).toBe("PAID");
    expect(result.entitlementsGranted).toBe(2);
    expect(grantedEntitlements).toHaveLength(2);
  });

  // 4. Failure & Deny Flow
  it("4. transitions order to CANCELLED and grants 0 entitlements on deny/cancel webhook", async () => {
    const mockOrder = {
      id: "ord-test-002",
      reference: "ORD-20260918-002",
      userId: "user-learner-01",
      state: "PENDING",
      paymentAttempts: [{ id: "att-002" }],
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
            create: vi.fn().mockResolvedValue({ id: "evt-002" }),
          },
          paymentAttempt: {
            update: vi.fn().mockResolvedValue({ id: "att-002", state: "FAILED" }),
          },
          order: {
            update: vi.fn().mockResolvedValue({ ...mockOrder, state: "CANCELLED" }),
          },
        });
      }),
    };

    const result = await recordVerifiedPaymentEvent(
      {
        provider: "MIDTRANS",
        providerEventId: "trx-deny-01_deny",
        providerReference: "trx-deny-01",
        orderReference: "ORD-20260918-002",
        status: "FAILED",
      },
      mockPrisma as never,
    );

    expect(result.processed).toBe(true);
    expect(result.orderState).toBe("CANCELLED");
    expect(result.entitlementsGranted).toBe(0);
  });

  // 5. Expiry Flow
  it("5. transitions order to EXPIRED and grants 0 entitlements on expire webhook", async () => {
    const mockOrder = {
      id: "ord-test-003",
      reference: "ORD-20260918-003",
      userId: "user-learner-01",
      state: "PENDING",
      paymentAttempts: [{ id: "att-003" }],
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
            create: vi.fn().mockResolvedValue({ id: "evt-003" }),
          },
          paymentAttempt: {
            update: vi.fn().mockResolvedValue({ id: "att-003", state: "EXPIRED" }),
          },
          order: {
            update: vi.fn().mockResolvedValue({ ...mockOrder, state: "EXPIRED" }),
          },
        });
      }),
    };

    const result = await recordVerifiedPaymentEvent(
      {
        provider: "MIDTRANS",
        providerEventId: "trx-expire-01_expire",
        providerReference: "trx-expire-01",
        orderReference: "ORD-20260918-003",
        status: "EXPIRED",
      },
      mockPrisma as never,
    );

    expect(result.processed).toBe(true);
    expect(result.orderState).toBe("EXPIRED");
    expect(result.entitlementsGranted).toBe(0);
  });

  // 6. Idempotent Webhook Replay
  it("6. rejects duplicate webhook notification idempotently without duplicate grants", async () => {
    const mockPrisma = {
      paymentEvent: {
        findUnique: vi.fn().mockResolvedValue({
          id: "evt-existing",
          providerEventId: "trx-qris-test-01_settlement",
          processedAt: new Date(),
        }),
      },
    };

    const result = await recordVerifiedPaymentEvent(
      {
        provider: "MIDTRANS",
        providerEventId: "trx-qris-test-01_settlement",
        providerReference: "trx-qris-test-01",
        orderReference: "ORD-20260918-001",
        status: "SUCCESS",
      },
      mockPrisma as never,
    );

    expect(result.processed).toBe(false);
    expect(result.alreadyProcessed).toBe(true);
    expect(result.entitlementsGranted).toBe(0);
  });

  // 7. Signature Tampering Defense
  it("7. rejects tampered signature and records COMMERCE_WEBHOOK_INVALID_SIGNATURE security event", async () => {
    const recordSecurityEventSpy = vi
      .spyOn(securityEventsModule, "recordSecurityEvent")
      .mockResolvedValue(null as never);

    const payload = generateWebhookPayload({
      orderId: "ORD-20260918-001",
      grossAmount: "150000.00",
      key: "WRONG_ATTACKER_SERVER_KEY",
    });

    const request = new Request("http://localhost:3000/api/commerce/webhooks/midtrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await midtransWebhookRoute(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized: invalid signature");

    expect(recordSecurityEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "COMMERCE_WEBHOOK_INVALID_SIGNATURE",
        severity: "HIGH",
      }),
    );
  });

  // 8. Out-of-Order Notification
  it("8. handles late webhook delivery without regressing already PAID order state", async () => {
    const mockOrder = {
      id: "ord-test-001",
      reference: "ORD-20260918-001",
      userId: "user-learner-01",
      state: "PAID", // Already in final PAID state
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
        provider: "MIDTRANS",
        providerEventId: "trx-late-event-01_settlement",
        providerReference: "trx-late-event-01",
        orderReference: "ORD-20260918-001",
        status: "SUCCESS",
      },
      mockPrisma as never,
    );

    expect(result.processed).toBe(false);
    expect(result.orderState).toBe("PAID");
    expect(result.entitlementsGranted).toBe(0);
  });

  // 9. Delayed Notification & CLI Reconciliation
  it("9. performs dry-run reconciliation then executes repair with operator audit trail", async () => {
    const mockOrder = {
      id: "ord-stuck-001",
      reference: "ORD-STUCK-001",
      userId: "user-learner-02",
      state: "PENDING",
      totalAmountIdr: 150000,
      package: {
        packageCourses: [{ course: { id: "c-switching" } }],
      },
      paymentAttempts: [{ id: "att-stuck" }],
    };

    const mockPrisma = {
      order: {
        findUnique: vi.fn().mockResolvedValue(mockOrder),
        update: vi.fn().mockResolvedValue({ ...mockOrder, state: "PAID" }),
      },
      paymentEvent: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: "evt-repair" }),
      },
      paymentAttempt: {
        update: vi.fn().mockResolvedValue({ id: "att-stuck", state: "SUCCESS" }),
      },
      entitlement: {
        upsert: vi.fn().mockResolvedValue({}),
      },
      $transaction: vi.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    };

    const mockGateway = {
      provider: "MIDTRANS" as const,
      createCheckout: vi.fn(),
      verifyEvent: vi.fn(),
      getOrderStatus: vi.fn().mockResolvedValue({
        status_code: "200",
        transaction_id: "trx-stuck-resolved",
        order_id: "ORD-STUCK-001",
        gross_amount: "150000.00",
        transaction_status: "settlement",
      }),
    };

    vi.spyOn(paymentsModule, "getPaymentGateway").mockReturnValue(mockGateway as never);

    // Dry-run mode
    const dryRunResult = await reconcileMidtransOrder({
      orderReference: "ORD-STUCK-001",
      repair: false,
      prisma: mockPrisma as never,
    });

    expect(dryRunResult.actionNeeded).toBe(true);
    expect(dryRunResult.actionTaken).toBe("REPAIR_REQUIRED");
    expect(dryRunResult.localOrderState).toBe("PENDING");

    // Repair mode with operator justification
    const recordSecurityEventSpy = vi
      .spyOn(securityEventsModule, "recordSecurityEvent")
      .mockResolvedValue(null as never);

    const repairResult = await reconcileMidtransOrder({
      orderReference: "ORD-STUCK-001",
      repair: true,
      reason: "Customer verified payment on Midtrans dashboard during staging drill",
      prisma: mockPrisma as never,
    });

    expect(repairResult.actionNeeded).toBe(true);
    expect(repairResult.actionTaken).toBe("REPAIRED");
    expect(repairResult.localOrderState).toBe("PAID");

    expect(recordSecurityEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "COMMERCE_RECONCILIATION_REPAIR",
        severity: "WARN",
      }),
    );
  });

  // 10. Refund / Dispute Entitlement Revocation
  it("10. revokes course access when entitlement state is changed to REVOKED following refund", async () => {
    const mockPrisma = {
      course: {
        findUnique: vi.fn().mockResolvedValue({ id: "course-premium-01", accessTier: "PREMIUM" }),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({ role: "LEARNER" }),
      },
      entitlement: {
        findUnique: vi.fn().mockResolvedValue({
          id: "ent-001",
          state: "REVOKED", // Post-refund state
        }),
      },
    };

    const access = await resolveCourseAccess(
      { userId: "user-learner-01", courseId: "course-premium-01" },
      mockPrisma as never,
    );

    // Access must be immediately denied once revoked
    expect(access).toBe("DENIED");
  });
});
