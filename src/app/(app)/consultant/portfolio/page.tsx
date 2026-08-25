import React from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, ChevronLeft, Award, Calendar } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export default async function PortfolioPage() {
  const user = await getCurrentUser();

  let projects: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (user?.id) {
    projects = await prisma.consultantProject.findMany({
      where: { userId: user.id },
      include: { case: true },
      orderBy: { submittedAt: "desc" },
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <Link
        href="/consultant"
        className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Kembali ke Katalog Konsultan
      </Link>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Award className="w-4 h-4" />
          <span>Professional Network Design Records</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Portofolio Proyek Konsultan Saya
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Daftar seluruh proposal dan rancangan infrastruktur jaringan yang telah Anda ajukan kepada klien di Netloka.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 space-y-4">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Belum Ada Proyek Konsultasi Tersimpan
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Pilih salah satu studi kasus di mode konsultan, rancang BoQ & topologi, lalu ajukan proposal resmi untuk membangun portofolio Anda.
            </p>
          </div>
          <Link
            href="/consultant"
            className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Jelajahi Studi Kasus Klien →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold ${
                      proj.passed
                        ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {proj.passed ? "Disetujui Klien" : "Revisi Diperlukan"}
                  </span>
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(proj.submittedAt).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {proj.case?.title || "Proyek Jaringan"}
                </h3>
                <p className="text-xs text-gray-500">
                  Klien: <strong>{proj.case?.clientName || "Klien Netloka"}</strong> • Pagu Anggaran: Rp {(proj.case?.budget || 0).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-semibold">Skor Proposal</span>
                  <span className="text-2xl font-black text-indigo-600">
                    {proj.score} / 100
                  </span>
                </div>

                <Link
                  href={`/consultant/${proj.case?.slug}`}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
