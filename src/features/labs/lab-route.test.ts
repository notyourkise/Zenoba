/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as labSubmitHandler } from "@/app/api/labs/[labSlug]/submit/route";
import * as authLib from "@/lib/auth";
import * as xpLedger from "@/features/xp/ledger";
import * as labEvaluator from "@/features/labs/evaluator";
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

vi.mock("@/features/labs/evaluator", () => ({
  evaluateLabSubmission: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    lab: {
      findUnique: vi.fn(),
    },
    labAttempt: {
      create: vi.fn(),
    },
  },
}));

describe("POST /api/labs/[labSlug]/submit", () => {
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

    const req = new Request("http://localhost:3000/api/labs/test-lab/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: {} }),
    });

    const res = await labSubmitHandler(req, {
      params: Promise.resolve({ labSlug: "test-lab" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 403 when actor is DEVELOPER", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("FORBIDDEN", "Learner workspace access required")
    );

    const req = new Request("http://localhost:3000/api/labs/test-lab/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: {} }),
    });

    const res = await labSubmitHandler(req, {
      params: Promise.resolve({ labSlug: "test-lab" }),
    });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Learner workspace access required");
  });

  it("allows submission for LEARNER actor and awards XP on pass", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(labEvaluator.evaluateLabSubmission).mockReturnValueOnce({
      passed: true,
      score: 100,
      maxScore: 100,
      feedback: ["Lab selesai dengan sempurna"],
    });

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 100,
      totalXp: 200,
      message: "+100 XP",
    });

    vi.mocked(prisma.lab.findUnique).mockResolvedValueOnce({
      id: "lab-1",
      slug: "test-lab",
    } as any);

    const req = new Request("http://localhost:3000/api/labs/test-lab/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: { connected: true } }),
    });

    const res = await labSubmitHandler(req, {
      params: Promise.resolve({ labSlug: "test-lab" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(true);
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "u-1",
      100,
      "LAB_COMPLETED",
      "lab-test-lab"
    );
  });

  it("allows submission for INTERNAL_LEARNER actor", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({
      ...mockLearnerActor,
      role: "INTERNAL_LEARNER",
    });

    vi.mocked(labEvaluator.evaluateLabSubmission).mockReturnValueOnce({
      passed: false,
      score: 50,
      maxScore: 100,
      feedback: ["Beberapa konfigurasi belum lengkap"],
    });

    const req = new Request("http://localhost:3000/api/labs/test-lab/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: {} }),
    });

    const res = await labSubmitHandler(req, {
      params: Promise.resolve({ labSlug: "test-lab" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(false);
  });
});
