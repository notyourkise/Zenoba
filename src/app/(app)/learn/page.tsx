import { BookOpen } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learning Paths
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Jalur pembelajaran terstruktur jaringan komputer dari fondasi dasar hingga tingkat lanjut.
          </p>
        </div>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center py-16">
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Katalog modul pembelajaran interaktif akan segera tersedia pada Milestone berikutnya.
        </p>
      </div>
    </div>
  );
}
