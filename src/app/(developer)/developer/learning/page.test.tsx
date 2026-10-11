import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DeveloperLearningPage from "./page";
import { requireDeveloperActor } from "@/features/authorization/guards";
import { getAssessmentAnalyticsOverview } from "@/features/developer/overview/queries";
import type { Actor } from "@/features/authorization/types";

vi.mock("@/features/authorization/guards", () => ({
  requireDeveloperActor: vi.fn(),
}));

vi.mock("@/features/developer/overview/queries", () => ({
  getAssessmentAnalyticsOverview: vi.fn(),
}));

const mockActor: Actor = {
  id: "dev-1",
  email: "dev@zenoba.tech",
  name: "Developer One",
  role: "DEVELOPER",
  authVersion: 1,
  twoFactorEnabled: true,
};

describe("DeveloperLearningPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enforces developer authorization guard", async () => {
    vi.mocked(requireDeveloperActor).mockRejectedValueOnce(new Error("UNAUTHORIZED"));

    await expect(DeveloperLearningPage()).rejects.toThrow("UNAUTHORIZED");
    expect(requireDeveloperActor).toHaveBeenCalled();
  });

  it("renders empty state when no assessment data exists", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockActor);

    vi.mocked(getAssessmentAnalyticsOverview).mockResolvedValueOnce({
      totalAssessments: 0,
      totalAttempts: 0,
      healthyCount: 0,
      needsReviewCount: 0,
      suppressedCount: 0,
      items: [],
    });

    const page = await DeveloperLearningPage();
    render(page);

    expect(
      screen.getByRole("heading", { name: /Analitik Pembelajaran & Kesehatan Asesmen/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Belum ada data percobaan asesmen dari learner reguler/i)
    ).toBeInTheDocument();
  });

  it("renders table items with metrics, privacy badges, and suppressed indicators", async () => {
    vi.mocked(requireDeveloperActor).mockResolvedValueOnce(mockActor);

    vi.mocked(getAssessmentAnalyticsOverview).mockResolvedValueOnce({
      totalAssessments: 2,
      totalAttempts: 25,
      healthyCount: 1,
      needsReviewCount: 0,
      suppressedCount: 1,
      items: [
        {
          assessmentId: "quiz-net-1",
          outcomeId: "out-1",
          outcomeText: "Memahami konsep subnetting dasar",
          moduleId: "m-1",
          moduleTitle: "Subnetting",
          lessonTitle: "Dasar Subnet",
          contentVersion: "1.0",
          attemptCount: 20,
          distinctLearners: 15,
          firstAttemptPassRate: 0.8,
          retryPassRate: 1.0,
          medianAttemptsToPass: 1.5,
          failureRate: 0.2,
          isSuppressed: false,
          suppressionReason: null,
        },
        {
          assessmentId: "quiz-small-1",
          outcomeId: "out-2",
          outcomeText: "Analisis rute BGP lanjutan",
          contentVersion: "1.0",
          attemptCount: 5,
          distinctLearners: 3,
          firstAttemptPassRate: null,
          retryPassRate: null,
          medianAttemptsToPass: null,
          failureRate: null,
          isSuppressed: true,
          suppressionReason: "COHORT_TOO_SMALL",
        },
      ],
    });

    const page = await DeveloperLearningPage();
    render(page);

    expect(screen.getByText("quiz-net-1")).toBeInTheDocument();
    expect(screen.getByText("Memahami konsep subnetting dasar")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("1.5x")).toBeInTheDocument();
    expect(screen.getByText("SEHAT")).toBeInTheDocument();

    expect(screen.getByText("quiz-small-1")).toBeInTheDocument();
    expect(screen.getByText("Analisis rute BGP lanjutan")).toBeInTheDocument();
    expect(screen.getByText("TERLINDUNGI")).toBeInTheDocument();
  });
});
