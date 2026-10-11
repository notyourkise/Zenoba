import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketingFooter } from "./marketing-footer";

describe("MarketingFooter", () => {
  it("makes legal documents discoverable without opening authentication", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: "Tentang Zenoba" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy-policy");
  });

  it("starts directly with footer content without the removed final CTA", () => {
    render(<MarketingFooter />);

    expect(screen.queryByRole("heading", { name: /Siap Melangkah dari Teori ke Praktik Nyata\?/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Mulai Belajar Gratis" })).not.toBeInTheDocument();
    expect(screen.queryByText("Eksplorasi Simulator")).not.toBeInTheDocument();
  });

  it("merender kolom navigasi dan copyright", () => {
    render(<MarketingFooter />);

    expect(screen.getByText("ZENOBA")).toBeInTheDocument();
    expect(screen.getByText("Ekosistem")).toBeInTheDocument();
    expect(screen.getByText("Alat Simulator")).toBeInTheDocument();
    expect(screen.getByText("Jalur Belajar")).toBeInTheDocument();

    expect(screen.getByText(/© 2026 Zenoba/i)).toBeInTheDocument();
  });
});
