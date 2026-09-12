/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as challengeSlugSubmitHandler } from "@/app/api/challenges/[challengeSlug]/submit/route";
import * as authLib from "@/lib/auth";
import * as xpLedger from "@/features/xp/ledger";
import * as challengeEngine from "@/features/challenges/engine";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    requireLearnerActor: vi.fn(),
  };
});

vi.mock("@/features/xp/ledger", () => ({
  awardXp: vi.fn(),
}));

vi.mock("@/features/challenges/engine", () => ({
  evaluateChallengeDiagnosis: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    challenge: {
      findUnique: vi.fn(),
    },
    challengeAttempt: {
      create: vi.fn(),
    },
  },
}));

describe("POST /api/challenges/[challengeSlug]/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockLearnerActor = {
    id: "u-1",
    email: "u@example.com",
    name: "Learner One",
    role: "LEARNER" as const,
    authVersion: 1,
    twoFactorEnabled: false,
  };

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("UNAUTHENTICATED", "Authentication required")
    );

    const req = new Request("http://localhost:3000/api/challenges/test-challenge/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission: {} }),
    });

    const res = await challengeSlugSubmitHandler(req, {
      params: Promise.resolve({ challengeSlug: "test-challenge" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 403 when actor is DEVELOPER", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("FORBIDDEN", "Learner workspace access required")
    );

    const req = new Request("http://localhost:3000/api/challenges/test-challenge/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission: {} }),
    });

    const res = await challengeSlugSubmitHandler(req, {
      params: Promise.resolve({ challengeSlug: "test-challenge" }),
    });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Learner workspace access required");
  });

  it("allows submission for LEARNER actor and awards XP on pass", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(challengeEngine.evaluateChallengeDiagnosis).mockReturnValueOnce({
      passed: true,
      score: 100,
      maxScore: 100,
      rootCauseFeedback: "Diagnosa tepat",
      explanation: "Penjelasan lengkap",
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 150,
      totalXp: 300,
      message: "+150 XP",
    });

    vi.mocked(prisma.challenge.findUnique).mockResolvedValueOnce({
      id: "ch-1",
      slug: "test-challenge",
    } as any);

    const req = new Request("http://localhost:3000/api/challenges/test-challenge/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission: { cause: "cable" } }),
    });

    const res = await challengeSlugSubmitHandler(req, {
      params: Promise.resolve({ challengeSlug: "test-challenge" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(true);
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "u-1",
      150,
      "CHALLENGE_SOLVED",
      "challenge-test-challenge"
    );
  });

  it("allows submission for INTERNAL_LEARNER actor", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({
      ...mockLearnerActor,
      role: "INTERNAL_LEARNER",
    });

    vi.mocked(challengeEngine.evaluateChallengeDiagnosis).mockReturnValueOnce({
      passed: false,
      score: 0,
      maxScore: 100,
      rootCauseFeedback: "Belum tepat",
      explanation: "Periksa kembali",
    });

    const req = new Request("http://localhost:3000/api/challenges/test-challenge/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission: {} }),
    });

    const res = await challengeSlugSubmitHandler(req, {
      params: Promise.resolve({ challengeSlug: "test-challenge" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(false);
  });
});
