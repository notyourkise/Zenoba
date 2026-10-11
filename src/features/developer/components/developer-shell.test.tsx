import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { DeveloperShell } from "./developer-shell";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/developer",
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

describe("DeveloperShell", () => {
  const mockActor = {
    id: "dev-1",
    name: "Dev Anto",
    email: "dev@zenoba.tech",
    role: "DEVELOPER",
    twoFactorEnabled: false,
  };

  it("renders developer workspace navigation links", () => {
    render(
      <DeveloperShell actor={mockActor}>
        <div>Developer Dashboard Content</div>
      </DeveloperShell>,
    );

    expect(screen.getByText("Developer Dashboard Content")).toBeInTheDocument();
    expect(screen.getAllByText("Ringkasan").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Pengguna").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Akses & Paket").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Kesehatan Kurikulum").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Kesehatan Sistem").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Keamanan").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Akun Pengembang").length).toBeGreaterThanOrEqual(1);

    // Displays actor information and role badge
    expect(screen.getAllByText("Dev Anto").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("DEVELOPER").length).toBeGreaterThanOrEqual(1);
  });

  it("sets aria-current='page' on the active route", () => {
    render(
      <DeveloperShell actor={mockActor}>
        <div>Content</div>
      </DeveloperShell>,
    );

    const activeLinks = screen.getAllByRole("link", { name: /Ringkasan/i });
    expect(activeLinks[0]).toHaveAttribute("aria-current", "page");
  });

  it("does not render learner navigation links", () => {
    render(
      <DeveloperShell actor={mockActor}>
        <div>Content</div>
      </DeveloperShell>,
    );

    expect(screen.queryByText("Pembelajaran Saya")).toBeNull();
    expect(screen.queryByText("Katalog Kursus")).toBeNull();
    expect(screen.queryByText("Interactive Labs")).toBeNull();
    expect(screen.queryByText("Simulasi Konsultan TI")).toBeNull();
  });

  it("toggles mobile drawer when hamburger button is clicked", () => {
    render(
      <DeveloperShell actor={mockActor}>
        <div>Content</div>
      </DeveloperShell>,
    );

    const toggleBtn = screen.getByLabelText("Buka menu navigasi pengembang");
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByLabelText("Tutup menu navigasi pengembang");
    fireEvent.click(closeBtn);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
