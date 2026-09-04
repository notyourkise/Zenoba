import { getCurrentUser } from "@/lib/auth";
import { getUserProgressSummary } from "@/features/learning/progress";
import { getLearningPathsWithProgress } from "@/features/learning/queries";
import Link from "next/link";

function WaveLinesBackground({ color }: { color: "purple" | "cyan" | "amber" }) {
  const strokeColor =
    color === "purple"
      ? "rgba(168, 85, 247, 0.4)"
      : color === "cyan"
      ? "rgba(6, 182, 212, 0.4)"
      : "rgba(245, 158, 11, 0.4)";

  const glowColor =
    color === "purple"
      ? "rgba(147, 51, 234, 0.25)"
      : color === "cyan"
      ? "rgba(20, 184, 166, 0.25)"
      : "rgba(217, 119, 6, 0.25)";

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        className="absolute right-0 bottom-0 w-full h-full opacity-60"
        viewBox="0 0 300 150"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 C80,140 150,60 300,80"
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <path
          d="M0,150 C100,120 180,40 300,60"
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <path
          d="M0,150 C120,100 210,30 300,40"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <path
          d="M0,150 C140,80 240,20 300,20"
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <path
          d="M0,150 C160,70 270,10 300,10"
          stroke={glowColor}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [progressSummary, paths] = user?.id
    ? await Promise.all([
        getUserProgressSummary(user.id),
        getLearningPathsWithProgress(user.id),
      ])
    : [
        { totalLessons: 0, completedCount: 0, inProgressCount: 0, completionPercentage: 0, totalXp: 0 },
        [],
      ];

  const activePath = paths.find((p) => p.progressPercent > 0 && p.progressPercent < 100) || paths[0] || null;

  const rawName = user?.name?.trim() || "Dev Netloka";
  const nameParts = rawName.split(" ");
  const firstName = nameParts[0] || "Dev";
  const lastName = nameParts.slice(1).join(" ") || "Netloka";

  const totalCourses = Math.max(paths.length, 15);
  const totalLessons = progressSummary.totalLessons || 15;
  const progressPercent = Math.min(Math.max(progressSummary.completionPercentage || 0, 0), 100);
  const completionRatioPercent = Math.round((progressSummary.completedCount / totalCourses) * 100);

  const continueHref = activePath ? `/learn/${activePath.slug}` : "/catalog";
  const continueLabel = activePath && activePath.progressPercent > 0 ? "Lanjutkan Belajar" : "Mulai Belajar";

  // SVG circle calculation for radius 40
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Hero Banner with Earth Orbital View */}
      <section
        aria-label="Hero Sambutan"
        className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-blue-500/20 bg-[#070E22] p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col justify-between min-h-[260px] md:min-h-[290px]"
      >
        {/* Background Earth Orbital Visual */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 pointer-events-none select-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard-earth-banner.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right md:object-center opacity-85"
          />
          {/* Subtle gradient overlays for flawless text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070E22] via-[#070E22]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070E22]/50 via-transparent to-transparent" />
        </div>

        {/* Top bar with Quote on the right */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-xs sm:text-sm font-medium text-zinc-300">
              Selamat Datang Kembali,
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1">
              {firstName} <span className="text-blue-500">{lastName}!</span>
            </h1>
          </div>

          <div className="hidden lg:flex flex-col items-end text-right select-none pl-4">
            <p className="font-serif italic text-sm md:text-base text-zinc-200/90 tracking-wide">
              “Better Networks
              <br />
              Brighter Opportunities”
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-300/70 font-semibold mt-2">
              N E T L O K A
            </p>
          </div>
        </div>

        {/* Bottom bar with description and CTA */}
        <div className="relative z-10 pt-4 space-y-4 max-w-xl">
          <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed max-w-md">
            Terus eksplorasi, praktik, dan asah skill jaringanmu.
            Masa depan infrastruktur ada di tanganmu.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href={continueHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>{continueLabel}</span>
              <span aria-hidden="true">&gt;</span>
            </Link>
            <span className="text-xs text-zinc-400 italic">
              Belajar hari ini, jaringan yang lebih baik esok hari.
            </span>
          </div>
        </div>
      </section>

      {/* 2. Quick Stats Row (4 Cards) */}
      <section aria-label="Statistik Cepat" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Kursus */}
        <div className="rounded-2xl border border-blue-900/30 bg-[#081024]/80 p-5 shadow-lg flex flex-col justify-between transition-colors hover:border-blue-500/40">
          <div>
            <h2 className="text-xs font-medium text-zinc-400">
              Total Kursus
            </h2>
            <p className="text-3xl font-black text-white mt-2 tracking-tight">
              {totalCourses}
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            kursus tersedia
          </p>
        </div>

        {/* Card 2: Sedang Dipelajari */}
        <div className="rounded-2xl border border-teal-900/40 bg-[#081720]/80 p-5 shadow-lg flex flex-col justify-between transition-colors hover:border-teal-500/40">
          <div>
            <h2 className="text-xs font-medium text-zinc-400">
              Sedang Dipelajari
            </h2>
            <p className="text-3xl font-black text-white mt-2 tracking-tight">
              {progressSummary.inProgressCount}
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            kursus aktif sekarang
          </p>
        </div>

        {/* Card 3: Selesai */}
        <div className="rounded-2xl border border-indigo-900/40 bg-[#0E1228]/80 p-5 shadow-lg flex flex-col justify-between transition-colors hover:border-indigo-500/40">
          <div>
            <h2 className="text-xs font-medium text-zinc-400">
              Selesai
            </h2>
            <p className="text-3xl font-black text-white mt-2 tracking-tight">
              {progressSummary.completedCount}
            </p>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            dari {totalCourses} kursus ({completionRatioPercent}%)
          </p>
        </div>

        {/* Card 4: Streak Belajar with 3D Glowing Flame */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#1E1408] via-[#1B1207] to-[#2B1B06] p-5 shadow-lg shadow-amber-500/5 relative overflow-hidden flex items-center justify-between transition-colors hover:border-amber-500/50">
          <div className="flex-1 min-w-0 z-10">
            <h2 className="text-xs font-semibold text-amber-400">
              Streak Belajar
            </h2>
            <p className="text-3xl font-black text-white mt-2 tracking-tight">
              {user?.streakCount || 0} hari
            </p>
            <p className="text-xs text-amber-200/60 mt-2 truncate">
              Konsistensi membangun masa depan
            </p>
          </div>

          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 mix-blend-screen select-none ml-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/streak-flame.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* 3. Middle Row: Progres Belajar & Lanjutkan dari Terakhir */}
      <section aria-label="Progres dan Aktivitas" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Progres Belajar */}
        <div className="rounded-2xl border border-blue-900/30 bg-[#081024]/80 p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">
              Progres Belajar
            </h2>
            <Link
              href="/my-learning"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat semua &rsaquo;
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            {/* Donut Progress Gauge */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  fill="none"
                  stroke="#101D3B"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-white leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[10px] text-zinc-400 font-medium mt-1">
                  Selesai
                </span>
              </div>
            </div>

            {/* Progress Text, Horizontal Bar & 3 Metric Columns */}
            <div className="flex-1 w-full min-w-0 space-y-3">
              <p className="text-xs text-zinc-300 font-medium">
                {progressSummary.completedCount} dari {totalLessons} pelajaran selesai
              </p>

              {/* Semantic horizontal progress bar */}
              <div
                role="progressbar"
                aria-label="Progres Belajar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                className="h-2 w-full rounded-full bg-[#101D3B] overflow-hidden"
              >
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 3 Metrics below bar */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-left">
                <div>
                  <p className="text-base font-bold text-white">
                    {progressSummary.inProgressCount}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Sedang dipelajari
                  </p>
                </div>
                <div>
                  <p className="text-base font-bold text-white">
                    {progressSummary.completedCount}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Selesai
                  </p>
                </div>
                <div>
                  <p className="text-base font-bold text-white">
                    {progressSummary.totalXp}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    XP diperoleh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Lanjutkan dari Terakhir */}
        <div className="rounded-2xl border border-blue-900/30 bg-[#081024]/80 p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">
              Lanjutkan dari Terakhir
            </h2>
            <Link
              href="/my-learning"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat semua &rsaquo;
            </Link>
          </div>

          {activePath && activePath.progressPercent > 0 ? (
            <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
              <div>
                <span className="inline-block text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                  Kursus Sedang Berjalan
                </span>
                <h3 className="text-base font-bold text-white truncate">
                  {activePath.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {activePath.completedLessonsCount} dari {activePath.totalLessonsCount} pelajaran selesai ({activePath.progressPercent}%)
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/learn/${activePath.slug}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Lanjutkan Belajar
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-2">
              <p className="text-sm font-bold text-white">
                Belum ada aktivitas belajar
              </p>
              <p className="text-xs text-zinc-400 max-w-xs">
                Mulai kursus pertamamu dan lanjutkan dari sini.
              </p>
              <div className="pt-3">
                <Link
                  href="/catalog"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Jelajahi Katalog Kursus
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Praktik & Eksplorasi Section with 3 Glowing Waves Cards */}
      <section aria-labelledby="praktik-eksplorasi-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 id="praktik-eksplorasi-heading" className="text-lg md:text-xl font-bold text-white">
            Praktik & Eksplorasi
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Tingkatkan skill-mu dengan pengalaman langsung di bidang jaringan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Interactive Labs (Purple) */}
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#130E26] to-[#0A0716] p-5 shadow-lg flex flex-col justify-between group hover:border-purple-500/40 transition-all min-h-[160px]">
            <WaveLinesBackground color="purple" />
            <div className="relative z-10 space-y-2">
              <h3 className="font-bold text-base text-white">
                Interactive Labs
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Gunakan lab interaktif untuk praktik langsung tanpa perlu perangkat fisik.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <Link
                href="/labs"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                Mulai Praktik
              </Link>
            </div>
          </div>

          {/* Card 2: Troubleshooting Challenges (Cyan) */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#06181C] to-[#030E12] p-5 shadow-lg flex flex-col justify-between group hover:border-cyan-500/40 transition-all min-h-[160px]">
            <WaveLinesBackground color="cyan" />
            <div className="relative z-10 space-y-2">
              <h3 className="font-bold text-base text-white">
                Troubleshooting Challenges
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Asah kemampuan pemecahan masalah dengan skenario nyata.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <Link
                href="/challenges"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#00E5C9] hover:bg-[#2BFDE3] text-zinc-950 text-xs font-bold shadow-md shadow-cyan-500/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Mulai Tantangan
              </Link>
            </div>
          </div>

          {/* Card 3: Simulasi Konsultan TI (Amber) */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#1E1706] to-[#0F0B02] p-5 shadow-lg flex flex-col justify-between group hover:border-amber-500/40 transition-all min-h-[160px]">
            <WaveLinesBackground color="amber" />
            <div className="relative z-10 space-y-2">
              <h3 className="font-bold text-base text-white">
                Simulasi Konsultan TI
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Rasakan pengalaman menjadi konsultan TI dengan studi kasus nyata.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <Link
                href="/consultant"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#E5AA3E] hover:bg-[#F2BD5E] text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Mulai Simulasi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
