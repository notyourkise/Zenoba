import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  BookOpen,
  FlaskConical,
  Bug,
  ClipboardList,
  ArrowRight,
  Zap,
} from "lucide-react";
import { AppHeader } from "@/components/navigation/app-header";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Unified AppHeader Navigation Menu */}
      <AppHeader user={user} />

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <Zap className="w-3.5 h-3.5" />
            <span>Platform Pembelajaran Jaringan Interaktif</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Kuasai Jaringan Komputer Lewat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Praktik Interaktif & Simulasi Nyata
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Didesain khusus untuk siswa SMK TKJ, pemula, dan calon network
            engineer. Belajar fondasi jaringan, subnetting, switching, routing,
            hingga simulasi proyek konsultan IT.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? "/dashboard" : "/sign-up"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              {user ? "Masuk ke Dashboard" : "Mulai Belajar Gratis"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                1. Learn
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Jalur belajar modular berbasis micro-learning dan visualisasi interaktif data flow.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                2. Practice Labs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Laboratorium latihan mandiri dengan evaluasi deterministik untuk subnetting, IP, dan routing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <Bug className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                3. Challenges
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Tantangan troubleshooting skenario nyata tanpa bantuan step-by-step untuk menguji ketajaman analisa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                4. Consultant Project
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Simulasi proyek IT konsultan: analisis kebutuhan, kalkulasi BoQ, desain topologi, dan skoring komposit.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center text-xs text-gray-500 dark:text-gray-500">
        <p>© 2026 Netloka (netloka.biz.id). Built with ❤️ for networking education.</p>
      </footer>
    </div>
  );
}
