import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as React from "react";
import { LessonActionBar } from "./lesson-action-bar";
import type { LessonNavigationContext } from "../navigation";

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: mockRefresh,
  }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("LessonActionBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'Pelajaran Pertama' when there is no previous lesson", () => {
    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="AVAILABLE"
        pathSlug="network-fundamentals"
        prevLesson={null}
        nextLesson={null}
      />
    );

    expect(screen.getByText("Pelajaran Pertama")).toBeDefined();
    expect(screen.getByRole("button", { name: /Tandai Selesai/i })).toBeDefined();
  });

  it("renders previous lesson link when navigation context is provided", () => {
    const navigation: LessonNavigationContext = {
      previousLesson: {
        slug: "les-0",
        title: "Pelajaran Pendahuluan",
        href: "/learn/network-fundamentals/intro/les-0",
        moduleSlug: "intro",
        moduleTitle: "Pengenalan",
      },
      nextLesson: null,
      moduleAssessment: null,
      nextModuleFirstLesson: null,
      exitHref: "/learn/network-fundamentals",
    };

    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="AVAILABLE"
        pathSlug="network-fundamentals"
        navigation={navigation}
      />
    );

    const prevLink = screen.getByRole("link", { name: /Sebelumnya: Pelajaran Pendahuluan/i });
    expect(prevLink).toBeDefined();
    expect(prevLink.getAttribute("href")).toBe("/learn/network-fundamentals/intro/les-0");
  });

  it("handles successful completion and updates state to 'Telah Selesai'", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="IN_PROGRESS"
        pathSlug="network-fundamentals"
      />
    );

    const completeBtn = screen.getByRole("button", { name: /Tandai Selesai/i });
    fireEvent.click(completeBtn);

    await waitFor(() => {
      expect(screen.getByText("Telah Selesai")).toBeDefined();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/learning/progress", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ lessonId: "les-1", action: "complete" }),
    }));
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("sanitizes completion error and renders alert with retry action without leaking database internals", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Raw database error: SELECT * FROM users prisma constraint failed" }),
    });

    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="IN_PROGRESS"
        pathSlug="network-fundamentals"
      />
    );

    const completeBtn = screen.getByRole("button", { name: /Tandai Selesai/i });
    fireEvent.click(completeBtn);

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toBeDefined();
      // Should NOT leak SQL/Prisma words
      expect(alert.textContent).not.toContain("SELECT");
      expect(alert.textContent).not.toContain("prisma");
      // Should display sanitized Indonesian message
      expect(screen.getByText("Kendala Sistem")).toBeDefined();
      expect(screen.getByText(/Terjadi kendala saat memproses data pada server/i)).toBeDefined();
    });

    // Should offer retry button
    const retryBtn = screen.getByRole("button", { name: /Muat Ulang Halaman|Coba Lagi/i });
    expect(retryBtn).toBeDefined();
  });

  it("renders locked next lesson with reason tooltip and lock indicator", () => {
    const navigation: LessonNavigationContext = {
      previousLesson: null,
      nextLesson: {
        slug: "les-2",
        title: "Perangkat Jaringan",
        href: "/learn/network-fundamentals/intro/les-2",
        moduleSlug: "intro",
        moduleTitle: "Pengenalan",
        isLocked: true,
        reason: "Selesaikan pelajaran prasyarat terlebih dahulu",
      },
      moduleAssessment: null,
      nextModuleFirstLesson: null,
      exitHref: "/learn/network-fundamentals",
    };

    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="IN_PROGRESS"
        pathSlug="network-fundamentals"
        navigation={navigation}
      />
    );

    const lockedBadge = screen.getByText("Berikutnya");
    expect(lockedBadge.getAttribute("title")).toBe("Selesaikan pelajaran prasyarat terlebih dahulu");
  });

  it("renders unlocked next lesson link when navigation context allows", () => {
    const navigation: LessonNavigationContext = {
      previousLesson: null,
      nextLesson: {
        slug: "les-2",
        title: "Perangkat Jaringan",
        href: "/learn/network-fundamentals/intro/les-2",
        moduleSlug: "intro",
        moduleTitle: "Pengenalan",
        isLocked: false,
      },
      moduleAssessment: null,
      nextModuleFirstLesson: null,
      exitHref: "/learn/network-fundamentals",
    };

    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="COMPLETED"
        pathSlug="network-fundamentals"
        navigation={navigation}
      />
    );

    const nextLink = screen.getByRole("link", { name: /Berikutnya/i });
    expect(nextLink.getAttribute("href")).toBe("/learn/network-fundamentals/intro/les-2");
  });

  it("renders module assessment CTA when module lessons are complete", () => {
    const navigation: LessonNavigationContext = {
      previousLesson: null,
      nextLesson: null,
      moduleAssessment: {
        href: "/learn/network-fundamentals/intro/assessment",
        isUnlocked: true,
      },
      nextModuleFirstLesson: null,
      exitHref: "/learn/network-fundamentals",
    };

    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="COMPLETED"
        pathSlug="network-fundamentals"
        navigation={navigation}
      />
    );

    const assessmentLink = screen.getByRole("link", { name: /Ujian Akhir Modul/i });
    expect(assessmentLink.getAttribute("href")).toBe("/learn/network-fundamentals/intro/assessment");
  });

  it("renders next module link when at the end of a module without assessment", () => {
    const navigation: LessonNavigationContext = {
      previousLesson: null,
      nextLesson: null,
      moduleAssessment: null,
      nextModuleFirstLesson: {
        slug: "les-next-mod",
        title: "Pelajaran Pertama Modul 2",
        href: "/learn/network-fundamentals/mod-2/les-next-mod",
        moduleSlug: "mod-2",
        moduleTitle: "Modul 2",
        isLocked: false,
      },
      exitHref: "/learn/network-fundamentals",
    };

    render(
      <LessonActionBar
        lessonId="les-1"
        initialStatus="COMPLETED"
        pathSlug="network-fundamentals"
        navigation={navigation}
      />
    );

    const nextModLink = screen.getByRole("link", { name: /Modul Berikutnya/i });
    expect(nextModLink.getAttribute("href")).toBe("/learn/network-fundamentals/mod-2/les-next-mod");
  });
});
