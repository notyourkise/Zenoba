import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { LearningOutcomes } from "./learning-outcomes";

describe("LearningOutcomes Component", () => {
  const mockLessonOutcomes = [
    {
      id: "WN-L1-A",
      text: "Siswa dapat membedakan kumpulan perangkat yang terhubung dan perangkat yang berdiri sendiri.",
    },
    {
      id: "WN-L1-B",
      text: "Siswa dapat menjelaskan dua manfaat jaringan dari skenario berbagi file dan printer.",
    },
  ];

  const mockModuleOutcomes = [
    {
      id: "WN-M1",
      text: "Siswa dapat menjelaskan jaringan komputer sebagai kumpulan perangkat yang saling terhubung untuk berkomunikasi dan berbagi sumber daya.",
    },
    {
      id: "WN-M2",
      text: "Siswa dapat mengidentifikasi perangkat akhir, media koneksi, dan sumber daya bersama pada jaringan rumah atau sekolah.",
    },
  ];

  it("renders lesson-scoped outcomes with proper headings and outcome codes", () => {
    render(<LearningOutcomes outcomes={mockLessonOutcomes} scope="lesson" />);

    expect(screen.getByRole("region", { name: /capaian pembelajaran/i })).toBeDefined();
    expect(screen.getByText("WN-L1-A")).toBeDefined();
    expect(
      screen.getByText(
        "Siswa dapat membedakan kumpulan perangkat yang terhubung dan perangkat yang berdiri sendiri."
      )
    ).toBeDefined();
    expect(screen.getByText("WN-L1-B")).toBeDefined();
  });

  it("renders module-scoped outcomes with proper heading", () => {
    render(
      <LearningOutcomes
        outcomes={mockModuleOutcomes}
        scope="module"
        title="Target Kompetensi Modul"
      />
    );

    expect(screen.getByText("Target Kompetensi Modul")).toBeDefined();
    expect(screen.getByText("WN-M1")).toBeDefined();
    expect(screen.getByText("WN-M2")).toBeDefined();
  });

  it("does not leak private assessment keys or undefined descriptions", () => {
    const dangerousPayload = [
      {
        id: "WN-L1-A",
        text: "Public text",
        correctAnswer: "SECRET_OPT_B",
        explanation: "SECRET_EXPLANATION",
      } as unknown as Array<{ id: string; text: string }>[0],
    ];

    render(<LearningOutcomes outcomes={dangerousPayload} scope="lesson" />);

    expect(screen.queryByText("SECRET_OPT_B")).toBeNull();
    expect(screen.queryByText("SECRET_EXPLANATION")).toBeNull();
    expect(screen.getByText("Public text")).toBeDefined();
  });

  it("renders nothing or empty state when outcomes list is empty", () => {
    const { container } = render(<LearningOutcomes outcomes={[]} scope="lesson" />);
    expect(container.firstChild).toBeNull();
  });
});
