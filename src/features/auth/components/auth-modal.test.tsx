import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { signIn } from "next-auth/react";
import { AuthModal } from "@/features/auth/components/auth-modal";

const router = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe("AuthModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders Sign In with recovery and a disabled pending Google action", () => {
    render(<AuthModal mode="sign-in" googleEnabled={false} />);

    expect(screen.getByRole("dialog", { name: "Sign in to Zenoba" })).toBeVisible();
    expect(screen.getByLabelText("Email")).toBeVisible();
    expect(screen.getByLabelText("Password")).toBeVisible();
    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
    expect(screen.getByRole("button", { name: /Continue with Google/i })).toBeDisabled();
    expect(screen.getByText("Setup pending")).toBeVisible();
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it("renders registration fields and preserves callback when switching modes", () => {
    render(
      <AuthModal
        mode="sign-up"
        googleEnabled={false}
        callbackUrl="/learn"
      />,
    );

    expect(screen.getByRole("dialog", { name: "Create your Zenoba account" })).toBeVisible();
    expect(screen.queryByLabelText("Name (optional)")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeVisible();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/?auth=sign-in&callbackUrl=%2Flearn",
    );
  });

  it("returns successful email registration to the Sign In modal", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "Account created successfully" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(
      <AuthModal
        mode="sign-up"
        googleEnabled={false}
        callbackUrl="/dashboard"
      />,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Create account" }));

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith(
        "/?auth=sign-in&callbackUrl=%2Fdashboard&registered=true",
      ),
    );
  });

  it("routes successful credentials sign-in to /continue", async () => {
    vi.mocked(signIn).mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });
    render(
      <AuthModal
        mode="sign-in"
        googleEnabled
      />,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Sign in" }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/continue"));
  });

  it("routes Google sign-in to /continue", () => {
    render(
      <AuthModal
        mode="sign-in"
        googleEnabled
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Continue with Google/i }));

    expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/continue" });
  });

  it("preserves safe callbackUrl when routing to /continue", async () => {
    vi.mocked(signIn).mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });
    render(
      <AuthModal
        mode="sign-in"
        googleEnabled
        callbackUrl="/learn"
      />,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Sign in" }));

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/continue?callbackUrl=%2Flearn"),
    );
  });

  it.each([
    "https://attacker.example/steal",
    "//attacker.example/steal",
    "/\\attacker.example/steal",
    "/\t/attacker.example/steal",
  ])("rejects unsafe callback %j after credentials sign-in and defaults to /continue", async (callbackUrl) => {
    vi.mocked(signIn).mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });
    render(
      <AuthModal
        mode="sign-in"
        googleEnabled
        callbackUrl={callbackUrl}
      />,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Sign in" }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/continue"));
  });

  it("closes on Escape without leaving the landing page", () => {
    render(<AuthModal mode="sign-in" googleEnabled={false} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(router.replace).toHaveBeenCalledWith("/", { scroll: false });
  });

  it.each(["sign-in", "sign-up"] as const)(
    "offers legal documents without replacing the %s form",
    (mode) => {
      render(<AuthModal mode={mode} googleEnabled={false} />);

      for (const [name, href] of [
        ["Terms", "/terms"],
        ["Privacy Policy", "/privacy-policy"],
      ]) {
        const link = screen.getByRole("link", { name });
        expect(link).toHaveAttribute("href", href);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link).toHaveAccessibleDescription(/new tab/i);
      }
    },
  );
});
