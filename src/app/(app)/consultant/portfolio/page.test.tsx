/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PortfolioPage from "./page";
import * as authLib from "@/lib/auth";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    consultantProject: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("Consultant PortfolioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when user has no projects", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "user@example.com",
    } as any);

    vi.mocked(prisma.consultantProject.findMany).mockResolvedValueOnce([]);

    const ui = await PortfolioPage();
    render(ui);

    expect(screen.getByText("Belum Ada Proyek Konsultasi Tersimpan")).toBeDefined();
    expect(screen.getByText("Jelajahi Studi Kasus Klien →")).toBeDefined();
  });

  it("renders legacy v1.0 project with preserved score, version badge, and synthesized feedback", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "user@example.com",
    } as any);

    const legacyProject = {
      id: "proj-legacy",
      score: 65,
      passed: false,
      submittedAt: new Date("2026-08-15T10:00:00Z"),
      case: {
        slug: "small-office-notaris",
        title: "Kantor Notaris & PPAT",
        clientName: "H. Suryadi, S.H.",
        budget: 15000000,
      },
      compositeScore: {
        rubricVersion: "1.0",
        totalScore: 65,
        maxTotalScore: 100,
        dimensions: {
          technicalCorrectness: {
            score: 10,
            maxScore: 20,
            feedback: "Belum ada Router gateway untuk menghubungkan LAN ke Internet.",
          },
          costEfficiency: {
            score: 20,
            maxScore: 20,
            feedback: "Penggunaan anggaran sangat efisien.",
          },
        },
      },
      feedback: {
        rubricVersion: "1.0",
        passed: false,
        summary: "Proposal perlu revisi spesifikasi teknis",
        dimensions: {
          technicalCorrectness: {
            score: 10,
            maxScore: 20,
            feedback: "Belum ada Router gateway untuk menghubungkan LAN ke Internet.",
          },
          costEfficiency: {
            score: 20,
            maxScore: 20,
            feedback: "Penggunaan anggaran sangat efisien.",
          },
        },
      },
    };

    vi.mocked(prisma.consultantProject.findMany).mockResolvedValueOnce([legacyProject as any]);

    const ui = await PortfolioPage();
    render(ui);

    // Score and status preserved
    expect(screen.getByText("65 / 100")).toBeDefined();
    expect(screen.getByText("Revisi Diperlukan")).toBeDefined();
    expect(screen.getByText("Rubrik v1.0")).toBeDefined();

    // Strengths and blockers rendered
    expect(screen.getByText(/Kekuatan Proposal/)).toBeDefined();
    expect(screen.getAllByText("Penggunaan anggaran sangat efisien.").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Isu Pemblokir/)).toBeDefined();
    expect(screen.getAllByText("Belum ada Router gateway untuk menghubungkan LAN ke Internet.").length).toBeGreaterThanOrEqual(1);

    // Next actions rendered
    expect(screen.getByText("Rekomendasi Langkah Berikutnya")).toBeDefined();
  });

  it("renders new v1.1 project with native structured feedback", async () => {
    vi.mocked(authLib.getCurrentUser).mockResolvedValueOnce({
      id: "u-1",
      email: "user@example.com",
    } as any);

    const v11Project = {
      id: "proj-v11",
      score: 95,
      passed: true,
      submittedAt: new Date("2026-09-16T10:00:00Z"),
      case: {
        slug: "smk-tkj-school-lab",
        title: "SMK TKJ Lab",
        clientName: "SMK Negeri 1",
        budget: 75000000,
      },
      compositeScore: {
        rubricVersion: "1.1",
        totalScore: 95,
        maxTotalScore: 100,
        dimensions: {},
      },
      feedback: {
        rubricVersion: "1.1",
        passed: true,
        summary: "Proposal disetujui klien dengan spesifikasi teknis dan anggaran yang sesuai.",
        strengths: ["Router gateway tersedia", "Segmentasi VLAN terisolasi dengan rapi"],
        blockingIssues: [],
        nextActions: [
          {
            action: "Lanjutkan ke fase implementasi",
            outcomeId: "PLAN-L9-A",
            priority: 3,
            reason: "Proposal sudah memenuhi seluruh standar",
          },
        ],
      },
    };

    vi.mocked(prisma.consultantProject.findMany).mockResolvedValueOnce([v11Project as any]);

    const ui = await PortfolioPage();
    render(ui);

    expect(screen.getByText("95 / 100")).toBeDefined();
    expect(screen.getByText("Disetujui Klien")).toBeDefined();
    expect(screen.getByText("Rubrik v1.1")).toBeDefined();
    expect(screen.getByText(/Segmentasi VLAN terisolasi dengan rapi/)).toBeDefined();
    expect(screen.getByText("Lanjutkan ke fase implementasi")).toBeDefined();
    expect(screen.getByText("PLAN-L9-A")).toBeDefined();
  });
});
