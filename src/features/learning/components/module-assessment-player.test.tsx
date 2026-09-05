import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { ModuleAssessmentPlayer } from "./module-assessment-player";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ModuleAssessmentPlayer Component", () => {
  const mockQuestions = [
    {
      id: "q1",
      outcomeId: "WN-M1",
      question: "Apa definisi jaringan komputer?",
      options: [
        { id: "opt1", text: "Kumpulan perangkat mandiri terisolasi" },
        { id: "opt2", text: "Dua atau lebih perangkat terhubung untuk bertukar data" },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders briefing stage initially with pass thresholds", () => {
    render(
      <ModuleAssessmentPlayer
        moduleId="mod-welcome"
        moduleTitle="Welcome to Networking"
        pathSlug="network-foundations"
        moduleSlug="welcome-to-networking"
        questions={mockQuestions}
      />
    );

    expect(screen.getByText("Welcome to Networking")).toBeDefined();
    expect(screen.getByText(/Min. 8 dari 10 soal benar/i)).toBeDefined();
    expect(screen.getByText(/3 dari 3 kriteria wajib lulus/i)).toBeDefined();
    expect(screen.getByText("Mulai Ujian Sekarang")).toBeDefined();
  });

  it("transitions to testing stage when 'Mulai Ujian Sekarang' is clicked", () => {
    render(
      <ModuleAssessmentPlayer
        moduleId="mod-welcome"
        moduleTitle="Welcome to Networking"
        pathSlug="network-foundations"
        moduleSlug="welcome-to-networking"
        questions={mockQuestions}
      />
    );

    fireEvent.click(screen.getByText("Mulai Ujian Sekarang"));

    expect(screen.getByText("Lembar Ujian Akhir")).toBeDefined();
    expect(screen.getByText("Apa definisi jaringan komputer?")).toBeDefined();
    expect(screen.getByText("Bagian 2: Praktik Konektivitas Lab Perpustakaan")).toBeDefined();
  });

  it("submits assessment payload and displays passed result screen", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        passed: true,
        score: 100,
        conceptScore: 10,
        conceptMax: 10,
        conceptPassed: true,
        practicalPassed: true,
        practicalResults: [
          { id: "P01", title: "Jalur Fisik Lengkap", passed: true, reason: "Semua tersambung." },
          { id: "P02", title: "Restorasi Cabang Rusak", passed: true, reason: "PC-2 diperbaiki." },
          { id: "P03", title: "Verifikasi Layanan Lokal", passed: true, reason: "Cetak sukses." },
        ],
        unmetOutcomes: [],
        feedback: "Selamat! Seluruh kriteria kelulusan terpenuhi.",
        xpResult: { xpAwarded: 100, currentXp: 250 },
      }),
    });

    render(
      <ModuleAssessmentPlayer
        moduleId="mod-welcome"
        moduleTitle="Welcome to Networking"
        pathSlug="network-foundations"
        moduleSlug="welcome-to-networking"
        questions={mockQuestions}
      />
    );

    fireEvent.click(screen.getByText("Mulai Ujian Sekarang"));

    // Select option for question 1
    const radio = screen.getByLabelText("Dua atau lebih perangkat terhubung untuk bertukar data");
    fireEvent.click(radio);

    // Click submit
    const submitBtn = screen.getByText("Kirim Jawaban Ujian Akhir");
    expect(submitBtn).toBeDefined();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Selamat! Anda Lulus Evaluasi Modul")).toBeDefined();
    });

    expect(screen.getByText("10 / 10")).toBeDefined();
    expect(screen.getByText("3 / 3")).toBeDefined();
    expect(screen.getByText("Selesai & Lanjutkan Jalur")).toBeDefined();
  });

  it("displays failed result screen with unmet outcomes and remedial recommendations", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        passed: false,
        score: 60,
        conceptScore: 6,
        conceptMax: 10,
        conceptPassed: false,
        practicalPassed: false,
        practicalResults: [
          { id: "P01", title: "Jalur Fisik Lengkap", passed: false, reason: "PC-Sirkulasi lepas." },
          { id: "P02", title: "Restorasi Cabang Rusak", passed: false, reason: "Belum diperbaiki." },
          { id: "P03", title: "Verifikasi Layanan Lokal", passed: false, reason: "Belum diverifikasi." },
        ],
        unmetOutcomes: ["WN-M2", "WN-M4"],
        feedback: "Belum memenuhi ambang batas kelulusan.",
        xpResult: null,
      }),
    });

    render(
      <ModuleAssessmentPlayer
        moduleId="mod-welcome"
        moduleTitle="Welcome to Networking"
        pathSlug="network-foundations"
        moduleSlug="welcome-to-networking"
        questions={mockQuestions}
      />
    );

    fireEvent.click(screen.getByText("Mulai Ujian Sekarang"));

    // Select option
    fireEvent.click(screen.getByLabelText("Dua atau lebih perangkat terhubung untuk bertukar data"));

    // Submit
    fireEvent.click(screen.getByText("Kirim Jawaban Ujian Akhir"));

    await waitFor(() => {
      expect(screen.getByText("Belum Memenuhi Syarat Kelulusan")).toBeDefined();
    });

    expect(screen.getByText("Rekomendasi Materi Remedial")).toBeDefined();
    expect(screen.getByText("Ulangi Ujian Akhir")).toBeDefined();
  });

  it("handles network failure gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Koneksi internet bermasalah"));

    render(
      <ModuleAssessmentPlayer
        moduleId="mod-welcome"
        moduleTitle="Welcome to Networking"
        pathSlug="network-foundations"
        moduleSlug="welcome-to-networking"
        questions={mockQuestions}
      />
    );

    fireEvent.click(screen.getByText("Mulai Ujian Sekarang"));
    fireEvent.click(screen.getByLabelText("Dua atau lebih perangkat terhubung untuk bertukar data"));
    fireEvent.click(screen.getByText("Kirim Jawaban Ujian Akhir"));

    await waitFor(() => {
      expect(screen.getByText("Koneksi internet bermasalah")).toBeDefined();
    });
  });
});
