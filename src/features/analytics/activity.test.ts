import { describe, expect, it, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/db/client";
import { touchUserActivity, ACTIVITY_WRITE_INTERVAL_MS } from "./activity";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("User Activity Tracking Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports ACTIVITY_WRITE_INTERVAL_MS as 15 minutes", () => {
    expect(ACTIVITY_WRITE_INTERVAL_MS).toBe(15 * 60 * 1000);
  });

  it("returns false when userId is empty or invalid", async () => {
    expect(await touchUserActivity("")).toBe(false);
    expect(await touchUserActivity("   ")).toBe(false);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("returns false if user does not exist in database", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

    const updated = await touchUserActivity("non-existent-user");

    expect(updated).toBe(false);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("updates lastActiveAt when user has never had an active timestamp", async () => {
    const now = new Date("2026-09-14T10:00:00Z");
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "user-1",
      lastActiveAt: null,
    } as unknown as Awaited<ReturnType<typeof prisma.user.findUnique>>);

    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as unknown as Awaited<ReturnType<typeof prisma.user.update>>);

    const updated = await touchUserActivity("user-1", now);

    expect(updated).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { lastActiveAt: now },
    });
  });

  it("throttles write when lastActiveAt was within the 15-minute window", async () => {
    const baseTime = new Date("2026-09-14T10:00:00Z");
    const fiveMinutesLater = new Date("2026-09-14T10:05:00Z");

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "user-1",
      lastActiveAt: baseTime,
    } as unknown as Awaited<ReturnType<typeof prisma.user.findUnique>>);

    const updated = await touchUserActivity("user-1", fiveMinutesLater);

    expect(updated).toBe(false);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("updates lastActiveAt when 15 or more minutes have elapsed", async () => {
    const baseTime = new Date("2026-09-14T10:00:00Z");
    const sixteenMinutesLater = new Date("2026-09-14T10:16:00Z");

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "user-1",
      lastActiveAt: baseTime,
    } as unknown as Awaited<ReturnType<typeof prisma.user.findUnique>>);

    vi.mocked(prisma.user.update).mockResolvedValueOnce({} as unknown as Awaited<ReturnType<typeof prisma.user.update>>);

    const updated = await touchUserActivity("user-1", sixteenMinutesLater);

    expect(updated).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { lastActiveAt: sixteenMinutesLater },
    });
  });

  it("handles database failures gracefully without throwing", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(new Error("Database offline"));

    const updated = await touchUserActivity("user-1");

    expect(updated).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
