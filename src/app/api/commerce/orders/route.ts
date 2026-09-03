import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createPendingOrder, OrderError } from "@/features/commerce/orders";

const createOrderSchema = z.object({
  packageSlug: z.string().min(1, "packageSlug is required"),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const order = await createPendingOrder({
      userId: user.id,
      packageSlug: parsed.data.packageSlug,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating order" },
      { status: 500 },
    );
  }
}
