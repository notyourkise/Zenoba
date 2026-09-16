import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookmarkButton } from "./bookmark-button";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("BookmarkButton", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("renders default unbookmarked button with label", () => {
    render(<BookmarkButton lessonId="lesson-1" initialBookmarked={false} />);

    const button = screen.getByRole("button", { name: "Simpan ke bookmark" });
    expect(button).toBeDefined();
    expect(screen.getByText("Simpan")).toBeDefined();
  });

  it("renders bookmarked button state", () => {
    render(<BookmarkButton lessonId="lesson-1" initialBookmarked={true} />);

    const button = screen.getByRole("button", { name: "Hapus dari bookmark" });
    expect(button).toBeDefined();
    expect(screen.getByText("Tersimpan")).toBeDefined();
  });

  it("toggles bookmark state on click when API succeeds", async () => {
    const onToggleMock = vi.fn();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ bookmarked: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    render(
      <BookmarkButton
        lessonId="lesson-1"
        initialBookmarked={false}
        onToggle={onToggleMock}
      />
    );

    const button = screen.getByRole("button", { name: "Simpan ke bookmark" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/learning/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: "lesson-1" }),
      });
      expect(onToggleMock).toHaveBeenCalledWith(true);
      expect(screen.getByRole("button", { name: "Hapus dari bookmark" })).toBeDefined();
    });
  });

  it("renders icon-only when showLabel is false", () => {
    render(
      <BookmarkButton
        lessonId="lesson-1"
        initialBookmarked={true}
        showLabel={false}
      />
    );

    const button = screen.getByRole("button", { name: "Hapus dari bookmark" });
    expect(button).toBeDefined();
    expect(screen.queryByText("Tersimpan")).toBeNull();
  });
});
