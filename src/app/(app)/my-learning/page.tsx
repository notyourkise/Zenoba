import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getMyLearning } from "@/features/commerce/entitlements";

export const metadata = {
  title: "Pembelajaran Saya — Zenoba",
  description: "Daftar kursus dan modul pembelajaran aktif Anda di Zenoba.",
};

export default async function MyLearningPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  const { courses } = await getMyLearning(user.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Pembelajaran Saya
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Akses modul pembelajaran, simulasi praktikum interaktif, dan tantangan yang telah terdaftar di akun Anda.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="p-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-center shadow-xs">
          <p className="text-base text-zinc-600 dark:text-zinc-400">Belum ada kursus terdaftar.</p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Lihat Katalog Kursus
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isFree = course.accessTier === "FREE";
            const targetHref = course.learningPathSlug
              ? `/learn/${course.learningPathSlug}`
              : "/learn";

            return (
              <div
                key={course.id}
                className="flex flex-col justify-between p-6 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white hover:border-zinc-300 dark:hover:border-white/20 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isFree
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {isFree ? "Akses Gratis" : "Akses Premium"}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      {course.track}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6">
                    {course.description || "Modul kurikulum pembelajaran aktif."}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
                  <Link
                    href={targetHref}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    Buka Kurikulum
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
