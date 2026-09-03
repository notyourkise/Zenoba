import { prisma as defaultPrisma } from "@/lib/db/client";
import type { PrismaClient } from "@/generated/prisma/client";
import type { PaymentProvider } from "./types";
import { SandboxGateway } from "./payments/sandbox-gateway";
import type { PaymentGateway } from "./payments/types";

export interface RecordVerifiedPaymentEventInput {
  provider: PaymentProvider;
  providerEventId: string;
  providerReference: string;
  orderReference: string;
  status: "SUCCESS" | "FAILED" | "EXPIRED";
  now?: Date;
  rawPayload?: Record<string, unknown>;
}

export interface PaymentEventResult {
  processed: boolean;
  alreadyProcessed?: boolean;
  orderState?: string;
  entitlementsGranted: number;
  error?: string;
}

const sandboxGateway = new SandboxGateway();

export function getPaymentGateway(provider: PaymentProvider): PaymentGateway {
  if (provider === "SANDBOX") {
    return sandboxGateway;
  }
  throw new Error(`Unsupported payment provider: ${provider}`);
}

export async function recordVerifiedPaymentEvent(
  input: RecordVerifiedPaymentEventInput,
  prisma: PrismaClient = defaultPrisma,
): Promise<PaymentEventResult> {
  const now = input.now ?? new Date();

  // 1. Idempotency check: providerEventId must be unique
  const existingEvent = await prisma.paymentEvent.findUnique({
    where: { providerEventId: input.providerEventId },
  });

  if (existingEvent) {
    return {
      processed: false,
      alreadyProcessed: true,
      entitlementsGranted: 0,
    };
  }

  // 2. Lookup order
  const order = await prisma.order.findUnique({
    where: { reference: input.orderReference },
    include: {
      package: {
        include: {
          packageCourses: {
            include: {
              course: true,
            },
          },
        },
      },
      paymentAttempts: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!order) {
    return {
      processed: false,
      entitlementsGranted: 0,
      error: "ORDER_NOT_FOUND",
    };
  }

  // If order is already in a final state, record event without changing state
  if (order.state === "PAID" || order.state === "EXPIRED" || order.state === "CANCELLED") {
    return {
      processed: false,
      orderState: order.state,
      entitlementsGranted: 0,
    };
  }

  const latestAttempt = order.paymentAttempts?.[0];

  // 3. Process status transition in a transaction
  return await prisma.$transaction(async (tx) => {
    // Record the payment event
    if (latestAttempt) {
      await tx.paymentEvent.create({
        data: {
          paymentAttemptId: latestAttempt.id,
          providerEventId: input.providerEventId,
          eventType: input.status,
          processedAt: now,
          payloadSummary: (input.rawPayload as any) || undefined,
        },
      });
    }

    if (input.status === "SUCCESS") {
      if (latestAttempt) {
        await tx.paymentAttempt.update({
          where: { id: latestAttempt.id },
          data: {
            state: "SUCCESS",
            providerReference: input.providerReference,
            updatedAt: now,
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          state: "PAID",
          paidAt: now,
          updatedAt: now,
        },
      });

      // Grant lifetime entitlement for all courses in package
      const courses = order.package?.packageCourses?.map((pc) => pc.course) || [];
      for (const course of courses) {
        await tx.entitlement.upsert({
          where: {
            userId_courseId: {
              userId: order.userId,
              courseId: course.id,
            },
          },
          update: {
            state: "ACTIVE",
            orderId: order.id,
            sourceType: "PURCHASE",
            updatedAt: now,
          },
          create: {
            userId: order.userId,
            courseId: course.id,
            orderId: order.id,
            sourceType: "PURCHASE",
            state: "ACTIVE",
            grantedAt: now,
          },
        });
      }

      return {
        processed: true,
        orderState: "PAID",
        entitlementsGranted: courses.length,
      };
    } else if (input.status === "EXPIRED") {
      if (latestAttempt) {
        await tx.paymentAttempt.update({
          where: { id: latestAttempt.id },
          data: {
            state: "EXPIRED",
            updatedAt: now,
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          state: "EXPIRED",
          updatedAt: now,
        },
      });

      return {
        processed: true,
        orderState: "EXPIRED",
        entitlementsGranted: 0,
      };
    } else {
      if (latestAttempt) {
        await tx.paymentAttempt.update({
          where: { id: latestAttempt.id },
          data: {
            state: "FAILED",
            updatedAt: now,
          },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          state: "CANCELLED",
          cancelledAt: now,
          updatedAt: now,
        },
      });

      return {
        processed: true,
        orderState: "CANCELLED",
        entitlementsGranted: 0,
      };
    }
  });
}
