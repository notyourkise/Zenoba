import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InteractiveFaq } from "./interactive-faq";

describe("InteractiveFaq", () => {
  it("merender judul FAQ dan kategori filter pertanyaan", () => {
    render(<InteractiveFaq />);

    expect(
      screen.getByRole("heading", { name: /Pertanyaan yang Sering Diajukan/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Semua Pertanyaan" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Akses & Perangkat" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kurikulum & TKJ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simulasi & Terminal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mode Konsultan" })).toBeInTheDocument();
  });

  it("dapat membuka dan menutup item pertanyaan accordion", () => {
    render(<InteractiveFaq />);

    const firstQuestionBtn = screen.getByRole("button", {
      name: /Apakah Netloka dapat diakses dari laptop atau HP/i,
    });
    expect(firstQuestionBtn).toHaveAttribute("aria-expanded", "true");

    // Click to collapse
    fireEvent.click(firstQuestionBtn);
    expect(firstQuestionBtn).toHaveAttribute("aria-expanded", "false");

    // Click second question to expand
    const secondQuestionBtn = screen.getByRole("button", {
      name: /Apakah materi Netloka sesuai dengan kurikulum SMK TKJ/i,
    });
    fireEvent.click(secondQuestionBtn);
    expect(secondQuestionBtn).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(/Kurikulum Netloka dirancang selaras dengan Capaian Pembelajaran SMK/i),
    ).toBeInTheDocument();
  });

  it("dapat memfilter pertanyaan berdasarkan kategori", () => {
    render(<InteractiveFaq />);

    const consultantCatBtn = screen.getByRole("button", { name: "Mode Konsultan" });
    fireEvent.click(consultantCatBtn);

    expect(
      screen.getByText(/Apa itu Mode Proyek Konsultan IT dan bagaimana penilaiannya/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/Apakah Netloka dapat diakses dari laptop atau HP/i),
    ).not.toBeInTheDocument();
  });
});
