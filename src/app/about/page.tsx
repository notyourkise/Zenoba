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
      <main className="mx-auto w-full max-w-4xl px-6 py-14 sm:px-8 sm:py-20">
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

          <section className={sectionClass} aria-labelledby="zenoba-story">
            <h2 id="zenoba-story" className="text-2xl font-bold text-white">
              Perjalanan Zenoba
            </h2>
            <div className="mt-4 space-y-4 leading-7 text-slate-300">
              <p>Zenoba sebelumnya hadir sebagai Netloka.</p>
              <p>
                Zenoba dikembangkan dan dikelola secara independen oleh Fikri Haikal.
              </p>
              <p>
                Fokusnya adalah membantu pembelajar memahami IT infrastructure melalui
                konsep, interaksi, latihan, dan penalaran yang dekat dengan pekerjaan
                nyata.
              </p>
            </div>
          </section>

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
            <Link
              href="/"
              className="text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/terms"
              className="text-slate-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              className="text-slate-200 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Privacy Policy
            </Link>
          </nav>
        </article>
      </main>
    </div>
  );
}
