import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { LearnerWorkspaceShell } from "./learner-workspace-shell";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

describe("LearnerWorkspaceShell", () => {
  const mockUser = {
    id: "user-1",
    name: "John Learner",
    email: "john@example.com",
    role: "LEARNER",
    headline: "Network Enthusiast",
  };

  it("renders navigation links on desktop and mobile", () => {
    render(
      <LearnerWorkspaceShell user={mockUser}>
        <div>Workspace Body</div>
      </LearnerWorkspaceShell>,
    );

    expect(screen.getByText("Workspace Body")).toBeDefined();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Pembelajaran Saya").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Katalog Kursus").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Paket Saya").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Riwayat Pesanan").length).toBeGreaterThanOrEqual(1);
  });

  it("opens mobile drawer when hamburger button is clicked", () => {
    render(
      <LearnerWorkspaceShell user={mockUser}>
        <div>Content</div>
      </LearnerWorkspaceShell>,
    );

    const toggleBtn = screen.getByLabelText("Buka menu navigasi");
    expect(toggleBtn).toBeDefined();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole("dialog")).toBeDefined();
  });
});
