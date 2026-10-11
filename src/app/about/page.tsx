import type { Metadata } from "next";
import { AppHeader } from "@/components/navigation/app-header";
import { ZenobaHistoryJourney } from "@/components/marketing/it-infrastructure-journey";

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

          <ZenobaHistoryJourney />

        </article>
      </main>
    </div>
  );
}
