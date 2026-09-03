import type {
  PaymentGateway,
  CreateCheckoutInput,
  CheckoutResult,
  NormalizedPaymentEvent,
} from "./types";

export class SandboxGateway implements PaymentGateway {
  provider = "SANDBOX" as const;

  async createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
    const sandboxRef = `SB-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      checkoutUrl: `/api/commerce/sandbox/checkout?ref=${encodeURIComponent(input.orderReference)}`,
      providerReference: sandboxRef,
    };
  }

  async verifyEvent(payload: unknown): Promise<NormalizedPaymentEvent> {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload: payload must be an object");
    }

    const data = payload as Record<string, unknown>;
    const orderReference = String(data.orderReference || "");
    const providerEventId = String(data.providerEventId || `evt-${Date.now()}`);
    const providerReference = String(data.providerReference || `sb-${Date.now()}`);
    const statusRaw = String(data.status || "SUCCESS").toUpperCase();

    let status: "SUCCESS" | "FAILED" | "EXPIRED" = "SUCCESS";
    if (statusRaw === "FAILED") status = "FAILED";
    else if (statusRaw === "EXPIRED") status = "EXPIRED";

    return {
      provider: "SANDBOX",
      providerEventId,
      providerReference,
      orderReference,
      status,
      rawPayload: data,
    };
  }
}
