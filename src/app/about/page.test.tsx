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
  it("explains the independent product without invented corporate claims", () => {
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
    expect(screen.getByText("Zenoba sebelumnya hadir sebagai Netloka.")).toBeInTheDocument();

    expect(screen.queryByText(/Corporation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/20d{2}/)).not.toBeInTheDocument();
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

