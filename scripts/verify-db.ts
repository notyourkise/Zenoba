import { closeDatabaseConnection, prisma } from "../src/lib/db/client";

async function main() {
  const result = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1 AS ok`;

  if (result[0]?.ok !== 1) {
    throw new Error("Database verification query returned an unexpected result");
  }

  console.log("Database connection verified");
}

main()
  .catch((error: unknown) => {
    console.error("Database verification failed:", error);
    process.exitCode = 1;
  })
  .finally(closeDatabaseConnection);
