import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLessonDetail } from "@/features/learning/queries";
import { startLessonProgress } from "@/features/learning/progress";
import { LessonActionBar } from "@/features/learning/components/lesson-action-bar";
import { LessonRenderer } from "@/features/learning/blocks/lesson-renderer";
import { LearningOutcomes } from "@/features/learning/components/learning-outcomes";
import { BookmarkButton } from "@/features/learning/bookmarks/components/bookmark-button";
import { isLessonBookmarked } from "@/features/learning/bookmarks/service";
import { ArrowLeft, Lock, Award, AlertCircle } from "lucide-react";

interface LessonPageProps {
  params: Promise<{
    pathSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { pathSlug, moduleSlug, lessonSlug } = await params;
  const user = await getCurrentUser();

  const detail = await getLessonDetail(
    pathSlug,
    moduleSlug,
    lessonSlug,
    user?.id
  );

  if (!detail) {
    notFound();
  }

  const { path, module, lesson, prevLesson, nextLesson } = detail;
  const isBookmarked = await isLessonBookmarked(user?.id, lesson.id);

  // If user is logged in and lesson is AVAILABLE, transition to IN_PROGRESS on view
  if (user?.id && lesson.status === "AVAILABLE") {
    try {
      await startLessonProgress(user.id, lesson.id);
      lesson.status = "IN_PROGRESS";
    } catch {
      // Ignore if concurrent update
    }
  }

  // Handle LOCKED barrier view
  if (lesson.status === "LOCKED") {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pelajaran Ini Masih Terkunci
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Anda harus menyelesaikan materi prasyarat terlebih dahulu sebelum dapat membuka pelajaran ini.
          </p>
        </div>

        {lesson.unmetPrerequisites.length > 0 && (
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-left max-w-md mx-auto">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold">Prasyarat yang belum selesai:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {lesson.unmetPrerequisites.map((prereq) => (
                    <li key={prereq.id}>
                      <Link
                        href={`/learn/${pathSlug}/${prereq.moduleSlug || moduleSlug}/${prereq.slug}`}
                        className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-200"
                      >
                        {prereq.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <BookmarkButton
            lessonId={lesson.id}
            initialBookmarked={isBookmarked}
          />
          <Link
            href={`/learn/${pathSlug}`}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Modul
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb Header */}
      <div>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2 mb-3"
        >
          <Link href="/learn" className="hover:underline">
            Learn
          </Link>
          <span>/</span>
          <Link href={`/learn/${path.slug}`} className="hover:underline">
            {path.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-200">{module.title}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          <div className="flex items-center space-x-2">
            <BookmarkButton
              lessonId={lesson.id}
              initialBookmarked={isBookmarked}
            />
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Award className="w-3.5 h-3.5 mr-1" />
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {lesson.description}
        </p>
      </div>

      {/* Learning Outcomes Section */}
      {lesson.outcomes && lesson.outcomes.length > 0 && (
        <LearningOutcomes
          outcomes={lesson.outcomes}
          scope="lesson"
          title={`Sasaran Kompetensi: ${lesson.title}`}
        />
      )}

      {/* Lesson Content Body */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm space-y-6">
        {lesson.content ? (
          <>
            <LessonRenderer content={lesson.content} lessonId={lesson.id} />

            {/* Action Bar (Complete & Navigation) */}
            <LessonActionBar
              lessonId={lesson.id}
              initialStatus={lesson.status}
              pathSlug={path.slug}
              assessmentUrl={
                (!nextLesson || nextLesson.moduleSlug !== module.slug) &&
                module.finalAssessment
                  ? `/learn/${path.slug}/${module.slug}/assessment`
                  : null
              }
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              navigation={detail.navigation}
            />
          </>
        ) : (
          <div className="p-6 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-sm">Konten Sedang Dipersiapkan</h3>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Materi pelajaran terstruktur untuk tahap ini sedang dalam proses finalisasi kurikulum. Pelajaran yang belum memiliki materi resmi tidak dapat diselesaikan secara terverifikasi.
            </p>
            <div className="pt-2">
              <Link
                href={`/learn/${path.slug}`}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Kembali ke Modul
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
