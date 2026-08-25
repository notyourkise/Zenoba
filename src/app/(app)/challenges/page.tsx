import { SupportChallengePlayer } from "@/features/challenges/components/support-challenge-player";
import { Bug } from "lucide-react";

export default function ChallengesPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
          <Bug className="w-4 h-4" />
          <span>Real-World Scenario Challenges</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Network Challenges
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Uji keterampilan pemecahan masalah jaringan di skenario nyata tanpa panduan bertahap.
        </p>
      </div>

      {/* Capstone Challenge Player */}
      <SupportChallengePlayer />
    </div>
  );
}
