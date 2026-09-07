import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

vi.mock("next/navigation", () => ({
  usePathname: () => "/non-existent-path",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signOut: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}));

vi.mock("@/components/effects/lottie-player", () => ({
  LottiePlayer: ({ ariaLabel, className }: { ariaLabel?: string; className?: string }) => (
    <div data-testid="mock-lottie-player" role="img" aria-label={ariaLabel} className={className}>
      Lottie Animation Mock
    </div>
  ),
}));

describe("Custom 404 Not Found Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the 404 heading, status badge, and informative message", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Halaman Tidak Ditemukan/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Error 404 · Destination Unreachable/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Rute atau checkpoint jaringan yang Anda tuju berada di luar jangkauan radar Netloka/i)
    ).toBeInTheDocument();
  });

  it("renders the Lottie player component with accessible aria label", () => {
    render(<NotFound />);

    const lottieVisual = screen.getByRole("img", {
      name: "Ilustrasi animasi 404 - Halaman Tidak Ditemukan",
    });
    expect(lottieVisual).toBeInTheDocument();
  });

  it("provides clear navigation action links without decorative emojis or icons in CTA labels", () => {
    render(<NotFound />);

    const homeLink = screen.getByRole("link", { name: "Kembali ke Beranda" });
    const dashboardLink = screen.getByRole("link", { name: "Buka Dashboard" });
    const learnLink = screen.getByRole("link", { name: "Jelajahi Modul Belajar" });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    expect(learnLink).toHaveAttribute("href", "/learn");
  });
});
