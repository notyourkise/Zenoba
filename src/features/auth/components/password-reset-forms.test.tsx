import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe("password recovery forms", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows the generic confirmation after a reset request", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({
        message:
          "If an account exists for that email, a password reset link has been sent.",
      }),
    );
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "learner@example.com" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Request password reset" }));

    expect(
      await screen.findByText(/If an account exists for that email/i),
    ).toBeVisible();
  });

  it("disables reset when the URL has no token", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This password reset link is invalid or incomplete.",
    );
    expect(screen.getByRole("button", { name: "Reset password" })).toBeDisabled();
  });

  it("requires matching passwords before calling the API", () => {
    render(<ResetPasswordForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText("New password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm new password"), {
      target: { value: "Different123!" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Reset password" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Passwords do not match.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows success and a link back to Sign In after resetting", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ message: "Your password has been reset successfully." }),
    );
    render(<ResetPasswordForm token="valid-token" />);

    fireEvent.change(screen.getByLabelText("New password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm new password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Reset password" }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Your password has been reset successfully.",
      ),
    );
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/?auth=sign-in",
    );
  });

  it("announces API errors", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(
        { error: "This password reset link is invalid or has expired." },
        { status: 400 },
      ),
    );
    render(<ResetPasswordForm token="expired-token" />);

    fireEvent.change(screen.getByLabelText("New password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm new password"), {
      target: { value: "Password123!" },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Reset password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This password reset link is invalid or has expired.",
    );
  });
});
