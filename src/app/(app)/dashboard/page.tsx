import { getCurrentUser } from "@/lib/auth";
import { getUserProgressSummary } from "@/features/learning/progress";
import { getLearningPathsWithProgress } from "@/features/learning/queries";
import {
  BookOpen,
  FlaskConical,
  Bug,
  ClipboardList,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const progressSummary = user?.id
    ? await getUserProgressSummary(user.id)
    : { totalLessons: 0, completedCount: 0, inProgressCount: 0, completionPercentage: 0 };

  const paths = await getLearningPathsWithProgress(user?.id);
  const activePath = paths[0] || null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Selamat Datang{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Lanjutkan perjalanan belajar jaringan komputer dan simulasi IT konsultan Anda.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pelajaran Selesai"
          value={`${progressSummary.completedCount} / ${progressSummary.totalLessons}`}
          subtext={`${progressSummary.completionPercentage}% Selesai`}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Sedang Dipelajari"
          value={progressSummary.inProgressCount.toString()}
          subtext="Aktif Berjalan"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Practice Labs"
          value="0"
          subtext="Mulai di Milestone 5"
          icon={<FlaskConical className="h-5 w-5" />}
        />
        <StatCard
          title="Consultant Project"
          value="0"
          subtext="Mulai di Milestone 6"
          icon={<ClipboardList className="h-5 w-5" />}
        />
      </div>

      {/* Active Learning Path Card */}
      {activePath && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                Jalur Belajar Aktif
              </span>
              <h2 className="text-2xl font-bold">{activePath.title}</h2>
              <p className="text-sm text-blue-100 mt-1 max-w-xl">
                {activePath.description}
              </p>
            </div>
            <Link
              href={`/learn/${activePath.slug}`}
              className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md flex-shrink-0"
            >
              {activePath.progressPercent > 0 ? "Lanjutkan Belajar" : "Mulai Sekarang"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Progress Bar inside banner */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium text-blue-100">
              <span>Progres Keseluruhan</span>
              <span>{activePath.progressPercent}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${activePath.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Area Pembelajaran Utama
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            href="/learn"
            title="Learning Paths"
            description="Pelajari fondasi jaringan, IPv4 & subnetting, switching, routing, dan troubleshooting secara interaktif."
            icon={<BookOpen className="h-6 w-6" />}
          />
          <ActionCard
            href="/labs"
            title="Practice Labs"
            description="Latihan praktis interaktif untuk mengasah keterampilan konfigurasi dan analisis paket data."
            icon={<FlaskConical className="h-6 w-6" />}
          />
          <ActionCard
            href="/challenges"
            title="Challenges"
            description="Skenario pemecahan masalah jaringan nyata tanpa panduan langkah-demi-langkah."
            icon={<Bug className="h-6 w-6" />}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtext,
  icon,
}: {
  title: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all"
    >
      <div className="flex items-center mb-3">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
