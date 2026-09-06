/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as challengeSubmitHandler } from "@/app/api/challenges/submit/route";
import * as authLib from "@/lib/auth";
import * as xpLedger from "@/features/xp/ledger";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/xp/ledger", () => ({
  awardXp: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learningPath: {
      findUnique: vi.fn(),
    },
    userLessonProgress: {
      findMany: vi.fn(),
    },
    assessmentAttempt: {
      create: vi.fn(),
    },
    challenge: {
      findUnique: vi.fn(),
    },
    challengeAttempt: {
      create: vi.fn(),
    },
  },
}));

describe("POST /api/challenges/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPassingSubmission = {
    challengeId: "first-day-it-support",
    selectedDeviceIds: ["router-1", "switch-1", "ap-1", "cable-cat6"],
    topologyChoice: "star",
    troubleshootAnswer: "check_layer1_cable",
  };

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPassingSubmission),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(401);
  });

  it("evaluates submission and awards XP when passed in standalone mode", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 150,
      totalXp: 250,
      message: "+150 XP",
    });

    vi.mocked(prisma.challenge.findUnique).mockResolvedValueOnce({
      id: "ch-1",
      slug: "first-day-it-support",
    } as any);

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPassingSubmission),
    });

    const res = await challengeSubmitHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.passed).toBe(true);
    expect(data.score).toBe(100);
    expect(data.outcomeResults).toHaveLength(4);
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "user-1",
      150,
      "CHALLENGE_SOLVED",
      "challenge-first-day-it-support"
    );

    expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          assessmentId: "challenge-first-day-it-support",
          score: 100,
          passed: true,
        }),
      })
    );

    expect(prisma.challengeAttempt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          challengeId: "ch-1",
          score: 100,
          passed: true,
        }),
      })
    );
  });

  it("rejects with 403 when submitted as isPathFinal: true and user has incomplete lessons", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
    });

    // 19 lessons mock
    const fakeLessons = Array.from({ length: 19 }, (_, i) => ({ id: `lesson-${i + 1}` }));
    vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
      id: "p1",
      slug: "network-foundations",
      modules: [
        {
          id: "m1",
          lessons: fakeLessons,
        },
      ],
    } as any);

    // User has only completed 10 lessons
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
      fakeLessons.slice(0, 10).map((l) => ({ lessonId: l.id })) as any
    );

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPassingSubmission,
        isPathFinal: true,
      }),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.code).toBe("PREREQUISITES_INCOMPLETE");
    expect(data.completedLessons).toBe(10);
    expect(data.totalLessons).toBe(19);
    expect(xpLedger.awardXp).not.toHaveBeenCalled();
  });

  it("accepts and awards XP when submitted as isPathFinal: true and all 19 lessons are completed", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
    });

    const fakeLessons = Array.from({ length: 19 }, (_, i) => ({ id: `lesson-${i + 1}` }));
    vi.mocked(prisma.learningPath.findUnique).mockResolvedValueOnce({
      id: "p1",
      slug: "network-foundations",
      modules: [
        {
          id: "m1",
          lessons: fakeLessons,
        },
      ],
    } as any);

    // User has completed all 19 lessons
    vi.mocked(prisma.userLessonProgress.findMany).mockResolvedValueOnce(
      fakeLessons.map((l) => ({ lessonId: l.id })) as any
    );

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 150,
      totalXp: 350,
      message: "+150 XP",
    });

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validPassingSubmission,
        isPathFinal: true,
      }),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(true);
    expect(data.isPathFinal).toBe(true);

    expect(prisma.assessmentAttempt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          assessmentId: "path-network-foundations-final",
          score: 100,
          passed: true,
        }),
      })
    );
  });

  it("handles idempotent replay gracefully when XP has already been awarded", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "u@example.com",
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: false,
      amount: 0,
      totalXp: 350,
      message: "XP has already been awarded for this activity",
    });

    const req = new Request("http://localhost:3000/api/challenges/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPassingSubmission),
    });

    const res = await challengeSubmitHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(true);
    expect(data.xpResult.awarded).toBe(false);
  });
});
