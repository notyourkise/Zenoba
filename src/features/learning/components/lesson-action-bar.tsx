"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { LessonStatus } from "../types";
import { LessonNavigationContext } from "../navigation";
import { sanitizePublicError, PublicErrorDetail } from "@/lib/errors/public-error";

export interface LessonActionBarProps {
  lessonId: string;
  initialStatus: LessonStatus;
  pathSlug: string;
  assessmentUrl?: string | null;
  prevLesson?: {
    slug: string;
    title: string;
    moduleSlug: string;
  } | null;
  nextLesson?: {
    slug: string;
    title: string;
    moduleSlug: string;
    status: LessonStatus;
  } | null;
  navigation?: LessonNavigationContext | null;
}

export function LessonActionBar({
  lessonId,
  initialStatus,
  pathSlug,
  assessmentUrl,
  prevLesson,
  nextLesson,
  navigation,
}: LessonActionBarProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LessonStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PublicErrorDetail | null>(null);

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
      const sanitized = sanitizePublicError(err, "Gagal menyelesaikan pelajaran");
      setError(sanitized);
    } finally {
      setLoading(false);
    }
  };

  // Resolve previous target
  const prevTarget = navigation?.previousLesson
    ? {
        href: navigation.previousLesson.href,
        title: navigation.previousLesson.title,
      }
    : prevLesson
    ? {
        href: `/learn/${pathSlug}/${prevLesson.moduleSlug}/${prevLesson.slug}`,
        title: prevLesson.title,
      }
    : null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8 space-y-4">
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl space-y-2 text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">
                  {error.title}
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                  {error.message}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
              {error.action?.href ? (
                <Link
                  href={error.action.href}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  {error.action.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleComplete()}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-colors"
                >
                  {error.action?.label || "Coba Lagi"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Lesson Link */}
        <div className="max-w-full">
          {prevTarget ? (
            <Link
              href={prevTarget.href}
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors max-w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-xs">Sebelumnya: {prevTarget.title}</span>
            </Link>
          ) : (
            <span className="text-xs text-gray-400">Pelajaran Pertama</span>
          )}
        </div>

        {/* Complete Action Button & Forward Navigation */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
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

          {/* Forward Action: Navigation Context or Legacy Fallback */}
          {navigation ? (
            navigation.nextLesson ? (
              navigation.nextLesson.isLocked ? (
                <span
                  className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed"
                  title={navigation.nextLesson.reason || "Pelajaran berikutnya terkunci"}
                  aria-label={navigation.nextLesson.reason || "Pelajaran berikutnya terkunci"}
                >
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  Berikutnya
                </span>
              ) : (
                <Link
                  href={navigation.nextLesson.href}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Berikutnya
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              )
            ) : navigation.moduleAssessment ? (
              status === "COMPLETED" || navigation.moduleAssessment.isUnlocked ? (
                <Link
                  href={navigation.moduleAssessment.href}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Ujian Akhir Modul
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              ) : (
                <span
                  className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed"
                  title={navigation.moduleAssessment.reason || "Ujian akhir modul terkunci"}
                  aria-label={navigation.moduleAssessment.reason || "Ujian akhir modul terkunci"}
                >
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  Ujian Akhir Modul
                </span>
              )
            ) : navigation.nextModuleFirstLesson ? (
              navigation.nextModuleFirstLesson.isLocked ? (
                <span
                  className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed"
                  title={navigation.nextModuleFirstLesson.reason || "Modul berikutnya terkunci"}
                  aria-label={navigation.nextModuleFirstLesson.reason || "Modul berikutnya terkunci"}
                >
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  Modul Berikutnya
                </span>
              ) : (
                <Link
                  href={navigation.nextModuleFirstLesson.href}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Modul Berikutnya
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              )
            ) : null
          ) : (
            status === "COMPLETED" && assessmentUrl ? (
              <Link
                href={assessmentUrl}
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                Ujian Akhir Modul
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            ) : nextLesson ? (
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
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
