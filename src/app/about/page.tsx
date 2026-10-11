import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/navigation/app-header";

export const metadata: Metadata = {
  title: "Tentang Zenoba | Zenoba",
  description:
    "Informasi tentang Zenoba, platform belajar IT infrastructure berbasis praktik.",
};

const sectionClass =
  "rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030308] text-white">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
        <article className="space-y-10">
          <header className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Tentang Zenoba
            </p>
            <h1 className="font-brand text-4xl font-bold tracking-wide text-white sm:text-5xl">
              Tentang Zenoba
            </h1>
            <p className="text-lg leading-8 text-slate-300">
              Zenoba adalah platform belajar IT infrastructure berbasis praktik.
            </p>
          </header>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className={sectionClass} aria-labelledby="zenoba-vision">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Arah Zenoba
              </p>
              <h2 id="zenoba-vision" className="mt-3 text-2xl font-bold text-white">
                Visi
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Menjadikan pembelajaran IT infrastructure lebih mudah dipahami melalui
                praktik yang terarah dan relevan.
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="zenoba-mission">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
                Cara Zenoba bergerak
              </p>
              <h2 id="zenoba-mission" className="mt-3 text-2xl font-bold text-white">
                Misi
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-300">
                <li>Menghubungkan konsep dasar dengan latihan yang dapat dicoba langsung.</li>
                <li>Mendorong pengambilan keputusan teknis melalui studi kasus terstruktur.</li>
                <li>Menyediakan pengalaman belajar yang dapat berkembang bersama kebutuhan pembelajar.</li>
              </ul>
            </section>
          </div>

          <section
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#02040d] px-6 py-8 sm:px-8 sm:py-10"
            aria-labelledby="zenoba-story"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 1000 480"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M-30 112C110 32 152 205 305 155S461 42 574 144s121 44 228 146 131 7 235-58"
                className="stroke-cyan-200/50"
                strokeWidth="2"
              />
              <path
                d="M20 382c134-94 219 10 324-54s142-172 262-102 225 71 398-88"
                className="stroke-violet-200/45"
                strokeWidth="1.5"
              />
              <path
                d="M65 52l66 52 46-28 52 94M824 321l58-77 60 66 34-112"
                className="stroke-slate-300/40"
                strokeWidth="1"
              />
              <circle cx="131" cy="104" r="3" className="fill-cyan-200/80" />
              <circle cx="177" cy="76" r="3" className="fill-slate-100/80" />
              <circle cx="882" cy="244" r="3" className="fill-violet-200/80" />
              <circle cx="942" cy="310" r="3" className="fill-slate-100/80" />
            </svg>

            <span
              aria-hidden="true"
              className="absolute left-[7%] top-[21%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_5px_rgba(103,232,249,0.28)]"
            />
            <span
              aria-hidden="true"
              className="absolute right-[10%] top-[13%] h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_14px_4px_rgba(253,230,138,0.24)]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[15%] right-[6%] h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_18px_5px_rgba(196,181,253,0.25)]"
            />

            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                IT infrastructure journey
              </p>
              <h2 id="zenoba-story" className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Perjalanan Zenoba
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Sebuah perjalanan independen untuk membuat praktik infrastruktur
                digital terasa lebih dekat, jelas, dan dapat dipelajari secara
                bertahap.
              </p>
            </div>

            <ol className="relative z-10 mt-10 grid gap-6 md:grid-cols-3">
              <li className="rounded-xl border border-cyan-300/25 bg-slate-950/70 p-5 backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="mb-5 block h-11 w-11 rounded-full border border-cyan-100/70 bg-gradient-to-br from-cyan-100 via-sky-400 to-blue-700 shadow-[0_0_24px_7px_rgba(56,189,248,0.22)]"
                />
                <p className="text-sm font-semibold text-cyan-200">Mei 2026</p>
                <h3 className="mt-2 text-lg font-bold text-white">Netloka dimulai</h3>
                <p className="mt-3 leading-7 text-slate-300">
                  Netloka dimulai pada Mei 2026.
                </p>
              </li>

              <li className="rounded-xl border border-violet-300/25 bg-slate-950/70 p-5 backdrop-blur-sm md:translate-y-8">
                <span
                  aria-hidden="true"
                  className="mb-5 block h-12 w-12 rounded-full border border-violet-100/70 bg-gradient-to-br from-violet-100 via-fuchsia-400 to-indigo-800 shadow-[0_0_24px_7px_rgba(167,139,250,0.23)]"
                />
                <p className="text-sm font-semibold text-violet-200">2026</p>
                <h3 className="mt-2 text-lg font-bold text-white">Dibangun mandiri</h3>
                <p className="mt-3 leading-7 text-slate-300">
                  Zenoba didirikan secara individual oleh Fikri Haikal pada 2026.
                </p>
                <p className="mt-3 leading-7 text-slate-400">
                  Zenoba dikembangkan dan dikelola secara independen oleh Fikri
                  Haikal.
                </p>
              </li>

              <li className="rounded-xl border border-amber-300/25 bg-slate-950/70 p-5 backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="mb-5 block h-11 w-11 rounded-full border border-amber-100/70 bg-gradient-to-br from-amber-100 via-orange-400 to-red-700 shadow-[0_0_24px_7px_rgba(251,191,36,0.22)]"
                />
                <p className="text-sm font-semibold text-amber-200">Oktober 2026</p>
                <h3 className="mt-2 text-lg font-bold text-white">Identitas Zenoba</h3>
                <p className="mt-3 leading-7 text-slate-300">
                  Zenoba menjadi identitas baru pada Oktober 2026.
                </p>
              </li>
            </ol>
          </section>

          <section className={sectionClass} aria-labelledby="zenoba-values">
            <h2 id="zenoba-values" className="text-2xl font-bold text-white">
              Nilai dan produk
            </h2>
            <div className="mt-4 space-y-4 leading-7 text-slate-300">
              <p>
                Zenoba mengutamakan praktik yang jelas, simulasi yang aman, dan umpan
                balik yang dapat dipahami.
              </p>
              <p>
                Networking adalah domain pembelajaran yang tersedia melalui Learn, Labs,
                Challenges, dan Consultant.
              </p>
            </div>
          </section>

          <nav
            aria-label="Navigasi Tentang Zenoba"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold"
          >
            <Link href="/" className="text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
              Kembali ke Beranda
            </Link>
            <Link href="/terms" className="text-slate-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
              Terms
            </Link>
            <Link href="/privacy-policy" className="text-slate-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
              Privacy Policy
            </Link>
          </nav>
        </article>
      </main>
    </div>
  );
}
