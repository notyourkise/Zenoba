/**
 * Netloka Database Seed
 * This file will be populated with seed data in future sprints.
 * 
 * Sprint 2: Learning path/module/lesson seeds
 */

import { closeDatabaseConnection } from "../src/lib/db/client";

async function main() {
  console.log("🌱 Netloka database seed - No initial seeds required");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
