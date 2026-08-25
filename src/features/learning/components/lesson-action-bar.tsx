"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { LessonStatus } from "../types";

interface LessonActionBarProps {
  lessonId: string;
  initialStatus: LessonStatus;
  pathSlug: string;
  prevLesson: {
    slug: string;
    title: string;
    moduleSlug: string;
  } | null;
  nextLesson: {
    slug: string;
    title: string;
    moduleSlug: string;
    status: LessonStatus;
  } | null;
}

export function LessonActionBar({
  lessonId,
  initialStatus,
  pathSlug,
  prevLesson,
  nextLesson,
}: LessonActionBarProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LessonStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          action: "complete",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyelesaikan pelajaran");
      }

      setStatus("COMPLETED");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8 space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Lesson Link */}
        <div>
          {prevLesson ? (
            <Link
              href={`/learn/${pathSlug}/${prevLesson.moduleSlug}/${prevLesson.slug}`}
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Sebelumnya: {prevLesson.title}</span>
            </Link>
          ) : (
            <span className="text-xs text-gray-400">Pelajaran Pertama</span>
          )}
        </div>

        {/* Complete Action Button */}
        <div className="flex items-center space-x-3">
          {status === "COMPLETED" ? (
            <div className="inline-flex items-center px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 dark:bg-green-950/60 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Telah Selesai
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg shadow-sm transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Tandai Selesai
                </>
              )}
            </button>
          )}

          {/* Next Lesson Link */}
          {nextLesson && (
            nextLesson.status === "LOCKED" ? (
              <span
                className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed"
                title="Pelajaran berikutnya terkunci"
              >
                <Lock className="w-3.5 h-3.5 mr-1" />
                Berikutnya
              </span>
            ) : (
              <Link
                href={`/learn/${pathSlug}/${nextLesson.moduleSlug}/${nextLesson.slug}`}
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Berikutnya
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
