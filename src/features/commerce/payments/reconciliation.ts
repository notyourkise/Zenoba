import { prisma as defaultPrisma } from "@/lib/db/client";
import type { PrismaClient } from "@/generated/prisma/client";
import {
  getPaymentGateway,
  recordVerifiedPaymentEvent,
  type PaymentEventResult,
} from "../payments";
import { MidtransGateway } from "./midtrans-gateway";
import { recordSecurityEvent } from "@/features/security/events";

export interface ReconcileMidtransOrderInput {
  orderReference: string;
  repair?: boolean;
  reason?: string;
  prisma?: PrismaClient;
}

export interface ReconcileResult {
  orderReference: string;
  localOrderState: string;
  remoteTransactionStatus: string;
  remoteGrossAmount: string;
  remoteTransactionId: string;
  actionNeeded: boolean;
  actionTaken: "NONE" | "REPAIRED" | "REPAIR_REQUIRED";
  details: string;
  paymentEventResult?: PaymentEventResult;
}

export async function reconcileMidtransOrder(
  input: ReconcileMidtransOrderInput,
): Promise<ReconcileResult> {
  const db = input.prisma ?? defaultPrisma;

  const order = await db.order.findUnique({
    where: { reference: input.orderReference },
  });

  if (!order) {
    throw new Error(`Order not found: ${input.orderReference}`);
  }

  const gateway = getPaymentGateway("MIDTRANS") as MidtransGateway;
  const remoteStatus = await gateway.getOrderStatus(input.orderReference);

  const txStatus = (remoteStatus.transaction_status || "").toLowerCase();
  const fraudStatus = (remoteStatus.fraud_status || "").toLowerCase();

  let targetState: "PAID" | "EXPIRED" | "CANCELLED" | "PENDING";
  let eventStatus: "SUCCESS" | "EXPIRED" | "FAILED" | "PENDING";

  if (txStatus === "settlement") {
    targetState = "PAID";
    eventStatus = "SUCCESS";
  } else if (txStatus === "capture") {
    if (fraudStatus === "accept") {
      targetState = "PAID";
      eventStatus = "SUCCESS";
    } else {
      targetState = "CANCELLED";
      eventStatus = "FAILED";
    }
  } else if (txStatus === "expire") {
    targetState = "EXPIRED";
    eventStatus = "EXPIRED";
  } else if (txStatus === "cancel" || txStatus === "deny") {
    targetState = "CANCELLED";
    eventStatus = "FAILED";
  } else if (txStatus === "pending") {
    targetState = "PENDING";
    eventStatus = "PENDING";
  } else {
    targetState = "CANCELLED";
    eventStatus = "FAILED";
  }

  const isMatching = order.state === targetState;

  if (isMatching) {
    return {
      orderReference: input.orderReference,
      localOrderState: order.state,
      remoteTransactionStatus: remoteStatus.transaction_status,
      remoteGrossAmount: remoteStatus.gross_amount,
      remoteTransactionId: remoteStatus.transaction_id,
      actionNeeded: false,
      actionTaken: "NONE",
      details: "Order state matches Midtrans status.",
    };
  }

  if (!input.repair) {
    return {
      orderReference: input.orderReference,
      localOrderState: order.state,
      remoteTransactionStatus: remoteStatus.transaction_status,
      remoteGrossAmount: remoteStatus.gross_amount,
      remoteTransactionId: remoteStatus.transaction_id,
      actionNeeded: true,
      actionTaken: "REPAIR_REQUIRED",
      details: `Order state ${order.state} does not match remote status ${remoteStatus.transaction_status} (expected ${targetState}). Run with --repair --reason='...' to synchronize.`,
    };
  }

  const trimmedReason = (input.reason || "").trim();
  if (trimmedReason.length < 10) {
    throw new Error(
      "Repair mode requires an explicit justification reason (minimum 10 characters)",
    );
  }

  const paymentEventResult = await recordVerifiedPaymentEvent(
    {
      provider: "MIDTRANS",
      providerEventId: `reconcile_${remoteStatus.transaction_id}_${remoteStatus.transaction_status}_${Date.now()}`,
      providerReference: remoteStatus.transaction_id,
      orderReference: input.orderReference,
      status: eventStatus,
      rawPayload: remoteStatus as Record<string, unknown>,
    },
    db,
  );

  await recordSecurityEvent({
    userId: order.userId,
    type: "COMMERCE_RECONCILIATION_REPAIR",
    severity: "WARN",
    metadata: {
      orderReference: input.orderReference,
      previousState: order.state,
      targetState,
      reason: trimmedReason,
      transactionId: remoteStatus.transaction_id,
      transactionStatus: remoteStatus.transaction_status,
    },
  });

  return {
    orderReference: input.orderReference,
    localOrderState: paymentEventResult.orderState || targetState,
    remoteTransactionStatus: remoteStatus.transaction_status,
    remoteGrossAmount: remoteStatus.gross_amount,
    remoteTransactionId: remoteStatus.transaction_id,
    actionNeeded: true,
    actionTaken: "REPAIRED",
    details: `Order state successfully reconciled from ${order.state} to ${paymentEventResult.orderState || targetState}.`,
    paymentEventResult,
  };
}
