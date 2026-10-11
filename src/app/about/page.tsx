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
              <h2 id="zenoba-vision" className="text-2xl font-bold text-white">
                Visi
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Menjadikan pembelajaran IT infrastructure lebih mudah dipahami melalui
                praktik yang terarah dan relevan.
              </p>
            </section>

            <section className={sectionClass} aria-labelledby="zenoba-mission">
              <h2 id="zenoba-mission" className="text-2xl font-bold text-white">
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
            className="relative left-1/2 min-h-[690px] w-screen -translate-x-1/2 overflow-hidden bg-[#020308] py-12 sm:min-h-[760px] sm:py-16"
            aria-labelledby="zenoba-story"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              viewBox="0 0 1440 760"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <filter id="zenoba-orbit-glow" x="-20%" y="-40%" width="140%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M-20 106C127 55 166 220 314 166S496 65 629 182s146 201 289 128 202-249 369-110 125 214 195 271"
                stroke="rgba(226,232,240,0.95)"
                strokeWidth="2"
                filter="url(#zenoba-orbit-glow)"
              />
              <path
                d="M44 535l88-71 73 46 68-125M1118 590l70-98 81 64 60-136"
                stroke="rgba(203,213,225,0.56)"
                strokeWidth="1.2"
              />
              <path
                d="M119 97l48 66 61-32 42 86M1208 160l48 45 60-74"
                stroke="rgba(203,213,225,0.45)"
                strokeWidth="1.1"
              />
              <g fill="rgba(248,250,252,0.88)">
                <circle cx="132" cy="464" r="3" />
                <circle cx="205" cy="510" r="3" />
                <circle cx="1188" cy="492" r="3" />
                <circle cx="1269" cy="556" r="3" />
                <circle cx="167" cy="163" r="3" />
                <circle cx="1260" cy="205" r="3" />
              </g>
              <g fill="rgba(103,232,249,0.85)">
                <circle cx="90" cy="222" r="2" />
                <circle cx="1160" cy="86" r="2" />
                <circle cx="1320" cy="345" r="2" />
                <circle cx="744" cy="642" r="2" />
              </g>
              <g fill="rgba(253,230,138,0.85)">
                <circle cx="286" cy="87" r="2" />
                <circle cx="1092" cy="324" r="2" />
                <circle cx="1352" cy="620" r="2" />
              </g>
            </svg>

            <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  IT infrastructure journey
                </p>
                <h2 id="zenoba-story" className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Perjalanan Zenoba
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-slate-300">
                  Sebuah perjalanan independen untuk membuat praktik infrastruktur
                  digital terasa lebih dekat, jelas, dan dapat dipelajari secara bertahap.
                </p>
              </div>

              <ol className="relative mt-12 grid gap-12 border-l border-slate-600/70 pl-8 lg:mt-0 lg:block lg:min-h-[510px] lg:border-l-0 lg:pl-0">
                <li className="relative lg:absolute lg:left-[13%] lg:top-[8%] lg:w-52">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.65rem] top-0 h-6 w-6 rounded-full border border-sky-100/80 bg-[radial-gradient(circle_at_30%_25%,#ffffff_0%,#bae6fd_18%,#0ea5e9_55%,#075985_100%)] shadow-[0_0_26px_7px_rgba(56,189,248,0.3)] lg:static lg:mb-3 lg:block lg:h-16 lg:w-16"
                  />
                  <p className="text-sm font-semibold text-sky-200">Mei 2026</p>
                  <h3 className="mt-2 text-lg font-bold text-white">Netloka dimulai</h3>
                  <p className="mt-2 leading-7 text-slate-300">Netloka dimulai pada Mei 2026.</p>
                </li>

                <li className="relative lg:absolute lg:left-[48%] lg:top-[41%] lg:w-56">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.65rem] top-0 h-6 w-6 rounded-full border border-amber-100/80 bg-[radial-gradient(circle_at_30%_25%,#fff7ed_0%,#fbbf24_22%,#b45309_62%,#451a03_100%)] shadow-[0_0_28px_8px_rgba(245,158,11,0.28)] lg:static lg:mb-3 lg:block lg:h-[4.5rem] lg:w-[4.5rem]"
                  />
                  <p className="text-sm font-semibold text-amber-200">2026</p>
                  <h3 className="mt-2 text-lg font-bold text-white">Dibangun mandiri</h3>
                  <p className="mt-2 leading-7 text-slate-300">
                    Zenoba didirikan secara individual oleh Fikri Haikal pada 2026.
                  </p>
                  <p className="mt-2 leading-7 text-slate-400">
                    Zenoba dikembangkan dan dikelola secara independen oleh Fikri Haikal.
                  </p>
                </li>

                <li className="relative lg:absolute lg:left-[78%] lg:top-[19%] lg:w-48">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.65rem] top-0 h-6 w-6 rounded-full border border-slate-100/80 bg-[radial-gradient(circle_at_30%_25%,#ffffff_0%,#cbd5e1_22%,#475569_58%,#0f172a_100%)] shadow-[0_0_28px_8px_rgba(226,232,240,0.24)] lg:static lg:mb-3 lg:block lg:h-[4.25rem] lg:w-[4.25rem]"
                  />
                  <p className="text-sm font-semibold text-slate-200">Oktober 2026</p>
                  <h3 className="mt-2 text-lg font-bold text-white">Identitas Zenoba</h3>
                  <p className="mt-2 leading-7 text-slate-300">
                    Zenoba menjadi identitas baru pada Oktober 2026.
                  </p>
                </li>
              </ol>
            </div>
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
