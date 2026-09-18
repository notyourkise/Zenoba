import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { reconcileMidtransOrder } from "../src/features/commerce/payments/reconciliation";
import { closeDatabaseConnection } from "../src/lib/db/client";

export interface CliIo {
  readInput: (promptText: string) => Promise<string>;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export async function runReconcileCli(
  args: string[] = process.argv.slice(2),
  io?: CliIo,
): Promise<number> {
  const rl = io ? null : readline.createInterface({ input, output });

  const readInput =
    io?.readInput ??
    (async (promptText: string) => {
      return (await rl!.question(promptText)).trim();
    });

  const log = io?.log ?? console.log;
  const error = io?.error ?? console.error;

  try {
    let orderReference: string | undefined;
    let repair = false;
    let reason: string | undefined;

    for (const arg of args) {
      if (arg === "--repair") {
        repair = true;
      } else if (arg.startsWith("--reason=")) {
        reason = arg.slice("--reason=".length).trim();
      } else if (!arg.startsWith("--") && !orderReference) {
        orderReference = arg.trim();
      }
    }

    if (!orderReference) {
      orderReference = await readInput("Order reference (e.g. ORD-YYYYMMDD-XXXXXX): ");
    }

    if (!orderReference || orderReference.trim().length === 0) {
      error("Error: Order reference is required.");
      return 1;
    }

    if (repair && (!reason || reason.trim().length === 0)) {
      reason = await readInput("Reason for repair (min 10 chars): ");
    }

    log(`=======================================================`);
    log(`Midtrans Reconciliation Tool`);
    log(`Mode: ${repair ? "REPAIR (Mutating)" : "DRY-RUN (Read-only inspection)"}`);
    log(`Target: ${orderReference}`);
    log(`=======================================================`);

    const result = await reconcileMidtransOrder({
      orderReference,
      repair,
      reason,
    });

    log(`Order Reference:          ${result.orderReference}`);
    log(`Local Order State:        ${result.localOrderState}`);
    log(`Remote Midtrans Status:   ${result.remoteTransactionStatus}`);
    log(`Remote Gross Amount:      ${result.remoteGrossAmount}`);
    log(`Remote Transaction ID:    ${result.remoteTransactionId}`);
    log(`Action Needed:            ${result.actionNeeded ? "YES" : "NO"}`);
    log(`Action Taken:             ${result.actionTaken}`);
    log(`Details:                  ${result.details}`);
    log(`=======================================================`);

    return 0;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error(`Reconciliation failed: ${message}`);
    return 1;
  } finally {
    if (rl) {
      rl.close();
    }
  }
}

if (process.env.NODE_ENV !== "test" && require.main === module) {
  runReconcileCli()
    .then(async (code) => {
      await closeDatabaseConnection().catch(() => {});
      process.exit(code);
    })
    .catch(async (err) => {
      console.error("Fatal error:", err);
      await closeDatabaseConnection().catch(() => {});
      process.exit(1);
    });
}
