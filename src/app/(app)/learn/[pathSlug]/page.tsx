import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLearningPathDetail } from "@/features/learning/queries";
import { LearningOutcomes } from "@/features/learning/components/learning-outcomes";
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  ArrowLeft,
  Award,
  FileCheck,
} from "lucide-react";

interface PathDetailPageProps {
  params: Promise<{
    pathSlug: string;
  }>;
}

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  const { pathSlug } = await params;
  const user = await getCurrentUser();
  const path = await getLearningPathDetail(pathSlug, user?.id);

  if (!path) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Header */}
      <div>
        <Link
          href="/learn"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Kembali ke Semua Jalur
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {path.title}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400 max-w-3xl">
              {path.description}
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-xl text-blue-700 dark:text-blue-300 font-semibold text-sm">
            <Award className="w-4 h-4" />
            <span>
              {path.completedLessonsCount} / {path.totalLessonsCount} Selesai ({path.progressPercent}%)
            </span>
          </div>
        </div>

        {/* Global Path Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${path.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Modules & Lessons Section */}
      <div className="space-y-6">
        {path.modules.map((module) => (
          <div
            key={module.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
          >
            {/* Module Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {module.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {module.description}
                </p>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {module.completedCount} / {module.totalCount} Pelajaran ({module.progressPercent}%)
              </div>
            </div>

            {/* Module Outcomes Section */}
            {module.outcomes && module.outcomes.length > 0 && (
              <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800">
                <LearningOutcomes outcomes={module.outcomes} scope="module" />
              </div>
            )}

            {/* Lessons List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {module.lessons.map((lesson) => {
                const isLocked = lesson.status === "LOCKED";
                const isCompleted = lesson.status === "COMPLETED";
                const isInProgress = lesson.status === "IN_PROGRESS";

                return (
                  <div
                    key={lesson.id}
                    className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isLocked
                        ? "bg-gray-50/30 dark:bg-gray-800/20 text-gray-400"
                        : "hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="mt-0.5">
                        {isCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        {isInProgress && (
                          <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                        )}
                        {lesson.status === "AVAILABLE" && (
                          <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                        {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`text-base font-semibold ${
                              isLocked
                                ? "text-gray-500 dark:text-gray-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {lesson.title}
                          </h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            +{lesson.xpReward} XP
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {lesson.description}
                        </p>

                        {/* Prerequisite notice if locked */}
                        {isLocked && lesson.unmetPrerequisites.length > 0 && (
                          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                            <Lock className="w-3 h-3 mr-1" />
                            <span>
                              Prasyarat: Selesaikan{" "}
                              <strong>{lesson.unmetPrerequisites.map((p) => p.title).join(", ")}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lesson Action */}
                    <div className="sm:text-right flex-shrink-0">
                      {isLocked ? (
                        <span className="inline-flex items-center text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5 mr-1" />
                          Terkunci
                        </span>
                      ) : (
                        <Link
                          href={`/learn/${path.slug}/${module.slug}/${lesson.slug}`}
                          className={`inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            isCompleted
                              ? "text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-950/60 dark:text-green-300"
                              : "text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                          }`}
                        >
                          {isCompleted
                            ? "Ulas Kembali"
                            : isInProgress
                            ? "Lanjutkan"
                            : "Mulai Pelajaran"}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Module Assessment Section */}
            {module.finalAssessment && (
              <div className="p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border-t border-blue-100 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5">
                    <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {module.finalAssessment.title}
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        Evaluasi Akhir Modul
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-xl">
                      {module.finalAssessment.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                      <span>
                        {module.finalAssessment.conceptQuestionCount} Soal Konsep (Min {module.finalAssessment.conceptPassThreshold}/10)
                      </span>
                      <span>•</span>
                      <span>
                        {module.finalAssessment.practicalCriteriaCount} Kriteria Praktik (Wajib 100%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right flex-shrink-0">
                  {module.completedCount >= module.totalCount ? (
                    <Link
                      href={`/learn/${path.slug}/${module.slug}/assessment`}
                      className="inline-flex items-center px-4 py-2.5 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                      Mulai Ujian Akhir
                    </Link>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700/80 px-3 py-1.5 rounded-lg cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5 mr-1" />
                      Selesaikan {module.totalCount - module.completedCount} Pelajaran Lagi
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Path Final Capstone Section for Network Foundations */}
      {path.slug === "network-foundations" && (
        <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/60 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Award className="w-4 h-4" />
                <span>Ujian Akhir Kelulusan Path (Path Capstone Challenge)</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Hari Pertama Sebagai Staf IT Support
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Uji kemampuan menyeluruh dari 8 modul Network Foundations: inventarisasi perangkat aktif dan media fisik, pemilihan topologi jaringan kantor yang tangguh, serta investigasi troubleshooting bottom-up sesuai hierarki Layer OSI.
              </p>
            </div>
            <div className="flex-shrink-0">
              {path.completedLessonsCount >= path.totalLessonsCount ? (
                <Link
                  href="/challenges/first-day-it-support?isPathFinal=true"
                  className="inline-flex items-center px-5 py-3 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Mulai Ujian Akhir Path
                </Link>
              ) : (
                <div className="inline-flex items-center text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Lock className="w-4 h-4 mr-1.5 text-gray-400" />
                  Terkunci • Selesaikan {path.totalLessonsCount - path.completedLessonsCount} materi lagi
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
