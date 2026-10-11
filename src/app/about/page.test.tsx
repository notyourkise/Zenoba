import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AboutPage, { metadata } from "./page";

vi.mock("@/components/navigation/app-header", () => ({
  AppHeader: () => <header aria-label="Zenoba navigation" />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe("Zenoba About page", () => {
  it("explains the independently founded product with its verified 2026 history", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Tentang Zenoba" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Zenoba adalah platform belajar IT infrastructure berbasis praktik."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Zenoba dikembangkan dan dikelola secara independen oleh Fikri Haikal."),
    ).toBeInTheDocument();
    expect(screen.getByText("Netloka dimulai pada Mei 2026.")).toBeInTheDocument();
    expect(
      screen.getByText("Zenoba didirikan secara individual oleh Fikri Haikal pada 2026."),
    ).toBeInTheDocument();
    expect(screen.getByText("Zenoba menjadi identitas baru pada Oktober 2026.")).toBeInTheDocument();

    expect(screen.queryByText(/Corporation/i)).not.toBeInTheDocument();
  });

  it("keeps vision and mission direct before the infrastructure journey", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { level: 2, name: "Visi" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Misi" })).toBeInTheDocument();
    expect(screen.queryByText("Arah Zenoba")).not.toBeInTheDocument();
    expect(screen.queryByText("Cara Zenoba bergerak")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Perjalanan Zenoba" })).toBeInTheDocument();
    expect(screen.getByText("Mei 2026")).toBeInTheDocument();
    expect(screen.getByText("Oktober 2026")).toBeInTheDocument();
  });

  it("keeps the page public-facing with home and legal navigation", () => {
    render(<AboutPage />);

    expect(screen.getByRole("link", { name: "Kembali ke Beranda" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
  });

  it("provides Zenoba-specific metadata", () => {
    expect(metadata).toMatchObject({
      title: "Tentang Zenoba | Zenoba",
      description: "Informasi tentang Zenoba, platform belajar IT infrastructure berbasis praktik.",
    });
  });
});
