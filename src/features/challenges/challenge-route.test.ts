import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as challengeSubmitHandler } from "@/app/api/challenges/submit/route";
import * as authLib from "@/lib/auth";
import * as xpLedger from "@/features/xp/ledger";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/xp/ledger", () => ({
  awardXp: vi.fn(),
}));

describe("POST /api/challenges/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId: "first-day-it-support",
        selectedDeviceIds: [],
        topologyChoice: "star",
        troubleshootAnswer: "check_layer1_cable",
      }),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(401);
  });

  it("evaluates submission and awards XP when passed", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 100,
      totalXp: 200,
      message: "+100 XP",
    });

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId: "first-day-it-support",
        selectedDeviceIds: ["router-1", "switch-1", "ap-1", "cable-cat6"],
        topologyChoice: "star",
        troubleshootAnswer: "check_layer1_cable",
      }),
    });

    const res = await challengeSubmitHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.passed).toBe(true);
    expect(data.score).toBe(100);
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "user-1",
      100,
      "CHALLENGE_SOLVED",
      "challenge-first-day-it-support"
    );
  });
});
