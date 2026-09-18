import { describe, expect, it, vi, beforeEach } from "vitest";
import { runReconcileCli } from "./reconcile-midtrans";
import * as reconciliationModule from "../src/features/commerce/payments/reconciliation";

function createMockIo(inputs: string[] = []) {
  const logs: string[] = [];
  const errors: string[] = [];
  const readInput = vi.fn();
  for (const val of inputs) {
    readInput.mockResolvedValueOnce(val);
  }
  return {
    io: {
      readInput,
      log: (...args: unknown[]) => {
        logs.push(args.map(String).join(" "));
      },
      error: (...args: unknown[]) => {
        errors.push(args.map(String).join(" "));
      },
    },
    logs,
    errors,
  };
}

describe("reconcile-midtrans CLI (scripts/reconcile-midtrans.ts)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("aborts when order reference is missing from args and prompt input is empty", async () => {
    const { io, errors } = createMockIo([""]);

    const exitCode = await runReconcileCli([], io);

    expect(exitCode).toBe(1);
    expect(errors.some((e) => e.includes("Order reference is required"))).toBe(true);
  });

  it("runs dry-run reconciliation successfully by default", async () => {
    const { io, logs } = createMockIo();

    vi.spyOn(reconciliationModule, "reconcileMidtransOrder").mockResolvedValue({
      orderReference: "ORD-20260918-001",
      localOrderState: "PAID",
      remoteTransactionStatus: "settlement",
      remoteGrossAmount: "150000.00",
      remoteTransactionId: "trx-001",
      actionNeeded: false,
      actionTaken: "NONE",
      details: "Order state matches Midtrans status.",
    });

    const exitCode = await runReconcileCli(["ORD-20260918-001"], io);

    expect(exitCode).toBe(0);
    expect(logs.some((l) => l.includes("Mode: DRY-RUN"))).toBe(true);
    expect(logs.some((l) => l.includes("Action Needed:            NO"))).toBe(true);
    expect(logs.some((l) => l.includes("Action Taken:             NONE"))).toBe(true);
  });

  it("runs repair mode when --repair and --reason are provided", async () => {
    const { io, logs } = createMockIo();

    const reconcileSpy = vi
      .spyOn(reconciliationModule, "reconcileMidtransOrder")
      .mockResolvedValue({
        orderReference: "ORD-20260918-002",
        localOrderState: "PAID",
        remoteTransactionStatus: "settlement",
        remoteGrossAmount: "150000.00",
        remoteTransactionId: "trx-002",
        actionNeeded: true,
        actionTaken: "REPAIRED",
        details: "Order state successfully reconciled from PENDING to PAID.",
      });

    const exitCode = await runReconcileCli(
      [
        "ORD-20260918-002",
        "--repair",
        "--reason=Webhook delivery failed during staging drill",
      ],
      io,
    );

    expect(exitCode).toBe(0);
    expect(reconcileSpy).toHaveBeenCalledWith({
      orderReference: "ORD-20260918-002",
      repair: true,
      reason: "Webhook delivery failed during staging drill",
    });
    expect(logs.some((l) => l.includes("Mode: REPAIR"))).toBe(true);
    expect(logs.some((l) => l.includes("Action Taken:             REPAIRED"))).toBe(true);
  });

  it("prompts for reason when --repair is given without --reason flag", async () => {
    const { io } = createMockIo(["Customer payment verified manually via Midtrans dashboard"]);

    const reconcileSpy = vi
      .spyOn(reconciliationModule, "reconcileMidtransOrder")
      .mockResolvedValue({
        orderReference: "ORD-20260918-003",
        localOrderState: "PAID",
        remoteTransactionStatus: "settlement",
        remoteGrossAmount: "150000.00",
        remoteTransactionId: "trx-003",
        actionNeeded: true,
        actionTaken: "REPAIRED",
        details: "Order state successfully reconciled.",
      });

    const exitCode = await runReconcileCli(["ORD-20260918-003", "--repair"], io);

    expect(exitCode).toBe(0);
    expect(reconcileSpy).toHaveBeenCalledWith({
      orderReference: "ORD-20260918-003",
      repair: true,
      reason: "Customer payment verified manually via Midtrans dashboard",
    });
  });

  it("handles errors thrown by reconciliation domain service", async () => {
    const { io, errors } = createMockIo();

    vi.spyOn(reconciliationModule, "reconcileMidtransOrder").mockRejectedValue(
      new Error("Order not found: ORD-UNKNOWN"),
    );

    const exitCode = await runReconcileCli(["ORD-UNKNOWN"], io);

    expect(exitCode).toBe(1);
    expect(errors.some((e) => e.includes("Reconciliation failed: Order not found: ORD-UNKNOWN"))).toBe(true);
  });
});
