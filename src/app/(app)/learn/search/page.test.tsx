import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CurriculumSearchPage from "./page";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/features/learning/queries", () => ({
  getCurriculumGraph: vi.fn(),
}));

vi.mock("@/features/learning/bookmarks/service", () => ({
  getUserBookmarks: vi.fn(),
  isLessonBookmarked: vi.fn(),
}));

vi.mock("@/features/learning/bookmarks/components/bookmark-button", () => ({
  BookmarkButton: ({ lessonId, initialBookmarked }: { lessonId: string; initialBookmarked?: boolean }) => (
    <button data-testid={`bookmark-btn-${lessonId}`}>
      {initialBookmarked ? "Tersimpan" : "Simpan"}
    </button>
  ),
}));

import { getCurrentUser } from "@/lib/auth";
import { getCurriculumGraph } from "@/features/learning/queries";
import { getUserBookmarks } from "@/features/learning/bookmarks/service";
import type { LearningGraph } from "@/features/learning/continuation";

type MockUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockGetCurriculumGraph = vi.mocked(getCurriculumGraph);
const mockGetUserBookmarks = vi.mocked(getUserBookmarks);

describe("CurriculumSearchPage", () => {
  const sampleCurriculum: LearningGraph = {
    paths: [
      {
        id: "path-1",
        slug: "network-fundamentals",
        title: "Network Fundamentals",
        orderIndex: 0,
        modules: [
          {
            id: "mod-1",
            slug: "ip-addressing",
            title: "Pengalamatan IP",
            orderIndex: 0,
            lessons: [
              {
                id: "lesson-1",
                slug: "ipv4-basics",
                title: "Pengenalan IPv4",
                orderIndex: 0,
                prerequisiteLessonIds: [],
              },
              {
                id: "lesson-2",
                slug: "subnetting-vlsm",
                title: "Subnetting dan VLSM",
                orderIndex: 1,
                prerequisiteLessonIds: ["lesson-1"],
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurriculumGraph.mockResolvedValue(sampleCurriculum);
    mockGetUserBookmarks.mockResolvedValue([]);
    mockGetCurrentUser.mockResolvedValue(null);
  });

  it("renders search bar and prompt when query is empty", async () => {
    const jsx = await CurriculumSearchPage({
      searchParams: Promise.resolve({}),
    });
    render(jsx);

    expect(screen.getByText("Pencarian Kurikulum & Bookmark")).toBeDefined();
    expect(screen.getByPlaceholderText(/Cari konsep, perintah, modul/i)).toBeDefined();
    expect(screen.getByText("Mulai Mencari Kurikulum")).toBeDefined();
    expect(screen.getByText("Topik populer:")).toBeDefined();
  });

  it("renders search results when query matches curriculum items", async () => {
    const jsx = await CurriculumSearchPage({
      searchParams: Promise.resolve({ q: "IPv4" }),
    });
    render(jsx);

    expect(screen.getByText("Hasil Pencarian")).toBeDefined();
    expect(screen.getByText(/1 materi ditemukan/i)).toBeDefined();
    expect(screen.getByText("Pengenalan IPv4")).toBeDefined();
    expect(screen.getByText("Cocok pada Judul")).toBeDefined();
    expect(screen.getByText("Buka Pelajaran")).toBeDefined();
  });

  it("renders empty state when query returns no results", async () => {
    const jsx = await CurriculumSearchPage({
      searchParams: Promise.resolve({ q: "nonexistent-protocol" }),
    });
    render(jsx);

    expect(screen.getByText("Tidak Ditemukan Materi yang Cocok")).toBeDefined();
  });

  it("renders user bookmarks when authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "learner@netloka.com",
      name: "Budi",
      role: "LEARNER",
    } as MockUser);

    mockGetUserBookmarks.mockResolvedValue([
      {
        id: "bm-1",
        lessonId: "lesson-1",
        createdAt: new Date(),
        isStale: false,
        lesson: {
          title: "Pengenalan IPv4",
          slug: "ipv4-basics",
          moduleSlug: "ip-addressing",
          moduleTitle: "Pengalamatan IP",
          pathSlug: "network-fundamentals",
          pathTitle: "Network Fundamentals",
          href: "/learn/network-fundamentals/ip-addressing/ipv4-basics",
        },
      },
    ]);

    const jsx = await CurriculumSearchPage({
      searchParams: Promise.resolve({}),
    });
    render(jsx);

    expect(screen.getByText("Materi Tersimpan")).toBeDefined();
    expect(screen.getByText("Pengenalan IPv4")).toBeDefined();
    expect(screen.getByText("Pengalamatan IP")).toBeDefined();
    expect(screen.getByTestId("bookmark-btn-lesson-1")).toBeDefined();
  });

  it("handles stale bookmarks gracefully without crashing", async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "learner@netloka.com",
      role: "LEARNER",
    } as MockUser);

    mockGetUserBookmarks.mockResolvedValue([
      {
        id: "bm-stale",
        lessonId: "deprecated-lesson-id",
        createdAt: new Date(),
        isStale: true,
        lesson: null,
      },
    ]);

    const jsx = await CurriculumSearchPage({
      searchParams: Promise.resolve({}),
    });
    render(jsx);

    expect(screen.getByText("Materi tidak lagi tersedia")).toBeDefined();
    expect(screen.getByText("ID: deprecated-lesson-id")).toBeDefined();
  });
});
