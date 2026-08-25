import { ClipboardList } from "lucide-react";

export default function ConsultantPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-lg">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            IT Consultant Simulation
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Simulasi proyek konsultan jaringan: analisis kebutuhan, pengadaan perangkat, BoQ, dan desain topologi.
          </p>
        </div>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center py-16">
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Studi kasus konsultan IT nyata akan segera tersedia pada Milestone 6.
        </p>
      </div>
    </div>
  );
}
