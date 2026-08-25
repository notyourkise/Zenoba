import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as quizSubmitHandler } from "@/app/api/learning/quiz/submit/route";
import * as authLib from "@/lib/auth";
import * as xpLedger from "@/features/xp/ledger";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/xp/ledger", () => ({
  awardXp: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    quizAttempt: {
      create: vi.fn(),
    },
  },
}));

describe("POST /api/learning/quiz/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "l-1", quizId: "q-1", answer: "opt-1" }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when body payload is missing required fields", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: "l-1" }),
    });

    const res = await quizSubmitHandler(req);
    expect(res.status).toBe(400);
  });

  it("records quiz attempt and awards XP on valid submission", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "u@example.com",
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 10,
      totalXp: 10,
      message: "+10 XP",
    });

    const req = new Request("http://localhost:3000/api/learning/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "l-1",
        quizId: "q-1",
        answer: "opt-correct",
      }),
    });

    const res = await quizSubmitHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.passed).toBe(true);
    expect(xpLedger.awardXp).toHaveBeenCalledWith("u-1", 10, "QUIZ_PASS", "q-1");
  });
});
