import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import crypto from "node:crypto";
import { UserRole } from "../src/generated/prisma/client";
import {
  setUserRole,
  RoleManagementError,
} from "../src/features/authorization/role-management";
import { closeDatabaseConnection } from "../src/lib/db/client";

export interface CliIo {
  readInput: (promptText: string) => Promise<string>;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export async function runRoleCli(
  args: string[] = process.argv.slice(2),
  io?: CliIo,
): Promise<number> {
  const rl = io
    ? null
    : readline.createInterface({ input, output });

  const readInput =
    io?.readInput ??
    (async (promptText: string) => {
      return (await rl!.question(promptText)).trim();
    });

  const log = io?.log ?? console.log;
  const error = io?.error ?? console.error;

  try {
    // 1. Get Target Email
    let email = args[0]?.trim();
    if (!email) {
      email = await readInput("Target user email: ");
    }
    email = email.toLowerCase().trim();
    if (!email) {
      error("Error: Target email is required.");
      return 1;
    }

    // 2. Get Target Role
    let rawRole = args[1]?.trim().toUpperCase();
    if (!rawRole) {
      log(`Available roles: ${Object.values(UserRole).join(", ")}`);
      rawRole = await readInput("Target role: ");
      rawRole = rawRole.toUpperCase();
    }

    if (!Object.values(UserRole).includes(rawRole as UserRole)) {
      error(`Error: Invalid role "${rawRole}". Valid roles are: ${Object.values(UserRole).join(", ")}`);
      return 1;
    }
    const role = rawRole as UserRole;

    // 3. Get Operator Identifier
    let operator = process.env.OPERATOR_NAME?.trim();
    if (!operator) {
      operator = await readInput("Operator identifier (e.g. your email or admin username): ");
    }
    if (!operator) {
      error("Error: Operator identifier is required for the audit trail.");
      return 1;
    }

    // 4. Get Reason for Audit Log
    let reason = process.env.ROLE_CHANGE_REASON?.trim();
    if (!reason) {
      reason = await readInput("Reason for role change (e.g. ticket #, onboarding reason): ");
    }
    if (!reason) {
      error("Error: Audit reason is required.");
      return 1;
    }

    // 5. Display Redacted Confirmation Summary
    log("\n========================================================");
    log("  ZENOBA VPS ROLE PROVISIONING");
    log("========================================================");
    log(`  Target Email: ${email}`);
    log(`  Target Role:  ${role}`);
    log(`  Operator:     ${operator}`);
    log(`  Reason:       ${reason}`);
    log("========================================================\n");

    // 6. Security Confirmation: Require typing the exact email
    const confirmation = await readInput(
      `To confirm this change, type the target email (${email}): `,
    );

    if (confirmation.trim().toLowerCase() !== email) {
      error("Confirmation email mismatch. Aborted.");
      return 1;
    }

    // 7. Execute Role Change via Service
    const requestId = `cli_role_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    log("\nApplying role change transaction...");

    const result = await setUserRole({
      email,
      role,
      operator,
      reason,
      requestId,
    });

    log("\n[SUCCESS] Role change successfully executed!");
    log(`  User ID:                   ${result.userId}`);
    log(`  Email:                     ${result.email}`);
    log(`  Previous Role:             ${result.previousRole}`);
    log(`  New Role:                  ${result.newRole}`);
    log(`  New Auth Version:          ${result.authVersion} (active sessions invalidated)`);
    log(`  Elevation Sessions Revoked: ${result.elevationSessionsRevoked}`);
    log(`  Audit Event ID:            ${result.auditEventId}`);
    log("========================================================\n");

    return 0;
  } catch (err: unknown) {
    if (err instanceof RoleManagementError) {
      error(`\n[ROLE MANAGEMENT ERROR] [${err.code}]: ${err.message}`);
    } else {
      error("\n[UNEXPECTED ERROR]:", err);
    }
    return 1;
  } finally {
    if (rl) {
      rl.close();
    }
  }
}

// Execute main if run directly
if (process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/set-user-role.ts")) {
  runRoleCli()
    .then((code) => {
      process.exitCode = code;
    })
    .finally(async () => {
      await closeDatabaseConnection();
    });
}
