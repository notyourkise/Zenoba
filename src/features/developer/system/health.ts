import { prisma } from "@/lib/db/client";
import { requireDeveloperActor } from "@/lib/auth";

export interface SystemHealth {
  status: "healthy" | "degraded" | "error";
  timestamp: string;
  database: {
    status: "healthy" | "degraded" | "error";
    latencyMs: number | null;
  };
  environment: {
    nodeVersion: string;
    environment: string;
    variables: Record<string, { configured: boolean; redacted: string }>;
  };
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
  };
  uptimeSeconds: number;
}

const MONITORED_ENV_KEYS = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SMTP_HOST",
  "SMTP_PASSWORD",
] as const;

/**
 * Retrieves system operational health and diagnostics for the developer portal.
 * Strictly redacts environment variable contents and secrets.
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  await requireDeveloperActor();

  let dbStatus: "healthy" | "degraded" = "healthy";
  let latencyMs: number | null = null;

  try {
    const start = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    latencyMs = Math.round(performance.now() - start);
  } catch {
    dbStatus = "degraded";
    latencyMs = null;
  }

  const mem = process.memoryUsage();
  const envVariables: Record<string, { configured: boolean; redacted: string }> = {};

  for (const key of MONITORED_ENV_KEYS) {
    const isConfigured = Boolean(process.env[key]);
    envVariables[key] = {
      configured: isConfigured,
      redacted: isConfigured ? "[CONFIGURED / REDACTED]" : "[NOT CONFIGURED]",
    };
  }

  const overallStatus: "healthy" | "degraded" | "error" =
    dbStatus === "healthy" ? "healthy" : "degraded";

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      latencyMs,
    },
    environment: {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      variables: envVariables,
    },
    memory: {
      rssMb: Math.round(mem.rss / (1024 * 1024)),
      heapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
      heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
    },
    uptimeSeconds: Math.round(process.uptime()),
  };
}
