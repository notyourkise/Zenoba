import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const startTime = Date.now();
  let dbStatus = "connected";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error("Health check DB ping failed:", error);
    }
    dbStatus = "disconnected";
  }

  const memoryUsage = process.memoryUsage();

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    system: {
      heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
    },
    responseTimeMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  });
};
