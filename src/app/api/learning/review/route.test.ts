import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { AuthorizationError } from "@/lib/auth";

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    requireLearnerActor: vi.fn(),
  };
});

vi.mock("@/features/learning/review-service", () => ({
  getLearnerReviewSession: vi.fn(),
  rateOutcomeReview: vi.fn(),
}));

import { requireLearnerActor } from "@/lib/auth";
import {
  getLearnerReviewSession,
  rateOutcomeReview,
} from "@/features/learning/review-service";

const mockRequireLearnerActor = requireLearnerActor as unknown as ReturnType<typeof vi.fn>;
const mockGetLearnerReviewSession = getLearnerReviewSession as unknown as ReturnType<typeof vi.fn>;
const mockRateOutcomeReview = rateOutcomeReview as unknown as ReturnType<typeof vi.fn>;

describe("Review API Routes (/api/learning/review)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/learning/review", () => {
    it("returns 401 if unauthenticated", async () => {
      mockRequireLearnerActor.mockRejectedValue(new AuthorizationError("UNAUTHENTICATED"));

      const res = await GET();
      expect(res.status).toBe(401);
    });

    it("returns 200 with review session data for authenticated learner", async () => {
      mockRequireLearnerActor.mockResolvedValue({ id: "user-1", role: "LEARNER" });
      mockGetLearnerReviewSession.mockResolvedValue({
        dueReviews: [],
        upcomingReviews: [],
        stats: { dueCount: 0, completedTodayCount: 0, totalTrackedCount: 0 },
      });

      const res = await GET();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.stats.dueCount).toBe(0);
    });
  });

  describe("POST /api/learning/review", () => {
    it("returns 401 if unauthenticated", async () => {
      mockRequireLearnerActor.mockRejectedValue(new AuthorizationError("UNAUTHENTICATED"));

      const req = new Request("http://localhost/api/learning/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcomeId: "PLAN-L1-A", rating: "GOOD" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("returns 400 on invalid rating or missing outcomeId", async () => {
      mockRequireLearnerActor.mockResolvedValue({ id: "user-1", role: "LEARNER" });

      const req = new Request("http://localhost/api/learning/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcomeId: "", rating: "INVALID" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("evaluates and records review rating successfully", async () => {
      mockRequireLearnerActor.mockResolvedValue({ id: "user-1", role: "LEARNER" });
      mockRateOutcomeReview.mockResolvedValue({
        outcomeId: "PLAN-L1-A",
        intervalDays: 3,
        consecutiveSuccesses: 1,
      });

      const req = new Request("http://localhost/api/learning/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcomeId: "PLAN-L1-A", rating: "GOOD" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.item.consecutiveSuccesses).toBe(1);
    });
  });
});
