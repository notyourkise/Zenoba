import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

vi.mock("@/components/effects/lottie-player", () => ({
  LottiePlayer: ({ ariaLabel, className, src }: { ariaLabel?: string; className?: string; src?: string }) => (
    <div data-testid="mock-lottie-player" role="img" aria-label={ariaLabel} className={className} data-src={src}>
      Lottie Animation Mock
    </div>
  ),
}));

describe("Custom Pure White 404 Not Found Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a pure white full-screen container with main role", () => {
    const { container } = render(<NotFound />);
    const rootDiv = container.firstChild as HTMLElement;

    expect(rootDiv).toHaveClass("bg-white");
    expect(rootDiv).toHaveClass("fixed");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the 404 Lottie animation as a large visual element with accessible label", () => {
    render(<NotFound />);

    const lottieVisual = screen.getByRole("img", {
      name: "404 Page Not Found",
    });
    expect(lottieVisual).toBeInTheDocument();
    expect(lottieVisual).toHaveAttribute("data-src", "/GIF/Page%20Not%20Found%20404.json");
    expect(lottieVisual).toHaveClass("w-full");
  });

  it("does not render any extra text, headings, or buttons", () => {
    render(<NotFound />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
