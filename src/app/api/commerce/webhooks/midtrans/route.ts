import { NextResponse } from "next/server";
import { getCommerceEnvironment } from "@/lib/env/server";
import { getPaymentGateway, recordVerifiedPaymentEvent } from "@/features/commerce/payments";
import { recordSecurityEvent } from "@/features/security/events";

export async function POST(request: Request) {
  try {
    const { PAYMENT_MODE } = getCommerceEnvironment();

    if (PAYMENT_MODE === "disabled") {
      return NextResponse.json(
        { error: "Payment processing is disabled" },
        { status: 403 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    const gateway = getPaymentGateway("MIDTRANS");

    let event;
    try {
      event = await gateway.verifyEvent(body);
    } catch (verifyError) {
      const errorMessage = verifyError instanceof Error ? verifyError.message : "Verification failed";

      await recordSecurityEvent({
        type: "COMMERCE_WEBHOOK_INVALID_SIGNATURE",
        severity: "HIGH",
        metadata: {
          error: errorMessage,
          headers: Object.fromEntries(request.headers.entries()),
        },
      });

      return NextResponse.json(
        { error: "Unauthorized: invalid signature" },
        { status: 401 },
      );
    }

    const result = await recordVerifiedPaymentEvent({
      provider: "MIDTRANS",
      providerEventId: event.providerEventId,
      providerReference: event.providerReference,
      orderReference: event.orderReference,
      status: event.status,
      rawPayload: event.rawPayload,
    });

    if (result.alreadyProcessed) {
      return NextResponse.json(
        { status: "already_processed" },
        { status: 200 },
      );
    }

    if (result.error === "ORDER_NOT_FOUND") {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { status: "ok", result },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Midtrans Webhook Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
