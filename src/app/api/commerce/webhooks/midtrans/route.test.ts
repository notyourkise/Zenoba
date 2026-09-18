import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import crypto from "crypto";
import * as paymentsModule from "@/features/commerce/payments";
import * as securityEventsModule from "@/features/security/events";

describe("POST /api/commerce/webhooks/midtrans", () => {
  const serverKey = "SB-Mid-server-TESTKEY123456";
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

  function createSignedPayload(overrides: Record<string, unknown> = {}) {
    const orderId = (overrides.order_id as string) || "ORD-20260918-001";
    const statusCode = (overrides.status_code as string) || "200";
    const grossAmount = (overrides.gross_amount as string) || "150000.00";
    const status = (overrides.transaction_status as string) || "settlement";
    const trxId = (overrides.transaction_id as string) || "trx-uuid-001";

    const payloadString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    const signatureKey = crypto.createHash("sha512").update(payloadString).digest("hex");

    return {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_id: trxId,
      transaction_status: status,
      payment_type: "qris",
      ...overrides,
    };
  }

  it("returns 403 if PAYMENT_MODE is disabled", async () => {
    process.env.PAYMENT_MODE = "disabled";

    const request = new Request("http://localhost:3000/api/commerce/webhooks/midtrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createSignedPayload()),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Payment processing is disabled");
  });

  it("returns 401 and records a security event on invalid signature", async () => {
    const recordSecurityEventSpy = vi
      .spyOn(securityEventsModule, "recordSecurityEvent")
      .mockResolvedValue(null as never);

    const payload = createSignedPayload();
    payload.signature_key = "a".repeat(128); // tampered

    const request = new Request("http://localhost:3000/api/commerce/webhooks/midtrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized: invalid signature");

    expect(recordSecurityEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "COMMERCE_WEBHOOK_INVALID_SIGNATURE",
        severity: "HIGH",
      }),
    );
  });

  it("processes valid settlement notification and returns 200 with result", async () => {
    const recordPaymentSpy = vi
      .spyOn(paymentsModule, "recordVerifiedPaymentEvent")
      .mockResolvedValue({
        processed: true,
        orderState: "PAID",
        entitlementsGranted: 2,
      });

    const payload = createSignedPayload({
      transaction_status: "settlement",
    });

    const request = new Request("http://localhost:3000/api/commerce/webhooks/midtrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.result.orderState).toBe("PAID");
    expect(recordPaymentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "MIDTRANS",
        providerEventId: "trx-uuid-001_settlement",
        orderReference: "ORD-20260918-001",
        status: "SUCCESS",
      }),
    );
  });

  it("returns 200 with already_processed for idempotent duplicate notifications", async () => {
    vi.spyOn(paymentsModule, "recordVerifiedPaymentEvent").mockResolvedValue({
      processed: false,
      alreadyProcessed: true,
      entitlementsGranted: 0,
    });

    const payload = createSignedPayload();

    const request = new Request("http://localhost:3000/api/commerce/webhooks/midtrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("already_processed");
  });

  it("returns 404 if order is not found", async () => {
    vi.spyOn(paymentsModule, "recordVerifiedPaymentEvent").mockResolvedValue({
      processed: false,
      entitlementsGranted: 0,
      error: "ORDER_NOT_FOUND",
    });

    const payload = createSignedPayload({ order_id: "ORD-NONEXISTENT" });

    const request = new Request("http://localhost:3000/api/commerce/webhooks/midtrans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Order not found");
  });
});
