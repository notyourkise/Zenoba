import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/navigation/app-header";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* AppHeader Navigation */}
      <AppHeader user={user} />

      {/* Main Content Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            Platform Pembelajaran Jaringan Interaktif
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Kuasai Jaringan Komputer Lewat{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Praktik Interaktif & Simulasi Nyata
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Didesain khusus untuk siswa SMK TKJ, pemula, dan calon network
            engineer. Belajar fondasi jaringan, subnetting, switching, routing,
            hingga simulasi proyek konsultan IT.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={user ? "/dashboard" : "/sign-up"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              {user ? "Buka Dashboard" : "Mulai Belajar Gratis"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>

          {/* 4 Feature Cards (Icons Removed, Clean Minimalist Layout) */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            <div className="p-5 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-800 transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                1. Learn
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Jalur belajar modular berbasis micro-learning dan visualisasi interaktif data flow.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-800 transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                2. Practice Labs
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Laboratorium latihan mandiri dengan evaluasi deterministik untuk subnetting, IP, dan routing.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-800 transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                3. Challenges
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Tantangan troubleshooting skenario nyata tanpa bantuan step-by-step untuk menguji ketajaman analisa.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-800 transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                4. Consultant Project
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Simulasi proyek IT konsultan: analisis kebutuhan, kalkulasi BoQ, desain topologi, dan skoring komposit.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-6 text-center text-xs text-gray-500 dark:text-gray-500">
        <p>© 2026 Netloka (netloka.biz.id). Built for interactive networking education.</p>
      </footer>
    </div>
  );
}
