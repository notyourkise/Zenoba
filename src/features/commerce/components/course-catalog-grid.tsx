import * as React from "react";
import Link from "next/link";
import type { CatalogCourseCard } from "../catalog";

interface CourseCatalogGridProps {
  courses: CatalogCourseCard[];
}

export function CourseCatalogGrid({ courses }: CourseCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const isFree = course.accessTier === "FREE";
        const isComingSoon = course.catalogStatus === "COMING_SOON";

        return (
          <div
            key={course.id}
            className="flex flex-col justify-between p-6 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-all hover:border-zinc-300 dark:hover:border-white/20 shadow-xs"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isFree
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                  }`}
                >
                  {course.accessLabel}
                </span>

                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    isComingSoon
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      : "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white"
                  }`}
                >
                  {course.availabilityLabel}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 leading-snug">
                {course.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6">
                {course.description || "Modul kurikulum IT Infrastructure."}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Biaya Kursus</p>
                <p className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                  {course.priceLabel}
                </p>
              </div>

              <div>
                {isFree ? (
                  <Link
                    href="/learn"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    Mulai Belajar
                  </Link>
                ) : isComingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/5 cursor-not-allowed"
                  >
                    Segera Hadir
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                  >
                    Beli Kursus
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
