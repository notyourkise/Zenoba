import crypto from "crypto";
import type {
  PaymentGateway,
  CreateCheckoutInput,
  CheckoutResult,
  NormalizedPaymentEvent,
} from "./types";
import type { MidtransConfig } from "@/lib/env/server";

export const MIDTRANS_SANDBOX_BASE_URL = "https://api.sandbox.midtrans.com/v2";
export const MIDTRANS_PRODUCTION_BASE_URL = "https://api.midtrans.com/v2";

export interface MidtransStatusResponse {
  status_code: string;
  status_message?: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  currency?: string;
  payment_type?: string;
  transaction_time?: string;
  transaction_status: string;
  fraud_status?: string;
  signature_key?: string;
  settlement_time?: string;
  [key: string]: unknown;
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  providedSignature: string,
): boolean {
  if (!orderId || !statusCode || !grossAmount || !serverKey || !providedSignature) {
    return false;
  }

  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computedSignature = crypto.createHash("sha512").update(payload).digest("hex");

  const computedBuffer = Buffer.from(computedSignature, "utf-8");
  const providedBuffer = Buffer.from(providedSignature, "utf-8");

  if (computedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(computedBuffer, providedBuffer);
}

export class MidtransGateway implements PaymentGateway {
  readonly provider = "MIDTRANS" as const;
  private readonly config: MidtransConfig;
  private readonly baseUrl: string;

  constructor(config: MidtransConfig) {
    this.config = config;
    this.baseUrl = config.isProduction
      ? MIDTRANS_PRODUCTION_BASE_URL
      : MIDTRANS_SANDBOX_BASE_URL;
  }

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(this.config.serverKey + ":").toString("base64")}`;
  }

  async createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
    const endpoint = `${this.baseUrl}/charge`;

    const requestBody = {
      payment_type: "qris",
      transaction_details: {
        order_id: input.orderReference,
        gross_amount: Math.round(input.totalAmountIdr),
      },
      qris: {
        acquirer: "gopay",
      },
      item_details: [
        {
          id: input.orderReference,
          price: Math.round(input.totalAmountIdr),
          quantity: 1,
          name: input.packageTitle.slice(0, 50),
        },
      ],
      customer_details: input.userEmail
        ? {
            email: input.userEmail,
            first_name: input.userId,
          }
        : undefined,
      custom_expiry: {
        expiry_duration: 15,
        unit: "minute",
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": this.getAuthHeader(),
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok) {
        const message =
          (data.status_message as string) ||
          (data.message as string) ||
          `Midtrans charge request failed with HTTP ${response.status}`;
        throw new Error(message);
      }

      const transactionId = String(data.transaction_id || "");
      const qrString = data.qr_string ? String(data.qr_string) : undefined;
      const actions = Array.isArray(data.actions)
        ? (data.actions as Array<{ name: string; method: string; url: string }>)
        : undefined;

      return {
        checkoutUrl: `/orders/${encodeURIComponent(input.orderReference)}`,
        providerReference: transactionId || undefined,
        qrString,
        actions,
        rawResponse: data,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async verifyEvent(payload: unknown): Promise<NormalizedPaymentEvent> {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload: payload must be an object");
    }

    const data = payload as Record<string, unknown>;
    const orderId = String(data.order_id || "");
    const statusCode = String(data.status_code || "");
    const grossAmount = String(data.gross_amount || "");
    const signatureKey = String(data.signature_key || "");
    const transactionId = String(data.transaction_id || "");
    const transactionStatus = String(data.transaction_status || "").toLowerCase();
    const fraudStatus = data.fraud_status ? String(data.fraud_status).toLowerCase() : undefined;

    const isValid = verifyMidtransSignature(
      orderId,
      statusCode,
      grossAmount,
      this.config.serverKey,
      signatureKey,
    );

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    let status: "SUCCESS" | "FAILED" | "EXPIRED" | "PENDING";
    if (transactionStatus === "settlement") {
      status = "SUCCESS";
    } else if (transactionStatus === "capture") {
      status = fraudStatus === "accept" ? "SUCCESS" : "FAILED";
    } else if (transactionStatus === "expire") {
      status = "EXPIRED";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny") {
      status = "FAILED";
    } else if (transactionStatus === "pending") {
      status = "PENDING";
    } else {
      status = "FAILED";
    }

    return {
      provider: "MIDTRANS",
      providerEventId: `${transactionId}_${transactionStatus}`,
      providerReference: transactionId,
      orderReference: orderId,
      status,
      rawPayload: data,
    };
  }

  async getOrderStatus(orderReference: string): Promise<MidtransStatusResponse> {
    const endpoint = `${this.baseUrl}/${encodeURIComponent(orderReference)}/status`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": this.getAuthHeader(),
        },
        signal: controller.signal,
      });

      const data = (await response.json().catch(() => ({}))) as MidtransStatusResponse;

      if (!response.ok) {
        const message =
          data.status_message ||
          `Failed to fetch Midtrans order status for ${orderReference} (HTTP ${response.status})`;
        throw new Error(message);
      }

      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
