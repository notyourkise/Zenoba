import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MyLearningPage from "./page";
import { getCurrentUser } from "@/lib/auth";
import { getMyLearning } from "@/features/commerce/entitlements";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/commerce/entitlements", () => ({
  getMyLearning: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("MyLearningPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state with link to catalog when no courses enrolled", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "test@example.com",
    } as never);

    vi.mocked(getMyLearning).mockResolvedValueOnce({ courses: [] });

    const ui = await MyLearningPage();
    render(ui);

    expect(screen.getByText("Belum ada kursus terdaftar.")).toBeDefined();
    const catalogLink = screen.getByRole("link", { name: /Lihat Katalog Kursus/i });
    expect(catalogLink.getAttribute("href")).toBe("/catalog");
  });

  it("renders enrolled courses linking to /learn/[pathSlug] (not /learning/)", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "test@example.com",
    } as never);

    vi.mocked(getMyLearning).mockResolvedValueOnce({
      courses: [
        {
          id: "crs-1",
          slug: "networking",
          title: "Network Foundations",
          track: "networking",
          accessTier: "FREE",
          learningPathSlug: "network-foundations",
          description: "Fondasi fundamental jaringan komputer.",
        },
      ],
    });

    const ui = await MyLearningPage();
    render(ui);

    expect(screen.getByText("Network Foundations")).toBeDefined();
    const continueLink = screen.getByRole("link", { name: /Buka Kurikulum/i });
    expect(continueLink.getAttribute("href")).toBe("/learn/network-foundations");
    expect(continueLink.getAttribute("href")).not.toContain("/learning/");
  });

  it("falls back to /learn when learningPathSlug is undefined", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      id: "user-1",
      email: "test@example.com",
    } as never);

    vi.mocked(getMyLearning).mockResolvedValueOnce({
      courses: [
        {
          id: "crs-2",
          slug: "cctv",
          title: "CCTV & Surveillance",
          track: "cctv",
          accessTier: "PREMIUM",
          learningPathSlug: undefined,
          description: "IP Camera and NVR.",
        },
      ],
    });

    const ui = await MyLearningPage();
    render(ui);

    const continueLink = screen.getByRole("link", { name: /Buka Kurikulum/i });
    expect(continueLink.getAttribute("href")).toBe("/learn");
  });
});
