import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLearningDraft } from "./use-learning-draft";

async function flushPromises() {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
}

describe("useLearningDraft", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches and restores draft on mount when lessonId and activityId are provided", async () => {
    const onRestore = vi.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        draft: {
          activityId: "act-1",
          payload: { selections: { q1: "B" } },
        },
      }),
    });

    renderHook(() =>
      useLearningDraft({
        lessonId: "les-1",
        activityId: "act-1",
        payload: { selections: {} },
        onRestore,
      })
    );

    // Allow promise resolution
    await act(async () => {
      await flushPromises();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/learning/drafts?lessonId=les-1&activityId=act-1"
    );
    expect(onRestore).toHaveBeenCalledWith({ selections: { q1: "B" } });
  });

  it("does not fetch if lessonId is not provided", async () => {
    renderHook(() =>
      useLearningDraft({
        activityId: "act-1",
        payload: {},
      })
    );

    await act(async () => {
      await flushPromises();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("debounces autosave when payload changes after mount", async () => {
    // Initial fetch returns null draft
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ draft: null }),
    });

    const { result, rerender } = renderHook(
      ({ payload }) =>
        useLearningDraft({
          lessonId: "les-1",
          activityId: "act-1",
          payload,
          debounceMs: 500,
        }),
      { initialProps: { payload: { step: 1 } } }
    );

    // Wait for initial fetch
    await act(async () => {
      await flushPromises();
    });

    // Mock successful save
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, activityId: "act-1" }),
    });

    // Change payload
    rerender({ payload: { step: 2 } });

    // Should not call immediately before debounce time
    expect(global.fetch).toHaveBeenCalledTimes(1); // Only initial GET

    // Fast-forward debounce timer
    await act(async () => {
      vi.advanceTimersByTime(500);
      await flushPromises();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith("/api/learning/drafts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: "les-1",
        activityId: "act-1",
        contentVersion: "1.0",
        payload: { step: 2 },
      }),
    });
    expect(result.current.status).toBe("saved");
  });

  it("discards draft and calls DELETE endpoint", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ draft: null }),
    });

    const { result } = renderHook(() =>
      useLearningDraft({
        lessonId: "les-1",
        activityId: "act-1",
        payload: { text: "hello" },
      })
    );

    await act(async () => {
      await flushPromises();
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, deleted: true }),
    });

    await act(async () => {
      await result.current.discardDraft();
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      "/api/learning/drafts?lessonId=les-1&activityId=act-1",
      { method: "DELETE" }
    );
    expect(result.current.status).toBe("idle");
  });
});
