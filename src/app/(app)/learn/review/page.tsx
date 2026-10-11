import { requireLearnerActor } from "@/features/authorization/guards";
import { getLearnerReviewSession } from "@/features/learning/review-service";
import { ReviewSessionClient } from "@/features/learning/components/review-session";

export const metadata = {
  title: "Review Berkala (Spaced Repetition) — Zenoba",
  description:
    "Perkuat retensi dan penguasaan sasaran kompetensi kurikulum jaringan melalui jadwal review berkala yang deterministik.",
};

interface ReviewPageProps {
  searchParams: Promise<{ outcome?: string }>;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const actor = await requireLearnerActor();
  const resolvedParams = await searchParams;
  const sessionData = await getLearnerReviewSession(actor.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
          Pengulangan Terjadwal · Spaced Repetition
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Review Berkala Sasaran Kompetensi
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Mekanisme penguatan daya ingat berbasis interval waktu deterministik. Uji ingatan konsep-konsep kunci yang telah Anda pelajari untuk memastikan penguasaan bertahan dalam ingatan jangka panjang.
        </p>
      </div>

      <ReviewSessionClient
        sessionData={sessionData}
        initialOutcomeId={resolvedParams.outcome}
      />
    </div>
  );
}
