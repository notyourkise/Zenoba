import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LearnerMasteryPage from "./page";
import { requireLearnerActor } from "@/features/authorization/guards";
import { getLearnerMasteryOverview } from "@/features/learning/mastery-queries";

vi.mock("@/features/authorization/guards", () => ({
  requireLearnerActor: vi.fn(),
}));

vi.mock("@/features/learning/mastery-queries", () => ({
  getLearnerMasteryOverview: vi.fn(),
}));

const mockRequireLearnerActor = vi.mocked(requireLearnerActor);
const mockGetLearnerMasteryOverview = vi.mocked(getLearnerMasteryOverview);

describe("LearnerMasteryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireLearnerActor.mockResolvedValue({
      id: "learner-user-1",
      email: "learner@netloka.biz.id",
      role: "LEARNER",
    } as never);
  });

  it("renders empty state when no curriculum modules exist", async () => {
    mockGetLearnerMasteryOverview.mockResolvedValueOnce({
      totalOutcomes: 0,
      masteredCount: 0,
      needsReviewCount: 0,
      inProgressCount: 0,
      notStartedCount: 0,
      masteryPercentage: 0,
      modules: [],
    });

    const ui = await LearnerMasteryPage();
    render(ui);

    expect(screen.getByText("Penguasaan Materi & Remediasi")).toBeDefined();
    expect(screen.getByText("Belum ada modul kurikulum yang terkonfigurasi.")).toBeDefined();
  });

  it("renders summary statistics and module outcomes with remediation links", async () => {
    mockGetLearnerMasteryOverview.mockResolvedValueOnce({
      totalOutcomes: 3,
      masteredCount: 1,
      needsReviewCount: 1,
      inProgressCount: 1,
      notStartedCount: 0,
      masteryPercentage: 33,
      modules: [
        {
          moduleId: "mod-1",
          moduleSlug: "ip-addressing",
          moduleTitle: "Pengalamatan IPv4",
          pathId: "path-1",
          pathSlug: "network-fundamentals",
          pathTitle: "Dasar Jaringan",
          totalOutcomes: 3,
          masteredCount: 1,
          needsReviewCount: 1,
          inProgressCount: 1,
          notStartedCount: 0,
          outcomes: [
            {
              outcomeId: "outcome-1",
              text: "Memahami struktur oktet IPv4",
              description: "Mampu mengidentifikasi netid dan hostid.",
              state: "MASTERED",
              pathId: "path-1",
              pathSlug: "network-fundamentals",
              pathTitle: "Dasar Jaringan",
              moduleId: "mod-1",
              moduleSlug: "ip-addressing",
              moduleTitle: "Pengalamatan IPv4",
              lessonId: "lesson-1",
              lessonSlug: "ipv4-basics",
              lessonTitle: "Pengenalan IPv4",
              latestAttemptAt: new Date("2026-09-10T10:00:00Z"),
              evidenceVersion: "1.0",
              remediationLessonIds: ["lesson-1"],
            },
            {
              outcomeId: "outcome-2",
              text: "Menghitung subnet mask CIDR",
              description: "Mampu menentukan jumlah host per subnet.",
              state: "NEEDS_REVIEW",
              pathId: "path-1",
              pathSlug: "network-fundamentals",
              pathTitle: "Dasar Jaringan",
              moduleId: "mod-1",
              moduleSlug: "ip-addressing",
              moduleTitle: "Pengalamatan IPv4",
              lessonId: "lesson-2",
              lessonSlug: "subnetting-cidr",
              lessonTitle: "Subnetting CIDR",
              latestAttemptAt: new Date("2026-09-12T10:00:00Z"),
              evidenceVersion: "1.0",
              remediationLessonIds: ["lesson-2"],
            },
            {
              outcomeId: "outcome-3",
              text: "Melakukan konfigurasi VLSM",
              description: "Mampu membagi jaringan heterogen.",
              state: "IN_PROGRESS",
              pathId: "path-1",
              pathSlug: "network-fundamentals",
              pathTitle: "Dasar Jaringan",
              moduleId: "mod-1",
              moduleSlug: "ip-addressing",
              moduleTitle: "Pengalamatan IPv4",
              lessonId: "lesson-3",
              lessonSlug: "vlsm-design",
              lessonTitle: "Desain VLSM",
              latestAttemptAt: null,
              evidenceVersion: null,
              remediationLessonIds: ["lesson-3"],
            },
          ],
        },
      ],
    });

    const ui = await LearnerMasteryPage();
    render(ui);

    // Summary checks
    expect(screen.getByText("Penguasaan Materi & Remediasi")).toBeDefined();
    expect(screen.getByText("33%")).toBeDefined();
    expect(screen.getByText("Total Sasaran")).toBeDefined();
    expect(screen.getAllByText("Dikuasai").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Perlu Remediasi")).toBeDefined();

    // Remediation notification banner
    expect(
      screen.getByText(/Remediasi Diperlukan \(1 Sasaran\)/i)
    ).toBeDefined();

    // Module outcome items
    expect(screen.getByText("Pengalamatan IPv4")).toBeDefined();
    expect(screen.getByText("Memahami struktur oktet IPv4")).toBeDefined();
    expect(screen.getByText("Menghitung subnet mask CIDR")).toBeDefined();
    expect(screen.getByText("Melakukan konfigurasi VLSM")).toBeDefined();

    // Remediation action link
    const remediationLink = screen.getByRole("link", {
      name: /Buka Materi Remediasi/i,
    });
    expect(remediationLink.getAttribute("href")).toBe(
      "/learn/network-fundamentals/ip-addressing/subnetting-cidr"
    );

    // In-progress action link
    const inProgressLink = screen.getByRole("link", {
      name: /Lanjutkan Materi/i,
    });
    expect(inProgressLink.getAttribute("href")).toBe(
      "/learn/network-fundamentals/ip-addressing/vlsm-design"
    );

    // Mastered action link
    const masteredLink = screen.getByRole("link", {
      name: /Ulas Kembali/i,
    });
    expect(masteredLink.getAttribute("href")).toBe(
      "/learn/network-fundamentals/ip-addressing/ipv4-basics"
    );
  });
});
