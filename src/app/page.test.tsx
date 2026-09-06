import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}));

vi.mock("@/features/auth/auth", () => ({
  isGoogleAuthConfigured: vi.fn(() => false),
}));

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockRedirect = vi.mocked(redirect);

describe("Landing Page Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects authenticated users to /dashboard", async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: "usr_123",
      name: "Budi Netloka",
      email: "budi@netloka.biz.id",
      role: "LEARNER",
    } as unknown as NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>);

    await Home({ searchParams: Promise.resolve({}) });

    expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
  });

  it("renders landing page for unauthenticated visitors without redirect", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const jsx = await Home({ searchParams: Promise.resolve({}) });
    render(jsx);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: /Kuasai IT Infrastructure/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Masuk/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Mulai Gratis/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Menu akun" }),
    ).not.toBeInTheDocument();
  });
});
