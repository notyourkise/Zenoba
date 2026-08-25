import { describe, expect, it, vi, beforeEach } from "vitest";
import { awardXp, getUserTotalXp } from "./ledger";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    userXpLedger: {
      findUnique: vi.fn(),
      create: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

describe("XP Ledger Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("awardXp", () => {
    it("awards XP when activity is completed for the first time", async () => {
      vi.mocked(prisma.userXpLedger.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.userXpLedger.create).mockResolvedValueOnce({
        id: "ledger-1",
        userId: "user-1",
        amount: 50,
        eventType: "LESSON_COMPLETION",
        referenceId: "lesson-1",
        createdAt: new Date(),
      });
      vi.mocked(prisma.userXpLedger.aggregate).mockResolvedValueOnce({
        _sum: { amount: 50 },
        _count: {},
        _avg: {},
        _max: {},
        _min: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await awardXp("user-1", 50, "LESSON_COMPLETION", "lesson-1");
      expect(result.awarded).toBe(true);
      expect(result.amount).toBe(50);
      expect(result.totalXp).toBe(50);
    });

    it("is strictly idempotent and rejects duplicate awards for same event and reference", async () => {
      vi.mocked(prisma.userXpLedger.findUnique).mockResolvedValueOnce({
        id: "ledger-1",
        userId: "user-1",
        amount: 50,
        eventType: "LESSON_COMPLETION",
        referenceId: "lesson-1",
        createdAt: new Date(),
      });
      vi.mocked(prisma.userXpLedger.aggregate).mockResolvedValueOnce({
        _sum: { amount: 50 },
        _count: {},
        _avg: {},
        _max: {},
        _min: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await awardXp("user-1", 50, "LESSON_COMPLETION", "lesson-1");
      expect(result.awarded).toBe(false);
      expect(result.amount).toBe(0);
      expect(prisma.userXpLedger.create).not.toHaveBeenCalled();
    });
  });

  describe("getUserTotalXp", () => {
    it("returns total sum from ledger", async () => {
      vi.mocked(prisma.userXpLedger.aggregate).mockResolvedValueOnce({
        _sum: { amount: 150 },
        _count: {},
        _avg: {},
        _max: {},
        _min: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const total = await getUserTotalXp("user-1");
      expect(total).toBe(150);
    });
  });
});
