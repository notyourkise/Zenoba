import { Bug } from "lucide-react";

export default function ChallengesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
          <Bug className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Troubleshooting Challenges
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tantangan pemecahan masalah jaringan nyata tanpa panduan langkah demi langkah.
          </p>
        </div>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center py-16">
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Skenario troubleshooting menantang akan segera tersedia pada Milestone 5.
        </p>
      </div>
    </div>
  );
}
