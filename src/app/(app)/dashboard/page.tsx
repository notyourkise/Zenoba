import { getCurrentUser } from "@/lib/auth";
import { getUserProgressSummary } from "@/features/learning/progress";
import { getLearningPathsWithProgress } from "@/features/learning/queries";
import {
  BookOpen,
  FlaskConical,
  Bug,
  Award,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  HelpCircle,
  FolderCheck,
  ArrowUpRight,
  Sparkles,
  Network,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const progressSummary = user?.id
    ? await getUserProgressSummary(user.id)
    : { totalLessons: 0, completedCount: 0, inProgressCount: 0, completionPercentage: 0, totalXp: 0 };

  const paths = await getLearningPathsWithProgress(user?.id);
  const activePath = paths.find((p) => p.progressPercent > 0 && p.progressPercent < 100) || paths[0] || null;

  return (
    <div className="relative space-y-12 pb-16">
      {/* ========================================================================= */}
      {/* HERO SECTION (CLEAN WORKSPACE SURFACE)                                     */}
      {/* ========================================================================= */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-8 border-b border-gray-200/80 dark:border-white/10 bg-transparent">
        {/* Hero Content Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Hero Content Inner */}
          <div className="relative z-10 px-2 sm:px-4 py-2 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 p-6 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-xs">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dashboard Pembelajaran
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white">
                  Selamat Datang{user?.name ? `, ${user.name}` : ""}!
                </h1>
                <p className="mt-1 text-sm sm:text-base text-black dark:text-white max-w-2xl">
                  Pusat kendali progres belajar jaringan komputer, simulasi lab praktikum, tantangan troubleshooting, dan portofolio konsultan TI Anda.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/consultant/portfolio"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-semibold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <FolderCheck className="w-4 h-4 text-indigo-500" />
                  Portofolio Saya
                </Link>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Mulai Belajar
                </Link>
              </div>
            </div>

            {/* Quick Stats Cards (4 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Pelajaran Selesai"
                value={`${progressSummary.completedCount} / ${progressSummary.totalLessons}`}
                subtext={`${progressSummary.completionPercentage}% kurikulum terselesaikan`}
                icon={<BookOpen className="h-5 w-5" />}
                accentColor="blue"
              />
              <StatCard
                title="Sedang Dipelajari"
                value={progressSummary.inProgressCount.toString()}
                subtext="Modul aktif dalam progres"
                icon={<TrendingUp className="h-5 w-5" />}
                accentColor="amber"
              />
              <StatCard
                title="Total XP Terverifikasi"
                value={`${progressSummary.totalXp} XP`}
                subtext="Tercatat di Ledger XP Idempoten"
                icon={<Award className="h-5 w-5" />}
                accentColor="emerald"
              />
              <StatCard
                title="Ekosistem Praktik"
                value="7 Lab • 5 Proyek"
                subtext="3 Tantangan Troubleshooting"
                icon={<FlaskConical className="h-5 w-5" />}
                accentColor="indigo"
              />
            </div>

            {/* Active Learning Path Card */}
            {activePath && (
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                      Jalur Belajar Rekomendasi
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
                    {activePath.progressPercent > 0 ? "Lanjutkan Belajar" : "Mulai Belajar Sekarang"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>

                {/* Progress Bar inside banner */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-medium text-blue-100">
                    <span>Progres Jalur Ini</span>
                    <span>{activePath.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-300"
                      style={{ width: `${activePath.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 1: 4 Core Pillars of Netloka */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
              4 Pilar Utama Netloka
            </h2>
            <p className="text-sm text-black dark:text-white mt-0.5">
              Alur belajar lengkap dari pemahaman konsep teoritis hingga perancangan proyek nyata.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <PillarCard
            href="/learn"
            badge="1. Learn"
            title="Learning Paths"
            description="5 jalur pembelajaran terstruktur dengan micro-learning dan visualisasi data flow interaktif."
            icon={<BookOpen className="h-6 w-6" />}
            tags={["5 Paths", "13 Block Types", "Quiz XP"]}
            accent="border-blue-500/40 hover:border-blue-500"
            badgeColor="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
          />
          <PillarCard
            href="/labs"
            badge="2. Practice"
            title="Interactive Labs"
            description="7 praktikum mandiri dengan evaluasi deterministik untuk subnetting, IP, VLAN, dan static routing."
            icon={<FlaskConical className="h-6 w-6" />}
            tags={["Subnetting", "VLAN 802.1Q", "LPM Routing"]}
            accent="border-emerald-500/40 hover:border-emerald-500"
            badgeColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          />
          <PillarCard
            href="/challenges"
            badge="3. Challenge"
            title="Troubleshooting"
            description="Skenario kerusakan jaringan nyata dengan simulator CLI terminal tanpa instruksi langkah per langkah."
            icon={<Bug className="h-6 w-6" />}
            tags={["CLI Simulator", "Diagnostic", "Root Cause"]}
            accent="border-rose-500/40 hover:border-rose-500"
            badgeColor="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
          />
          <PillarCard
            href="/consultant"
            badge="4. Consultant"
            title="Konsultan Proyek TI"
            description="Simulasi proyek perancangan jaringan: Bill of Quantities (BoQ), anggaran Rupiah, topologi, dan skor 5 dimensi."
            icon={<Briefcase className="h-6 w-6" />}
            tags={["BoQ Hardware", "VLAN Matrix", "Skor 5-D"]}
            accent="border-indigo-500/40 hover:border-indigo-500"
            badgeColor="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
          />
        </div>
      </section>

      {/* SECTION 2: Learning Pathway & UKK TKJ Readiness */}
      <section className="bg-white dark:bg-zinc-900/90 rounded-2xl border border-gray-200/80 dark:border-white/10 p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            Alur Kompetensi Kejuruan
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            Roadmap Pembelajaran & Standar UKK TKJ
          </h2>
          <p className="text-sm text-black dark:text-white mt-1 max-w-3xl">
            Kurikulum Netloka disusun bertahap untuk memastikan kesiapan siswa menghadapi Uji Kompetensi Kejuruan (UKK) Teknik Komputer dan Jaringan serta sertifikasi praktis jaringan (CCNA / MTCNA).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <RoadmapStep
            step="01"
            title="Fondasi Jaringan"
            desc="Model OSI 7-Layer, TCP/IP, media transmisi kabel Cat6, perangkat switch & router."
            href="/learn/network-foundations"
          />
          <RoadmapStep
            step="02"
            title="IPv4 & Subnetting"
            desc="Kalkulasi biner, CIDR prefix, broadcast domain, usable host, dan alokasi VLSM."
            href="/learn/ipv4-and-subnetting"
          />
          <RoadmapStep
            step="03"
            title="Switching & VLAN"
            desc="Ethernet MAC learning, segmentasi 802.1Q VLAN trunking, dan inter-VLAN routing."
            href="/learn/switching-and-lan"
          />
          <RoadmapStep
            step="04"
            title="Layanan & CLI"
            desc="DHCP DORA, DNS hierarchy, NAT/PAT translation, dan diagnostik ping/traceroute CLI."
            href="/learn/routing-and-network-services"
          />
          <RoadmapStep
            step="05"
            title="Konsultan TI"
            desc="Perancangan infrastruktur jaringan riil (BoQ, budget, topologi) untuk portofolio UKK."
            href="/consultant"
            isFlagship
          />
        </div>
      </section>

      {/* SECTION 3: Platform Architecture & Simulation Safety Highlights */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            Keunggulan Sistem & Simulasi Deterministik
          </h2>
          <p className="text-sm text-black dark:text-white mt-0.5">
            Dirancang khusus untuk kenyamanan belajar di laboratorium sekolah maupun perangkat pribadi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureHighlightCard
            icon={<Cpu className="w-5 h-5 text-blue-500" />}
            title="100% In-Browser Simulation"
            description="Tidak memerlukan instalasi software berat seperti Packet Tracer atau GNS3. Semua simulasi berjalan instan di browser."
          />
          <FeatureHighlightCard
            icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
            title="Simulasi Terminal CLI Aman"
            description="Semua perintah diagnostik (ping, ipconfig, traceroute) diproses secara terisolasi dalam parser memori tanpa akses host shell."
          />
          <FeatureHighlightCard
            icon={<Network className="w-5 h-5 text-indigo-500" />}
            title="Evaluasi Logika Deterministik"
            description="Validasi subnetting, jangkauan routing, dan segmentasi VLAN dievaluasi secara matematis dan transparan tanpa halusinasi AI."
          />
          <FeatureHighlightCard
            icon={<FolderCheck className="w-5 h-5 text-amber-500" />}
            title="Portofolio Proyek Terverifikasi"
            description="Hasil rancangan proyek konsultan dan skor 5 dimensi tersimpan permanen sebagai bukti kompetensi praktis siswa."
          />
        </div>
      </section>

      {/* SECTION 4: Quick Start Guidance & FAQ */}
      <section className="bg-white dark:bg-zinc-900/90 rounded-2xl border border-gray-200/80 dark:border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white">
              Panduan Cepat & Informasi Pembelajaran
            </h2>
            <p className="text-xs sm:text-sm text-black dark:text-white">
              Pertanyaan umum dan tips memaksimalkan pengalaman belajar di Netloka.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FaqCard
            question="Bagaimana alur membuka materi berikutnya?"
            answer="Materi pembelajaran terstruktur secara berurutan. Menyelesaikan materi dan lulus kuis penilaian akan membuka pelajaran berikutnya serta mencatatkan XP ke akun Anda."
          />
          <FaqCard
            question="Apa yang dinilai pada Mode Konsultan TI?"
            answer="Solusi dinilai secara deterministik pada 5 dimensi: Ketepatan Teknis (0-20), Pemenuhan Kebutuhan Klien (0-20), Efisiensi Anggaran (0-20), Skalabilitas (0-20), dan Keamanan Jaringan (0-20)."
          />
          <FaqCard
            question="Apakah nilai dan progres belajar tersimpan aman?"
            answer="Ya, seluruh riwayat belajar, perolehan XP, dan proposal konsultan disimpan dalam database PostgreSQL dengan perlindungan transaksi idempoten."
          />
          <FaqCard
            question="Apakah Netloka cocok untuk persiapan UKK TKJ?"
            answer="Sangat cocok. Topik subnetting VLSM, VLAN trunking, DHCP/NAT, serta skenario pengadaan perangkat sekolah dirancang selaras dengan kisi-kisi Uji Kompetensi Kejuruan TKJ."
          />
        </div>
      </section>

      {/* SECTION 5: Footer Accreditation Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900 text-white border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-white">
            Netloka — Platform Pembelajaran Jaringan Komputer SMK TKJ
          </p>
          <p className="text-xs text-white">
            Domain: <span className="text-blue-400 font-mono">netloka.biz.id</span> • Dibuat dengan arsitektur modular Next.js & PostgreSQL.
          </p>
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Lihat Semua Jalur Belajar
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtext,
  icon,
  accentColor = "blue",
}: {
  title: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  accentColor?: "blue" | "amber" | "emerald" | "indigo";
}) {
  const colorMap = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50",
  };

  return (
    <div className="bg-white dark:bg-zinc-900/90 p-5 rounded-xl shadow-xs border border-gray-200/80 dark:border-white/10 flex flex-col justify-between transition-all hover:border-gray-300 dark:hover:border-white/20">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-black dark:text-white uppercase tracking-wider">
            {title}
          </h3>
          <div className={`p-2 rounded-lg ${colorMap[accentColor]}`}>{icon}</div>
        </div>
        <p className="text-2xl font-black text-black dark:text-white tracking-tight">{value}</p>
      </div>
      {subtext && (
        <p className="text-xs text-black dark:text-white mt-2 border-t border-gray-100 dark:border-white/10 pt-2">
          {subtext}
        </p>
      )}
    </div>
  );
}

function PillarCard({
  href,
  badge,
  title,
  description,
  icon,
  tags,
  accent,
  badgeColor,
}: {
  href: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  accent: string;
  badgeColor: string;
}) {
  return (
    <Link
      href={href}
      className={`group bg-white dark:bg-zinc-900/90 p-6 rounded-2xl shadow-xs border border-gray-200/80 dark:border-white/10 ${accent} hover:shadow-md transition-all flex flex-col justify-between`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeColor}`}>
            {badge}
          </span>
          <ArrowUpRight className="w-4 h-4 text-black dark:text-white group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-black dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-black dark:text-white leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-4 mt-2 border-t border-gray-100 dark:border-white/10">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-[10px] font-medium text-black dark:text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function RoadmapStep({
  step,
  title,
  desc,
  href,
  isFlagship,
}: {
  step: string;
  title: string;
  desc: string;
  href: string;
  isFlagship?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group p-4 rounded-xl border transition-all flex flex-col justify-between ${
        isFlagship
          ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500"
          : "bg-gray-50/60 dark:bg-zinc-900/60 border-gray-200/70 dark:border-white/10 hover:border-blue-500"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black font-mono ${isFlagship ? "text-indigo-600 dark:text-indigo-400" : "text-blue-600 dark:text-blue-400"}`}>
            STEP {step}
          </span>
          {isFlagship && (
            <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-[9px] font-bold text-white uppercase tracking-wider">
              Flagship
            </span>
          )}
        </div>
        <h4 className="text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-black dark:text-white leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="pt-3 mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
        Buka Modul
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

function FeatureHighlightCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/90 border border-gray-200/80 dark:border-white/10 shadow-xs space-y-2.5">
      <div className="p-2.5 w-fit rounded-lg bg-gray-100 dark:bg-zinc-800">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-black dark:text-white">{title}</h4>
      <p className="text-xs text-black dark:text-white leading-relaxed">{description}</p>
    </div>
  );
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50/70 dark:bg-zinc-900/60 border border-gray-200/70 dark:border-white/10 space-y-1.5">
      <h4 className="text-sm font-bold text-black dark:text-white flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <span>{question}</span>
      </h4>
      <p className="text-xs text-black dark:text-white pl-6 leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
