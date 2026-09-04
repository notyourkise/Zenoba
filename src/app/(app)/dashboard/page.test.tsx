import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import DashboardPage from "./page";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/learning/progress", () => ({
  getUserProgressSummary: vi.fn(),
}));

vi.mock("@/features/learning/queries", () => ({
  getLearningPathsWithProgress: vi.fn(),
}));

import { getCurrentUser } from "@/lib/auth";
import { getUserProgressSummary } from "@/features/learning/progress";
import { getLearningPathsWithProgress } from "@/features/learning/queries";

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockGetUserProgressSummary = vi.mocked(getUserProgressSummary);
const mockGetLearningPathsWithProgress = vi.mocked(getLearningPathsWithProgress);

describe("DashboardPage (Distilled Workspace)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders active path with progress bar, text metrics, and Continue learning link without marketing content or SVG", async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: "user-1",
      name: "Budi",
      email: "budi@example.com",
      role: "LEARNER",
    } as any);

    mockGetUserProgressSummary.mockResolvedValue({
      totalLessons: 24,
      completedCount: 10,
      inProgressCount: 2,
      completionPercentage: 42,
      totalXp: 450,
    });

    mockGetLearningPathsWithProgress.mockResolvedValue([
      {
        id: "path-1",
        title: "Network Foundations",
        slug: "network-foundations",
        description: "Dasar-dasar jaringan komputer",
        orderIndex: 0,
        modulesCount: 8,
        totalLessonsCount: 24,
        completedLessonsCount: 10,
        progressPercent: 42,
      } as any,
    ]);

    const ui = await DashboardPage();
    const { container } = render(ui);

    // Dashboard heading
    expect(screen.getByRole("heading", { level: 1, name: /Selamat Datang/i })).toBeInTheDocument();

    // Primary Continue learning action
    const ctaLink = screen.getByRole("link", { name: "Continue learning" });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/learn/network-foundations");

    // Text progress context
    expect(screen.getByText(/10 dari 24 pelajaran selesai/i)).toBeInTheDocument();

    // Semantic progress bar
    const progressbar = screen.getByRole("progressbar", { name: "Network Foundations progress" });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "42");

    // Truthful metrics in Learning Progress
    expect(screen.getAllByText(/dari 24 pelajaran selesai/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/sedang dipelajari/i)).toBeInTheDocument();
    expect(screen.getByText(/XP diperoleh/i)).toBeInTheDocument();

    // Practice links
    expect(screen.getByRole("link", { name: "Interactive Labs" })).toHaveAttribute("href", "/labs");
    expect(screen.getByRole("link", { name: "Troubleshooting Challenges" })).toHaveAttribute("href", "/challenges");
    expect(screen.getByRole("link", { name: "Simulasi Konsultan TI" })).toHaveAttribute("href", "/consultant");

    // Public marketing sections must NOT be present
    expect(screen.queryByText("4 Pilar Utama Netloka")).not.toBeInTheDocument();
    expect(screen.queryByText(/Roadmap Pembelajaran & Standar UKK TKJ/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Keunggulan Sistem & Simulasi Deterministik/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Panduan Cepat & Informasi Pembelajaran/i)).not.toBeInTheDocument();

    // No decorative SVGs allowed in distilled dashboard
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders Start learning CTA when active path has zero progress", async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: "user-2",
      name: "Siti",
      email: "siti@example.com",
      role: "LEARNER",
    } as any);

    mockGetUserProgressSummary.mockResolvedValue({
      totalLessons: 24,
      completedCount: 0,
      inProgressCount: 0,
      completionPercentage: 0,
      totalXp: 0,
    });

    mockGetLearningPathsWithProgress.mockResolvedValue([
      {
        id: "path-1",
        title: "Network Foundations",
        slug: "network-foundations",
        description: "Dasar-dasar jaringan komputer",
        orderIndex: 0,
        modulesCount: 8,
        totalLessonsCount: 24,
        completedLessonsCount: 0,
        progressPercent: 0,
      } as any,
    ]);

    const ui = await DashboardPage();
    const { container } = render(ui);

    // Primary action is Start learning
    const startLink = screen.getByRole("link", { name: "Start learning" });
    expect(startLink).toBeInTheDocument();
    expect(startLink).toHaveAttribute("href", "/learn/network-foundations");

    // Truthful progress metrics visible
    expect(screen.getByText(/0 dari 24 pelajaran selesai/i)).toBeInTheDocument();
    expect(screen.getAllByText(/dari 24 pelajaran selesai/i).length).toBeGreaterThanOrEqual(1);

    // No SVGs
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders empty state with Course catalog link when no learning paths are returned", async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: "user-3",
      name: "Rian",
      email: "rian@example.com",
      role: "LEARNER",
    } as any);

    mockGetUserProgressSummary.mockResolvedValue({
      totalLessons: 0,
      completedCount: 0,
      inProgressCount: 0,
      completionPercentage: 0,
      totalXp: 0,
    });

    mockGetLearningPathsWithProgress.mockResolvedValue([]);

    const ui = await DashboardPage();
    const { container } = render(ui);

    // Explanatory empty state
    expect(screen.getByText(/Belum ada jalur pembelajaran yang tersedia/i)).toBeInTheDocument();

    // Link to Course catalog
    const catalogLink = screen.getByRole("link", { name: /Katalog Kursus|Course catalog/i });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute("href", "/catalog");

    // No fake progress bar
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    // Truthful zero metrics remain visible and do not crash
    expect(screen.getByText(/dari 0 pelajaran selesai/i)).toBeInTheDocument();

    // No SVGs
    expect(container.querySelector("svg")).toBeNull();
  });
});
