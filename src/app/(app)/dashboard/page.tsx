import { getCurrentUser } from "@/lib/auth";
import { BookOpen, FlaskConical, Bug, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Lessons"
          value="0"
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Completed Labs"
          value="0"
          icon={<FlaskConical className="h-5 w-5" />}
        />
        <StatCard
          title="Challenges Solved"
          value="0"
          icon={<Bug className="h-5 w-5" />}
        />
        <StatCard
          title="Consultant Projects"
          value="0"
          icon={<ClipboardList className="h-5 w-5" />}
        />
      </div>

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
          <ActionCard
            href="/consultant"
            title="Consultant Mode"
            description="Simulasi proyek konsultan IT: analisis kebutuhan, pengadaan perangkat, BoQ, dan desain topologi."
            icon={<ClipboardList className="h-6 w-6" />}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
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
      className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all"
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
