import Link from "next/link";
import { AppHeader } from "@/components/navigation/app-header";
import { CosmicBackground } from "@/components/effects/cosmic-background";
import { LottiePlayer } from "@/components/effects/lottie-player";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-gray-950 text-foreground selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Universal App Header Navigation */}
      <AppHeader />

      {/* Ambient Cosmic Celestial Background (Visible in Dark Mode) */}
      <CosmicBackground />

      {/* Main 404 Presentation */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 sm:py-32 text-center">
        {/* Lottie 404 Animation Visual */}
        <div className="w-full max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center">
          <LottiePlayer
            src="/GIF/Page%20Not%20Found%20404.json"
            ariaLabel="Ilustrasi animasi 404 - Halaman Tidak Ditemukan"
            className="w-full h-full"
          />
        </div>

        {/* Informative Copy & Actions */}
        <div className="max-w-xl mx-auto mt-2 space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Error 404 · Destination Unreachable
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Rute atau checkpoint jaringan yang Anda tuju berada di luar jangkauan radar Netloka atau telah dipindahkan.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Button variant="default" asChild size="lg">
              <Link href="/">
                Kembali ke Beranda
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/dashboard">
                Buka Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild size="lg">
              <Link href="/learn">
                Jelajahi Modul Belajar
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
