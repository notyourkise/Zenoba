import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketingFooter } from "./marketing-footer";

describe("MarketingFooter", () => {
  it("merender CTA Final card dengan tombol navigasi", () => {
    render(<MarketingFooter />);

    expect(
      screen.getByRole("heading", { name: /Siap Melangkah dari Teori ke Praktik Nyata\?/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Mulai Belajar Gratis" }),
    ).toHaveAttribute("href", "/?auth=sign-up");
    expect(screen.getAllByText("Eksplorasi Simulator")[0]).toBeInTheDocument();
  });

  it("merender kolom navigasi dan copyright", () => {
    render(<MarketingFooter />);

    expect(screen.getByText("NETLOKA")).toBeInTheDocument();
    expect(screen.getByText("Ekosistem")).toBeInTheDocument();
    expect(screen.getByText("Alat Simulator")).toBeInTheDocument();
    expect(screen.getByText("Jalur Belajar")).toBeInTheDocument();

    expect(screen.getByText(/© 2026 Netloka/i)).toBeInTheDocument();
  });
});
