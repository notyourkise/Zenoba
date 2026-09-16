/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as consultantSubmitHandler } from "@/app/api/consultant/[caseSlug]/submit/route";
import * as authLib from "@/lib/auth";
import * as xpLedger from "@/features/xp/ledger";
import * as scoringEngine from "@/features/consultant/scoring/engine";
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

vi.mock("@/features/consultant/scoring/engine", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/consultant/scoring/engine")>();
  return {
    ...actual,
    evaluateConsultantProject: vi.fn(),
  };
});

vi.mock("@/lib/db/client", () => ({
  prisma: {
    consultantCase: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    consultantProject: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("POST /api/consultant/[caseSlug]/submit", () => {
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

  const validSubmissionBody = {
    boqItems: [{ deviceId: "router-1", quantity: 1, unitPrice: 5000000 }],
    topologyData: { nodes: [], edges: [] },
    ipPlan: { subnets: [] },
    vlanPlan: [],
  };

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("UNAUTHENTICATED", "Authentication required")
    );

    const req = new Request("http://localhost:3000/api/consultant/small-office-notaris/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validSubmissionBody),
    });

    const res = await consultantSubmitHandler(req, {
      params: Promise.resolve({ caseSlug: "small-office-notaris" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 403 when actor is DEVELOPER", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("FORBIDDEN", "Learner workspace access required")
    );

    const req = new Request("http://localhost:3000/api/consultant/small-office-notaris/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validSubmissionBody),
    });

    const res = await consultantSubmitHandler(req, {
      params: Promise.resolve({ caseSlug: "small-office-notaris" }),
    });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Learner workspace access required");
  });

  it("allows submission for LEARNER actor and awards XP on pass", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(scoringEngine.evaluateConsultantProject).mockReturnValueOnce({
      passed: true,
      totalScore: 85,
      maxTotalScore: 100,
      dimensions: {
        technicalCorrectness: 18,
        requirementFulfillment: 18,
        costEfficiency: 17,
        scalability: 16,
        security: 16,
      },
      feedback: {
        technical: "Bagus",
        cost: "Sesuai anggaran",
        scalability: "Cukup",
        security: "Aman",
      },
    } as any);

    vi.mocked(xpLedger.awardXp).mockResolvedValueOnce({
      awarded: true,
      amount: 250,
      totalXp: 500,
      message: "+250 XP",
    });

    vi.mocked(prisma.consultantCase.findUnique).mockResolvedValueOnce({
      id: "case-1",
      slug: "small-office-notaris",
    } as any);

    const req = new Request("http://localhost:3000/api/consultant/small-office-notaris/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validSubmissionBody),
    });

    const res = await consultantSubmitHandler(req, {
      params: Promise.resolve({ caseSlug: "small-office-notaris" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(true);
    expect(data.totalScore).toBe(85);
    expect(data.rubricVersion).toBe("1.1");
    expect(Array.isArray(data.strengths)).toBe(true);
    expect(Array.isArray(data.blockingIssues)).toBe(true);
    expect(Array.isArray(data.nextActions)).toBe(true);
    expect(xpLedger.awardXp).toHaveBeenCalledWith(
      "u-1",
      250,
      "CONSULTANT_PROJECT_PASSED",
      "consultant-small-office-notaris"
    );
  });

  it("allows submission for INTERNAL_LEARNER actor", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({
      ...mockLearnerActor,
      role: "INTERNAL_LEARNER",
    });

    vi.mocked(scoringEngine.evaluateConsultantProject).mockReturnValueOnce({
      passed: false,
      totalScore: 60,
      maxTotalScore: 100,
      dimensions: {
        technicalCorrectness: 12,
        requirementFulfillment: 12,
        costEfficiency: 12,
        scalability: 12,
        security: 12,
      },
      feedback: {
        technical: "Perlu revisi",
        cost: "Sesuai",
        scalability: "Kurang",
        security: "Cukup",
      },
    } as any);

    vi.mocked(prisma.consultantCase.findUnique).mockResolvedValueOnce({
      id: "case-1",
      slug: "small-office-notaris",
    } as any);

    const req = new Request("http://localhost:3000/api/consultant/small-office-notaris/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validSubmissionBody),
    });

    const res = await consultantSubmitHandler(req, {
      params: Promise.resolve({ caseSlug: "small-office-notaris" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.passed).toBe(false);
  });
});
