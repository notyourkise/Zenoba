import { prisma as defaultPrisma } from "@/lib/db/client";
import type { PrismaClient } from "@/generated/prisma/client";

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

export interface CreatePendingOrderInput {
  userId: string;
  packageSlug: string;
  now?: Date;
}

export interface PendingOrderResult {
  id: string;
  reference: string;
  state: "PENDING";
  totalAmountIdr: number;
  expiresAt: Date;
}

export async function createPendingOrder(
  input: CreatePendingOrderInput,
  prisma: PrismaClient = defaultPrisma,
): Promise<PendingOrderResult> {
  const now = input.now ?? new Date();

  const pkg = await prisma.package.findUnique({
    where: { slug: input.packageSlug },
    include: {
      packageCourses: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!pkg) {
    throw new OrderError(`Package not found: ${input.packageSlug}`);
  }

  if (pkg.catalogStatus !== "AVAILABLE" || pkg.amountIdr === null || pkg.amountIdr <= 0) {
    throw new OrderError(
      `Package is not available for purchase: ${input.packageSlug}`,
    );
  }

  // Generate unique order reference: ORD-YYYYMMDD-XXXXXX
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const reference = `ORD-${datePart}-${randPart}`;

  // 24-hour expiry
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        reference,
        userId: input.userId,
        packageId: pkg.id,
        state: "PENDING",
        provider: "SANDBOX",
        totalAmountIdr: pkg.amountIdr as number,
        currency: pkg.currency || "IDR",
        expiresAt,
      },
    });

    // Create OrderLine snapshots
    await tx.orderLine.create({
      data: {
        orderId: createdOrder.id,
        itemType: "PACKAGE",
        itemSlug: pkg.slug,
        itemTitle: pkg.title,
        amountIdr: pkg.amountIdr as number,
        currency: pkg.currency || "IDR",
      },
    });

    // Create initial payment attempt
    await tx.paymentAttempt.create({
      data: {
        orderId: createdOrder.id,
        provider: "SANDBOX",
        state: "PENDING",
      },
    });

    return createdOrder;
  });

  return {
    id: order.id,
    reference: order.reference,
    state: "PENDING",
    totalAmountIdr: order.totalAmountIdr,
    expiresAt: order.expiresAt,
  };
}
