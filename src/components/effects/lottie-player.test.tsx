import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LottiePlayer } from "./lottie-player";

const mockDestroy = vi.fn();
const mockAddEventListener = vi.fn();
const mockGoToAndStop = vi.fn();
const mockLoadAnimation = vi.fn(() => ({
  destroy: mockDestroy,
  addEventListener: mockAddEventListener,
  goToAndStop: mockGoToAndStop,
}));

vi.mock("lottie-web", () => ({
  default: {
    loadAnimation: mockLoadAnimation,
  },
  loadAnimation: mockLoadAnimation,
}));

describe("LottiePlayer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders container with role and accessible label", () => {
    render(
      <LottiePlayer
        src="/GIF/Page%20Not%20Found%20404.json"
        ariaLabel="Animasi 404 Kustom"
      />
    );

    const player = screen.getByRole("img", { name: "Animasi 404 Kustom" });
    expect(player).toBeInTheDocument();
  });

  it("calls lottie.loadAnimation and cleans up on unmount", async () => {
    const { unmount } = render(
      <LottiePlayer
        src="/GIF/Page%20Not%20Found%20404.json"
        loop={true}
        autoplay={true}
      />
    );

    await waitFor(() => {
      expect(mockLoadAnimation).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/GIF/Page%20Not%20Found%20404.json",
          renderer: "svg",
        })
      );
    });

    unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });
});
