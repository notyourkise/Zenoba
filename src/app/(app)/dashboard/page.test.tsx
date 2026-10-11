import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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

vi.mock("@/features/dashboard/queries", () => ({
  getDashboardContinuationData: vi.fn(),
}));

import { getCurrentUser } from "@/lib/auth";
import { getUserProgressSummary } from "@/features/learning/progress";
import { getLearningPathsWithProgress } from "@/features/learning/queries";
import { getDashboardContinuationData } from "@/features/dashboard/queries";

type MockUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockGetUserProgressSummary = vi.mocked(getUserProgressSummary);
const mockGetLearningPathsWithProgress = vi.mocked(getLearningPathsWithProgress);
const mockGetDashboardContinuationData = vi.mocked(getDashboardContinuationData);

describe("DashboardPage (Cosmic Orbital Workspace)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetDashboardContinuationData.mockResolvedValue({
      primaryAction: null,
      queue: [],
      isComplete: false,
    });
  });

  it("renders active path with cosmic hero, stat cards, progress donut, and practice cards", async () => {
    const user: MockUser = {
      id: "user-1",
      name: "Budi Zenoba",
      email: "budi@example.com",
      role: "LEARNER",
      streakCount: 5,
    };
    mockGetCurrentUser.mockResolvedValue(user);

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
        icon: null,
        orderIndex: 0,
        modulesCount: 8,
        totalLessonsCount: 24,
        completedLessonsCount: 10,
        progressPercent: 42,
      },
    ]);

    mockGetDashboardContinuationData.mockResolvedValue({
      primaryAction: {
        kind: "RESUME",
        href: "/learn/network-foundations",
        title: "Network Foundations",
        moduleTitle: "Welcome to Networking",
        pathTitle: "Network Foundations",
        reason: "Lanjutkan pelajaran yang sedang berlangsung",
        priority: 2,
      },
      queue: [
        {
          kind: "RESUME",
          href: "/learn/network-foundations",
          title: "Network Foundations",
          moduleTitle: "Welcome to Networking",
          pathTitle: "Network Foundations",
          reason: "Lanjutkan pelajaran yang sedang berlangsung",
          priority: 2,
        },
      ],
      isComplete: false,
    });

    const ui = await DashboardPage();
    render(ui);

    // Dashboard heading
    expect(screen.getByRole("heading", { level: 1, name: /Budi/i })).toBeInTheDocument();
    expect(screen.getByText(/Zenoba!/i)).toBeInTheDocument();

    // Zenoba orbital quote
    expect(screen.getByText(/Better Networks/i)).toBeInTheDocument();

    // Primary Lanjutkan Belajar action in hero & resume card
    const ctaLinks = screen.getAllByRole("link", { name: /Lanjutkan Belajar/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    expect(ctaLinks[0]).toHaveAttribute("href", "/learn/network-foundations");

    // 4 Stat cards
    expect(screen.getByText("Total Kursus")).toBeInTheDocument();
    expect(screen.getByText("Sedang Dipelajari")).toBeInTheDocument();
    expect(screen.getAllByText("Selesai").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Streak Belajar")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByLabelText("5 hari")).toBeInTheDocument();

    // Donut Progress & Text progress context
    expect(screen.getAllByText(/10 dari 24 pelajaran selesai/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/42%/i).length).toBeGreaterThanOrEqual(1);

    // Semantic progress bar
    const progressbar = screen.getByRole("progressbar", { name: "Progres Belajar" });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "42");

    // Sub-metrics
    expect(screen.getByText(/XP diperoleh/i)).toBeInTheDocument();

    // Lanjutkan dari Terakhir section
    expect(screen.getByText("Lanjutkan dari Terakhir")).toBeInTheDocument();

    // Practice & Exploration links
    expect(screen.getByRole("link", { name: "Mulai Praktik" })).toHaveAttribute("href", "/labs");
    expect(screen.getByRole("link", { name: "Mulai Tantangan" })).toHaveAttribute("href", "/challenges");
    expect(screen.getByRole("link", { name: "Mulai Simulasi" })).toHaveAttribute("href", "/consultant");
  });

  it("renders Mulai Belajar CTA when active path has zero progress", async () => {
    const user: MockUser = {
      id: "user-2",
      name: "Siti Zenoba",
      email: "siti@example.com",
      role: "LEARNER",
    };
    mockGetCurrentUser.mockResolvedValue(user);

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
        icon: null,
        orderIndex: 0,
        modulesCount: 8,
        totalLessonsCount: 24,
        completedLessonsCount: 0,
        progressPercent: 0,
      },
    ]);

    mockGetDashboardContinuationData.mockResolvedValue({
      primaryAction: {
        kind: "NEXT_LESSON",
        href: "/learn/network-foundations",
        title: "Network Foundations",
        moduleTitle: "Welcome to Networking",
        pathTitle: "Network Foundations",
        reason: "Pelajaran berikutnya yang siap dipelajari",
        priority: 4,
      },
      queue: [],
      isComplete: false,
    });

    const ui = await DashboardPage();
    render(ui);

    // Primary action is Mulai Belajar
    const startLinks = screen.getAllByRole("link", { name: /Mulai Belajar/i });
    expect(startLinks.length).toBeGreaterThanOrEqual(1);
    expect(startLinks[0]).toHaveAttribute("href", "/learn/network-foundations");

    // Truthful progress metrics visible
    expect(screen.getByText(/0 dari 24 pelajaran selesai/i)).toBeInTheDocument();
  });

  it("renders empty state with Jelajahi Katalog Kursus link when no learning paths are returned", async () => {
    const user: MockUser = {
      id: "user-3",
      name: "Rian Zenoba",
      email: "rian@example.com",
      role: "LEARNER",
    };
    mockGetCurrentUser.mockResolvedValue(user);

    mockGetUserProgressSummary.mockResolvedValue({
      totalLessons: 0,
      completedCount: 0,
      inProgressCount: 0,
      completionPercentage: 0,
      totalXp: 0,
    });

    mockGetLearningPathsWithProgress.mockResolvedValue([]);
    mockGetDashboardContinuationData.mockResolvedValue({
      primaryAction: null,
      queue: [],
      isComplete: false,
    });

    const ui = await DashboardPage();
    render(ui);

    // Explanatory empty state
    expect(screen.getByText(/Belum ada aktivitas belajar/i)).toBeInTheDocument();

    // Link to Course catalog in Lanjutkan dari Terakhir
    const catalogLink = screen.getByRole("link", { name: /Jelajahi Katalog Kursus/i });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute("href", "/catalog");

    // Metrics visible
    expect(screen.getByText(/0 dari 15 pelajaran selesai/i)).toBeInTheDocument();
  });

  it("renders prioritized learning queue with remediation and upcoming items", async () => {
    const user: MockUser = {
      id: "user-4",
      name: "Dedi Zenoba",
      email: "dedi@example.com",
      role: "LEARNER",
    };
    mockGetCurrentUser.mockResolvedValue(user);
    mockGetUserProgressSummary.mockResolvedValue({
      totalLessons: 24,
      completedCount: 4,
      inProgressCount: 1,
      completionPercentage: 16,
      totalXp: 200,
    });
    mockGetLearningPathsWithProgress.mockResolvedValue([]);

    mockGetDashboardContinuationData.mockResolvedValue({
      primaryAction: {
        kind: "REMEDIATION",
        href: "/learn/network-foundations/welcome-to-networking/assessment",
        title: "Uji Kompetensi: Welcome to Networking",
        moduleTitle: "Welcome to Networking",
        pathTitle: "Network Foundations",
        reason: "Perlu perbaikan uji kompetensi (skor sebelumnya: 60%)",
        priority: 1,
      },
      queue: [
        {
          kind: "REMEDIATION",
          href: "/learn/network-foundations/welcome-to-networking/assessment",
          title: "Uji Kompetensi: Welcome to Networking",
          moduleTitle: "Welcome to Networking",
          pathTitle: "Network Foundations",
          reason: "Perlu perbaikan uji kompetensi (skor sebelumnya: 60%)",
          priority: 1,
        },
        {
          kind: "RESUME",
          href: "/learn/network-foundations/welcome-to-networking/intro-to-networking",
          title: "Apa Itu Jaringan Komputer?",
          moduleTitle: "Welcome to Networking",
          pathTitle: "Network Foundations",
          reason: "Lanjutkan pelajaran yang sedang berlangsung",
          priority: 2,
        },
        {
          kind: "NEXT_LESSON",
          href: "/learn/network-foundations/welcome-to-networking/network-devices",
          title: "Perangkat Jaringan",
          moduleTitle: "Welcome to Networking",
          pathTitle: "Network Foundations",
          reason: "Pelajaran berikutnya yang siap dipelajari",
          priority: 4,
        },
      ],
      isComplete: false,
    });

    const ui = await DashboardPage();
    render(ui);

    // Primary action remediation badge and CTA
    expect(screen.getByText("Remediasi")).toBeInTheDocument();
    const remediationLink = screen.getByRole("link", { name: "Mulai Remediasi" });
    expect(remediationLink).toHaveAttribute(
      "href",
      "/learn/network-foundations/welcome-to-networking/assessment"
    );

    // Antrean Pembelajaran Berikutnya
    expect(
      screen.getByText("Antrean Pembelajaran Berikutnya")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Apa Itu Jaringan Komputer?")
    ).toBeInTheDocument();
    expect(screen.getByText("Perangkat Jaringan")).toBeInTheDocument();
    expect(screen.getByText("Lanjutkan")).toBeInTheDocument();
    expect(screen.getByText("Pelajaran Berikutnya")).toBeInTheDocument();
  });

  it("renders celebratory completion state when all curriculum is complete", async () => {
    const user: MockUser = {
      id: "user-5",
      name: "Sinta Zenoba",
      email: "sinta@example.com",
      role: "LEARNER",
    };
    mockGetCurrentUser.mockResolvedValue(user);
    mockGetUserProgressSummary.mockResolvedValue({
      totalLessons: 24,
      completedCount: 24,
      inProgressCount: 0,
      completionPercentage: 100,
      totalXp: 1200,
    });
    mockGetLearningPathsWithProgress.mockResolvedValue([]);

    mockGetDashboardContinuationData.mockResolvedValue({
      primaryAction: null,
      queue: [],
      isComplete: true,
    });

    const ui = await DashboardPage();
    render(ui);

    expect(screen.getByText("Kurikulum Selesai")).toBeInTheDocument();
    expect(
      screen.getByText(/Selamat! Anda telah menyelesaikan seluruh kurikulum/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Proyek Konsultan" })
    ).toHaveAttribute("href", "/consultant");
    expect(screen.getByRole("link", { name: "Lab Praktik" })).toHaveAttribute(
      "href",
      "/labs"
    );
  });
});
