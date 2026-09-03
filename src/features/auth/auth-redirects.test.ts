import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import SignInPage from "@/app/(auth)/sign-in/page";
import SignUpPage from "@/app/(auth)/sign-up/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn(), refresh: vi.fn() })),
}));

describe("legacy authentication routes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects /sign-in to the landing Sign In modal with a safe callback", async () => {
    await SignInPage({
      searchParams: Promise.resolve({ callbackUrl: "/dashboard" }),
    } as never);

    expect(redirect).toHaveBeenCalledWith(
      "/?auth=sign-in&callbackUrl=%2Fdashboard",
    );
  });

  it("redirects /sign-up to the landing Create Account modal", async () => {
    await SignUpPage({ searchParams: Promise.resolve({}) } as never);

    expect(redirect).toHaveBeenCalledWith("/?auth=sign-up");
  });

  it.each([
    [SignInPage, "sign-in"],
    [SignUpPage, "sign-up"],
  ] as const)("discards backslash callbacks in legacy route %#", async (Page, mode) => {
    await Page({
      searchParams: Promise.resolve({ callbackUrl: "/\\attacker.example" }),
    });
    expect(redirect).toHaveBeenCalledWith(`/?auth=${mode}`);
  });
});
