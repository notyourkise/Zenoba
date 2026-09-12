import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST as moduleAssessmentHandler } from "@/app/api/learning/assessment/module/route";
import * as authLib from "@/lib/auth";
import * as assessmentService from "@/features/learning/assessment/service";
import {
  AssessmentNotFoundError,
  AssessmentLockedError,
  AssessmentConflictError,
} from "@/features/learning/assessment/errors";
import { CourseAccessDeniedError } from "@/features/commerce/access";

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    requireLearnerActor: vi.fn(),
  };
});

vi.mock("@/features/learning/assessment/service", () => ({
  submitModuleFinalAssessment: vi.fn(),
}));

describe("POST /api/learning/assessment/module", () => {
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

  const validPayload = {
    moduleId: "welcome-to-networking",
    conceptAnswers: { "final-wn-f01": "opt-b" },
    practicalState: {
      links: [
        { from: "pc-katalog", to: "switch-perpus", status: "connected" },
        { from: "pc-sirkulasi", to: "switch-perpus", status: "connected" },
        { from: "printer-barcode", to: "switch-perpus", status: "connected" },
      ],
      ispUplinkConnected: false,
      verifiedPrints: [
        { client: "pc-katalog", target: "printer-barcode", success: true },
      ],
    },
    requestId: "req-mod-1",
  };

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("UNAUTHENTICATED", "Authentication required")
    );

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when actor is DEVELOPER", async () => {
    vi.mocked(authLib.requireLearnerActor).mockRejectedValueOnce(
      new authLib.AuthorizationError("FORBIDDEN", "Learner workspace access required")
    );

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Learner workspace access required");
  });

  it("returns 400 on malformed body or missing fields", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId: "welcome-to-networking" }), // missing practicalState
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when module is not found", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(assessmentService.submitModuleFinalAssessment).mockRejectedValueOnce(
      new AssessmentNotFoundError("Modul 'unknown' tidak ditemukan.")
    );

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(404);
  });

  it("returns 403 when module is locked", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(assessmentService.submitModuleFinalAssessment).mockRejectedValueOnce(
      new AssessmentLockedError("Modul belum dapat diakses.")
    );

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(403);
  });

  it("returns 403 when learning path access is denied", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(assessmentService.submitModuleFinalAssessment).mockRejectedValueOnce(
      new CourseAccessDeniedError("Access denied")
    );

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(403);
  });

  it("returns 409 when duplicate requestId conflict occurs", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(assessmentService.submitModuleFinalAssessment).mockRejectedValueOnce(
      new AssessmentConflictError("Request ID conflict.")
    );

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(409);
  });

  it("returns 200 with detailed assessment evaluation results on valid submit for LEARNER", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce(mockLearnerActor);

    vi.mocked(assessmentService.submitModuleFinalAssessment).mockResolvedValueOnce({
      passed: true,
      score: 100,
      conceptScore: 10,
      conceptMax: 10,
      conceptPassed: true,
      practicalPassed: true,
      practicalResults: [
        { id: "P01", title: "Physical Reachability", passed: true },
        { id: "P02", title: "Fault Isolation & Repair", passed: true },
        { id: "P03", title: "Local Service Verification", passed: true },
      ],
      unmetOutcomes: [],
      feedback: "Selamat! Anda telah lulus seluruh kriteria evaluasi modul Welcome to Networking.",
      xpResult: {
        awarded: true,
        amount: 100,
        totalXp: 150,
        message: "+100 XP",
      },
      isIdempotentReplay: false,
    });

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.passed).toBe(true);
    expect(data.conceptScore).toBe(10);
    expect(data.practicalPassed).toBe(true);
    expect(data.score).toBe(100);
    expect(assessmentService.submitModuleFinalAssessment).toHaveBeenCalledWith({
      userId: "u-1",
      moduleId: "welcome-to-networking",
      conceptAnswers: validPayload.conceptAnswers,
      practicalState: validPayload.practicalState,
      requestId: "req-mod-1",
    });
  });

  it("returns 200 on valid submit for INTERNAL_LEARNER", async () => {
    vi.mocked(authLib.requireLearnerActor).mockResolvedValueOnce({
      ...mockLearnerActor,
      role: "INTERNAL_LEARNER",
    });

    vi.mocked(assessmentService.submitModuleFinalAssessment).mockResolvedValueOnce({
      passed: true,
      score: 100,
      conceptScore: 10,
      conceptMax: 10,
      conceptPassed: true,
      practicalPassed: true,
      practicalResults: [],
      unmetOutcomes: [],
      feedback: "Selamat!",
      xpResult: null,
      isIdempotentReplay: false,
    });

    const req = new Request("http://localhost:3000/api/learning/assessment/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await moduleAssessmentHandler(req);
    expect(res.status).toBe(200);
  });
});
