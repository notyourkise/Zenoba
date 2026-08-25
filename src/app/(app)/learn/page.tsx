import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLearningPathsWithProgress } from "@/features/learning/queries";
import { BookOpen, Layers, ArrowRight } from "lucide-react";

export default async function LearnCatalogPage() {
  const user = await getCurrentUser();
  const paths = await getLearningPathsWithProgress(user?.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Learning Paths
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Pilih jalur belajar interaktif dan ikuti materi terstruktur dari dasar hingga mahir.
        </p>
      </div>

      {paths.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Belum ada jalur belajar yang dipublikasikan saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((path) => (
            <div
              key={path.id}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                  <Layers className="w-3.5 h-3.5 mr-1" />
                  {path.modulesCount} Modul • {path.totalLessonsCount} Pelajaran
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {path.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 leading-relaxed">
                {path.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>Progres Pembelajaran</span>
                  <span>{path.progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${path.progressPercent}%` }}
                  />
                </div>
              </div>

              <Link
                href={`/learn/${path.slug}`}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {path.progressPercent > 0 ? "Lanjutkan Belajar" : "Mulai Jalur Ini"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
