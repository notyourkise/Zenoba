import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCurriculumGraph } from "@/features/learning/queries";
import {
  buildSearchIndex,
  searchCurriculum,
  type MatchField,
} from "@/features/learning/search";
import {
  getUserBookmarks,
  type UserBookmarkItem,
} from "@/features/learning/bookmarks/service";
import { BookmarkButton } from "@/features/learning/bookmarks/components/bookmark-button";
import { Search, Bookmark, BookOpen, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Pencarian Kurikulum & Bookmark — Netloka",
  description:
    "Cari topik jaringan, modul, sasaran kompetensi, dan akses materi tersimpan di kurikulum Netloka.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

const POPULAR_TOPICS = [
  "IPv4",
  "Subnetting",
  "VLAN",
  "Routing",
  "OSI Layer",
  "TCP/IP",
  "DHCP",
  "DNS",
];

function getMatchBadgeLabel(field: MatchField): string {
  switch (field) {
    case "title":
      return "Cocok pada Judul";
    case "outcome":
      return "Cocok pada Sasaran Kompetensi";
    case "description":
      return "Cocok pada Deskripsi";
    case "module":
      return "Cocok pada Modul";
    case "path":
      return "Cocok pada Jalur Belajar";
  }
}

export default async function CurriculumSearchPage({
  searchParams,
}: SearchPageProps) {
  const resolvedParams = (await searchParams) || {};
  const query = (resolvedParams.q || "").trim();

  const user = await getCurrentUser();
  const [curriculum, bookmarks] = await Promise.all([
    getCurriculumGraph(),
    user?.id ? getUserBookmarks(user.id) : Promise.resolve([] as UserBookmarkItem[]),
  ]);

  const searchIndex = buildSearchIndex(curriculum);
  const results = query ? searchCurriculum(searchIndex, query) : [];
  const bookmarkedLessonIds = new Set(bookmarks.map((b) => b.lessonId));

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Pencarian Kurikulum & Bookmark
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
          Temukan topik jaringan, istilah teknis, modul, dan sasaran kompetensi
          di seluruh kurikulum Netloka, atau lanjutkan materi yang telah Anda simpan.
        </p>
      </div>

      {/* Search Input Bar */}
      <section aria-label="Form Pencarian">
        <form
          method="GET"
          action="/learn/search"
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              id="curriculum-search-input"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Cari konsep, perintah, modul (contoh: IPv4, Subnetting, VLAN)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer shrink-0"
          >
            Cari Kurikulum
          </button>
          {query && (
            <Link
              href="/learn/search"
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-sm font-semibold text-gray-700 dark:text-gray-300 transition text-center shrink-0"
            >
              Reset
            </Link>
          )}
        </form>

        {/* Popular Topic Suggestions */}
        <div className="flex items-center gap-2 flex-wrap mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Topik populer:</span>
          {POPULAR_TOPICS.map((topic) => (
            <Link
              key={topic}
              href={`/learn/search?q=${encodeURIComponent(topic)}`}
              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 text-gray-700 dark:text-gray-300 transition border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid: Results & Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Search Results Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {query ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Hasil Pencarian
                </h2>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {results.length} materi ditemukan untuk &ldquo;{query}&rdquo;
                </span>
              </div>

              {results.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <BookOpen
                    className="w-10 h-10 text-gray-400 mx-auto"
                    aria-hidden="true"
                  />
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Tidak Ditemukan Materi yang Cocok
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                    Tidak ada materi pelajaran yang cocok dengan kata kunci &ldquo;{query}&rdquo;.
                    Coba gunakan kata kunci yang lebih umum seperti <span className="font-semibold">IP</span>, <span className="font-semibold">VLAN</span>, atau <span className="font-semibold">Routing</span>.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <article
                      key={result.lessonId}
                      className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                            <span>{result.pathTitle}</span>
                            <span>/</span>
                            <span>{result.moduleTitle}</span>
                          </div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            <Link
                              href={result.href}
                              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                            >
                              {result.lessonTitle}
                            </Link>
                          </h3>
                        </div>

                        <div className="shrink-0">
                          <BookmarkButton
                            lessonId={result.lessonId}
                            initialBookmarked={bookmarkedLessonIds.has(result.lessonId)}
                          />
                        </div>
                      </div>

                      {/* Match Badge & Snippet */}
                      <div className="space-y-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {getMatchBadgeLabel(result.matchedField)}
                        </span>

                        {result.matchSnippet && (
                          <blockquote className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800/80 italic leading-relaxed">
                            &ldquo;{result.matchSnippet}&rdquo;
                          </blockquote>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
                        <span className="text-gray-400 dark:text-gray-500">
                          Urutan: Modul {result.orderIndex + 1}
                        </span>
                        <Link
                          href={result.href}
                          className="inline-flex items-center font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Buka Pelajaran
                          <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <Search className="w-10 h-10 text-gray-400 mx-auto" aria-hidden="true" />
              <h2 className="font-bold text-base text-gray-900 dark:text-white">
                Mulai Mencari Kurikulum
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                Masukkan kata kunci di kolom pencarian di atas untuk menjelajahi pelajaran berdasarkan judul, sasaran kompetensi, modul, atau konsep materi.
              </p>
            </div>
          )}
        </div>

        {/* Bookmarks Section Column (1 col) */}
        <aside
          aria-label="Materi Tersimpan"
          className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Materi Tersimpan
              </h2>
            </div>
            {user && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {bookmarks.length}
              </span>
            )}
          </div>

          {!user ? (
            <div className="text-center py-6 space-y-3 text-xs text-gray-600 dark:text-gray-400">
              <p>
                Masuk ke akun Anda untuk menyimpan pelajaran penting dan mengaksesnya dengan cepat di sini.
              </p>
              <Link
                href="/sign-in"
                className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Masuk Akun
              </Link>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-8 space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Belum ada bookmark
              </p>
              <p className="leading-relaxed">
                Klik tombol <span className="font-semibold text-gray-900 dark:text-white">&ldquo;Simpan&rdquo;</span> pada materi pelajaran untuk menyematkannya di daftar ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-lg border border-gray-100 dark:border-gray-700/70 bg-gray-50/70 dark:bg-gray-900/40 space-y-2"
                >
                  {b.isStale || !b.lesson ? (
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-gray-500 dark:text-gray-400 line-through">
                          Materi tidak lagi tersedia
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          ID: {b.lessonId}
                        </p>
                      </div>
                      <BookmarkButton
                        lessonId={b.lessonId}
                        initialBookmarked={true}
                        showLabel={false}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Link
                          href={b.lesson.href}
                          className="text-xs font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline leading-snug"
                        >
                          {b.lesson.title}
                        </Link>
                        <BookmarkButton
                          lessonId={b.lessonId}
                          initialBookmarked={true}
                          showLabel={false}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {b.lesson.moduleTitle}
                      </p>
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={b.lesson.href}
                          className="inline-flex items-center text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Lanjutkan
                          <ArrowRight className="w-3 h-3 ml-1" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
