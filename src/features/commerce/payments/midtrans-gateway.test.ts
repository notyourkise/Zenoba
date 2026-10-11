import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MidtransGateway, verifyMidtransSignature } from "./midtrans-gateway";
import crypto from "crypto";

describe("MidtransGateway", () => {
  const sandboxConfig = {
    serverKey: "SB-Mid-server-TESTKEY123456",
    clientKey: "SB-Mid-client-TESTKEY123456",
    merchantId: "M123456",
    isProduction: false,
  };

  const prodConfig = {
    serverKey: "Mid-server-PRODKEY123456",
    clientKey: "Mid-client-PRODKEY123456",
    merchantId: "M123456",
    isProduction: true,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("verifyMidtransSignature", () => {
    it("returns true for a matching SHA-512 signature", () => {
      const orderId = "ORD-20260918-ABC123";
      const statusCode = "200";
      const grossAmount = "150000.00";
      const serverKey = "SB-Mid-server-TESTKEY123456";

      const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
      const validSignature = crypto.createHash("sha512").update(payload).digest("hex");

      expect(
        verifyMidtransSignature(orderId, statusCode, grossAmount, serverKey, validSignature),
      ).toBe(true);
    });

    it("returns false for a mismatched or tampered signature", () => {
      const orderId = "ORD-20260918-ABC123";
      const statusCode = "200";
      const grossAmount = "150000.00";
      const serverKey = "SB-Mid-server-TESTKEY123456";

      const tamperedSignature = "a".repeat(128);

      expect(
        verifyMidtransSignature(orderId, statusCode, grossAmount, serverKey, tamperedSignature),
      ).toBe(false);
    });

    it("returns false if signature length differs or input is invalid", () => {
      expect(
        verifyMidtransSignature("ORD-1", "200", "1000.00", "key", "short-sig"),
      ).toBe(false);
    });
  });

  describe("createCheckout", () => {
    it("sends charge request to sandbox endpoint when isProduction is false", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const mockResponse = {
        status_code: "201",
        status_message: "Success, QRIS transaction is created",
        transaction_id: "trx-uuid-1234",
        order_id: "ORD-20260918-XYZ",
        gross_amount: "150000.00",
        payment_type: "qris",
        transaction_status: "pending",
        qr_string: "00020101021226590014ID.LINKAJA.WWW...",
        actions: [
          {
            name: "generate-qr-code",
            method: "GET",
            url: "https://api.sandbox.midtrans.com/v2/qris/trx-uuid-1234/qr-code",
          },
        ],
      };

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response);

      const result = await gateway.createCheckout({
        orderReference: "ORD-20260918-XYZ",
        totalAmountIdr: 150000,
        userId: "user-1",
        userEmail: "learner@zenoba.tech",
        packageTitle: "Switching & Routing Bundle",
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, options] = fetchSpy.mock.calls[0];
      expect(url).toBe("https://api.sandbox.midtrans.com/v2/charge");
      expect(options?.method).toBe("POST");

      const authHeader = (options?.headers as Record<string, string>)["Authorization"];
      const expectedAuth = `Basic ${Buffer.from(sandboxConfig.serverKey + ":").toString("base64")}`;
      expect(authHeader).toBe(expectedAuth);

      const body = JSON.parse(options?.body as string);
      expect(body.payment_type).toBe("qris");
      expect(body.qris?.acquirer).toBe("gopay");
      expect(body.transaction_details?.order_id).toBe("ORD-20260918-XYZ");
      expect(body.transaction_details?.gross_amount).toBe(150000);
      expect(body.custom_expiry?.expiry_duration).toBe(15);
      expect(body.custom_expiry?.unit).toBe("minute");

      expect(result.providerReference).toBe("trx-uuid-1234");
      expect(result.qrString).toBe(mockResponse.qr_string);
      expect(result.actions).toEqual(mockResponse.actions);
      expect(result.checkoutUrl).toBe("/orders/ORD-20260918-XYZ");
    });

    it("sends charge request to production endpoint when isProduction is true", async () => {
      const gateway = new MidtransGateway(prodConfig);

      const mockResponse = {
        status_code: "201",
        transaction_id: "trx-uuid-prod",
        order_id: "ORD-PROD-01",
        qr_string: "0002010102122659...",
      };

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response);

      await gateway.createCheckout({
        orderReference: "ORD-PROD-01",
        totalAmountIdr: 250000,
        userId: "user-prod",
        packageTitle: "Premium Network Automation",
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url] = fetchSpy.mock.calls[0];
      expect(url).toBe("https://api.midtrans.com/v2/charge");
    });

    it("throws a descriptive error when Midtrans returns HTTP failure", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({
          status_code: "400",
          status_message: "Validation Error: gross_amount is invalid",
        }),
      } as Response);

      await expect(
        gateway.createCheckout({
          orderReference: "ORD-ERR-01",
          totalAmountIdr: 0,
          userId: "user-1",
          packageTitle: "Free Pack",
        }),
      ).rejects.toThrow("Validation Error: gross_amount is invalid");
    });
  });

  describe("verifyEvent", () => {
    it("verifies and normalizes settlement status to SUCCESS", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const orderId = "ORD-20260918-001";
      const statusCode = "200";
      const grossAmount = "150000.00";
      const payloadString = `${orderId}${statusCode}${grossAmount}${sandboxConfig.serverKey}`;
      const signatureKey = crypto.createHash("sha512").update(payloadString).digest("hex");

      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: signatureKey,
        transaction_id: "trx-midtrans-999",
        transaction_status: "settlement",
        fraud_status: "accept",
        payment_type: "qris",
      };

      const event = await gateway.verifyEvent(payload);

      expect(event.provider).toBe("MIDTRANS");
      expect(event.providerEventId).toBe("trx-midtrans-999_settlement");
      expect(event.providerReference).toBe("trx-midtrans-999");
      expect(event.orderReference).toBe(orderId);
      expect(event.status).toBe("SUCCESS");
    });

    it("verifies and normalizes capture status with accept to SUCCESS", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const orderId = "ORD-20260918-002";
      const statusCode = "200";
      const grossAmount = "150000.00";
      const payloadString = `${orderId}${statusCode}${grossAmount}${sandboxConfig.serverKey}`;
      const signatureKey = crypto.createHash("sha512").update(payloadString).digest("hex");

      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: signatureKey,
        transaction_id: "trx-midtrans-888",
        transaction_status: "capture",
        fraud_status: "accept",
      };

      const event = await gateway.verifyEvent(payload);
      expect(event.status).toBe("SUCCESS");
    });

    it("verifies and normalizes expire status to EXPIRED", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const orderId = "ORD-20260918-003";
      const statusCode = "200";
      const grossAmount = "150000.00";
      const payloadString = `${orderId}${statusCode}${grossAmount}${sandboxConfig.serverKey}`;
      const signatureKey = crypto.createHash("sha512").update(payloadString).digest("hex");

      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: signatureKey,
        transaction_id: "trx-midtrans-777",
        transaction_status: "expire",
      };

      const event = await gateway.verifyEvent(payload);
      expect(event.status).toBe("EXPIRED");
    });

    it("verifies and normalizes cancel/deny status to FAILED", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const orderId = "ORD-20260918-004";
      const statusCode = "200";
      const grossAmount = "150000.00";
      const payloadString = `${orderId}${statusCode}${grossAmount}${sandboxConfig.serverKey}`;
      const signatureKey = crypto.createHash("sha512").update(payloadString).digest("hex");

      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: signatureKey,
        transaction_id: "trx-midtrans-666",
        transaction_status: "deny",
      };

      const event = await gateway.verifyEvent(payload);
      expect(event.status).toBe("FAILED");
    });

    it("verifies and normalizes pending status to PENDING", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const orderId = "ORD-20260918-005";
      const statusCode = "200";
      const grossAmount = "150000.00";
      const payloadString = `${orderId}${statusCode}${grossAmount}${sandboxConfig.serverKey}`;
      const signatureKey = crypto.createHash("sha512").update(payloadString).digest("hex");

      const payload = {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: signatureKey,
        transaction_id: "trx-midtrans-555",
        transaction_status: "pending",
      };

      const event = await gateway.verifyEvent(payload);
      expect(event.status).toBe("PENDING");
    });

    it("throws Error on invalid signature", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const payload = {
        order_id: "ORD-FAKE",
        status_code: "200",
        gross_amount: "150000.00",
        signature_key: "badsig".repeat(20),
        transaction_id: "trx-fake",
        transaction_status: "settlement",
      };

      await expect(gateway.verifyEvent(payload)).rejects.toThrow("Invalid signature");
    });
  });

  describe("getOrderStatus", () => {
    it("queries GET /v2/{order_id}/status with proper Authorization", async () => {
      const gateway = new MidtransGateway(sandboxConfig);

      const mockStatusResponse = {
        status_code: "200",
        transaction_id: "trx-uuid-1234",
        order_id: "ORD-20260918-XYZ",
        gross_amount: "150000.00",
        transaction_status: "settlement",
        signature_key: "valid-sig",
      };

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockStatusResponse,
      } as Response);

      const status = await gateway.getOrderStatus("ORD-20260918-XYZ");

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, options] = fetchSpy.mock.calls[0];
      expect(url).toBe("https://api.sandbox.midtrans.com/v2/ORD-20260918-XYZ/status");
      expect(options?.method).toBe("GET");
      expect(status.transaction_status).toBe("settlement");
    });
  });
});
