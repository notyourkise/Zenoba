import type { PaymentProvider } from "../types";

export interface CreateCheckoutInput {
  orderReference: string;
  totalAmountIdr: number;
  userId: string;
  userEmail?: string;
  packageTitle: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  providerReference?: string;
  qrString?: string;
  actions?: Array<{ name: string; method: string; url: string }>;
  rawResponse?: Record<string, unknown>;
}

export interface NormalizedPaymentEvent {
  provider: PaymentProvider;
  providerEventId: string;
  providerReference: string;
  orderReference: string;
  status: "SUCCESS" | "FAILED" | "EXPIRED" | "PENDING";
  rawPayload?: Record<string, unknown>;
}

export interface PaymentGateway {
  provider: PaymentProvider;
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult>;
  verifyEvent(payload: unknown, headers?: Record<string, string>): Promise<NormalizedPaymentEvent>;
}
