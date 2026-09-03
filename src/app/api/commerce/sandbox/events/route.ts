import { NextResponse } from "next/server";
import { z } from "zod";
import { getCommerceEnvironment } from "@/lib/env/server";
import { recordVerifiedPaymentEvent } from "@/features/commerce/payments";

const sandboxEventSchema = z.object({
  providerEventId: z.string().min(1, "providerEventId is required"),
  providerReference: z.string().min(1, "providerReference is required"),
  orderReference: z.string().min(1, "orderReference is required"),
  status: z.enum(["SUCCESS", "FAILED", "EXPIRED"]),
  rawPayload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  // Fail closed in production: return 404 before processing
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { PAYMENT_MODE, SANDBOX_PAYMENT_EVENT_SECRET } = getCommerceEnvironment();

    if (PAYMENT_MODE !== "sandbox") {
      return NextResponse.json({ error: "Sandbox payment mode is disabled" }, { status: 403 });
    }

    // Verify Authorization Bearer token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token || !SANDBOX_PAYMENT_EVENT_SECRET || token !== SANDBOX_PAYMENT_EVENT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = sandboxEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid event payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await recordVerifiedPaymentEvent({
      provider: "SANDBOX",
      providerEventId: parsed.data.providerEventId,
      providerReference: parsed.data.providerReference,
      orderReference: parsed.data.orderReference,
      status: parsed.data.status,
      rawPayload: parsed.data.rawPayload,
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Sandbox payment event error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred processing sandbox event" },
      { status: 500 },
    );
  }
}
