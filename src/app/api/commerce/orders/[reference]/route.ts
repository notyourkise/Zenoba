import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export async function GET(
  _request: Request,
  props: { params: Promise<{ reference: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reference } = await props.params;

    const order = await prisma.order.findUnique({
      where: { reference },
      include: {
        package: {
          select: {
            title: true,
            slug: true,
            kind: true,
          },
        },
        lines: true,
        paymentAttempts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching order" },
      { status: 500 },
    );
  }
}
