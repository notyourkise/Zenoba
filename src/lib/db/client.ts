import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getServerEnvironment } from "@/lib/env/server";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const { DATABASE_URL } = getServerEnvironment();
const adapter = new PrismaPg({ connectionString: DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown helper for development and testing
export const closeDatabaseConnection = async () => {
  await prisma.$disconnect();
};
