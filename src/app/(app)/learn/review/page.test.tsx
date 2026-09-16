import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReviewPage from "./page";

vi.mock("@/features/authorization/guards", () => ({
  requireLearnerActor: vi.fn().mockResolvedValue({ id: "user-1", role: "LEARNER" }),
}));

vi.mock("@/features/learning/review-service", () => ({
  getLearnerReviewSession: vi.fn(),
}));

import { getLearnerReviewSession } from "@/features/learning/review-service";

const mockGetLearnerReviewSession = vi.mocked(getLearnerReviewSession);

describe("Review Page (/learn/review)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when there are no reviews due", async () => {
    mockGetLearnerReviewSession.mockResolvedValue({
      dueReviews: [],
      upcomingReviews: [
        {
          outcomeId: "PLAN-L1-A",
          text: "Konsep Dasar Jaringan",
          description: "Penjelasan konsep dasar",
          moduleId: "mod-1",
          moduleSlug: "mod-one",
          moduleTitle: "Module 1",
          pathSlug: "net-foundations",
          pathTitle: "Network Foundations",
          dueAt: new Date(Date.now() + 86400000).toISOString(),
          intervalDays: 1,
          consecutiveSuccesses: 1,
          daysRemaining: 1,
          isDue: false,
        },
      ],
      stats: {
        dueCount: 0,
        completedTodayCount: 0,
        totalTrackedCount: 1,
      },
    });

    const jsx = await ReviewPage({ searchParams: Promise.resolve({}) });
    render(jsx);

    expect(
      screen.getByRole("heading", { name: /Review Berkala Sasaran Kompetensi/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Semua Review Jatuh Tempo Telah Selesai")
    ).toBeInTheDocument();
    expect(screen.getByText("Konsep Dasar Jaringan")).toBeInTheDocument();
  });

  it("renders active review card and rating actions when reviews are due", async () => {
    mockGetLearnerReviewSession.mockResolvedValue({
      dueReviews: [
        {
          outcomeId: "PLAN-L1-A",
          text: "Konsep Dasar Jaringan",
          description: "Prinsip dasar pengalamatan dan transmisi data",
          moduleId: "mod-1",
          moduleSlug: "mod-one",
          moduleTitle: "Module 1",
          pathSlug: "net-foundations",
          pathTitle: "Network Foundations",
          lessonId: "les-1",
          lessonSlug: "orientasi-platform",
          lessonTitle: "Orientasi Platform",
          dueAt: new Date(Date.now() - 86400000).toISOString(),
          intervalDays: 1,
          consecutiveSuccesses: 0,
          daysRemaining: 0,
          isDue: true,
        },
      ],
      upcomingReviews: [],
      stats: {
        dueCount: 1,
        completedTodayCount: 0,
        totalTrackedCount: 1,
      },
    });

    // Mock fetch for rating submit
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        item: {
          outcomeId: "PLAN-L1-A",
          text: "Konsep Dasar Jaringan",
          dueAt: new Date(Date.now() + 3 * 86400000).toISOString(),
          intervalDays: 3,
          consecutiveSuccesses: 1,
          daysRemaining: 3,
          isDue: false,
        },
      }),
    });

    const jsx = await ReviewPage({ searchParams: Promise.resolve({}) });
    render(jsx);

    expect(screen.getByText("Konsep Dasar Jaringan")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Tampilkan Poin Kunci Konsep/i })
    ).toBeInTheDocument();

    // Toggle key points
    fireEvent.click(screen.getByRole("button", { name: /Tampilkan Poin Kunci Konsep/i }));
    expect(
      screen.getByText("Prinsip dasar pengalamatan dan transmisi data")
    ).toBeInTheDocument();

    // Click rating button "Paham (GOOD)"
    const goodButton = screen.getByRole("button", { name: /Paham \(GOOD\)/i });
    fireEvent.click(goodButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/learning/review",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ outcomeId: "PLAN-L1-A", rating: "GOOD" }),
        })
      );
    });

    // After rating submitted, transition to zero-due state
    await waitFor(() => {
      expect(
        screen.getByText("Semua Review Jatuh Tempo Telah Selesai")
      ).toBeInTheDocument();
    });
  });
});
