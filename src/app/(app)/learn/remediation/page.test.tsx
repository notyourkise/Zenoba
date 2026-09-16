import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RemediationCenterPage from "./page";
import { requireLearnerActor } from "@/features/authorization/guards";
import { getLearnerRemediationPlan } from "@/features/learning/remediation-queries";

vi.mock("@/features/authorization/guards", () => ({
  requireLearnerActor: vi.fn(),
}));

vi.mock("@/features/learning/remediation-queries", () => ({
  getLearnerRemediationPlan: vi.fn(),
}));

const mockRequireLearnerActor = vi.mocked(requireLearnerActor);
const mockGetLearnerRemediationPlan = vi.mocked(getLearnerRemediationPlan);

describe("RemediationCenterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireLearnerActor.mockResolvedValue({
      id: "learner-user-1",
      email: "learner@netloka.biz.id",
      role: "LEARNER",
    } as never);
  });

  it("renders empty state when no active remediation is needed", async () => {
    mockGetLearnerRemediationPlan.mockResolvedValueOnce({
      totalNeedsReviewOutcomes: 0,
      totalRemediationLessons: 0,
      lessons: [],
    });

    const ui = await RemediationCenterPage();
    render(ui);

    expect(screen.getByText("Pusat Remediasi Materi")).toBeDefined();
    expect(screen.getByText("Tidak Ada Materi Remediasi Aktif")).toBeDefined();

    const myLearningLink = screen.getByRole("link", { name: /Pembelajaran Saya/i });
    expect(myLearningLink.getAttribute("href")).toBe("/my-learning");

    const masteryLink = screen.getByRole("link", { name: /Status Penguasaan Materi/i });
    expect(masteryLink.getAttribute("href")).toBe("/learn/mastery");
  });

  it("renders active remediation plan with targeted lessons and affected concepts", async () => {
    mockGetLearnerRemediationPlan.mockResolvedValueOnce({
      totalNeedsReviewOutcomes: 2,
      totalRemediationLessons: 1,
      lessons: [
        {
          lessonId: "les-subnet",
          lessonSlug: "subnetting-cidr",
          lessonTitle: "Subnetting dengan Notasi CIDR",
          moduleId: "mod-ip",
          moduleSlug: "ip-addressing",
          moduleTitle: "Pengalamatan IPv4",
          pathSlug: "network-fundamentals",
          pathTitle: "Dasar Jaringan Komputer",
          href: "/learn/network-fundamentals/ip-addressing/subnetting-cidr",
          reasons: ["Penguatan konsep sasaran kompetensi: Menghitung Subnet Mask"],
          unmetOutcomes: [
            {
              outcomeId: "out-subnet",
              text: "Menghitung Subnet Mask Biner",
              reason: "Evaluasi belum memenuhi standar kelulusan.",
            },
            {
              outcomeId: "out-cidr",
              text: "Konversi Netmask ke Prefix CIDR",
              reason: "Evaluasi belum memenuhi standar kelulusan.",
            },
          ],
          orderScore: 100,
        },
      ],
    });

    const ui = await RemediationCenterPage();
    render(ui);

    // Summary banner
    expect(
      screen.getByText(/2 Sasaran Kompetensi Memerlukan Remediasi/i)
    ).toBeDefined();

    // Lesson card
    expect(screen.getByText("Subnetting dengan Notasi CIDR")).toBeDefined();
    expect(screen.getByText(/Dasar Jaringan Komputer/i)).toBeDefined();
    expect(screen.getByText(/Pengalamatan IPv4/i)).toBeDefined();

    // Affected outcomes
    expect(screen.getByText("Menghitung Subnet Mask Biner")).toBeDefined();
    expect(screen.getByText("Konversi Netmask ke Prefix CIDR")).toBeDefined();

    // Action links
    const lessonLink = screen.getByRole("link", { name: /Buka Materi Remediasi/i });
    expect(lessonLink.getAttribute("href")).toBe(
      "/learn/network-fundamentals/ip-addressing/subnetting-cidr"
    );

    const assessmentLink = screen.getByRole("link", {
      name: /Uji Kompetensi Modul Terkait/i,
    });
    expect(assessmentLink.getAttribute("href")).toBe(
      "/learn/network-fundamentals/ip-addressing/assessment"
    );
  });
});
