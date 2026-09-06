import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLearningPathDetail } from "@/features/learning/queries";
import { prisma } from "@/lib/db/client";
import { welcomeFinalConceptQuestions } from "@/features/learning/assessment/welcome.server";
import { projectPublicFinalConceptQuestion } from "@/features/learning/content/public-projection";
import { ModuleAssessmentPlayer } from "@/features/learning/components/module-assessment-player";
import { ArrowLeft, Lock, AlertCircle } from "lucide-react";

interface ModuleAssessmentPageProps {
  params: Promise<{
    pathSlug: string;
    moduleSlug: string;
  }>;
}

export default async function ModuleAssessmentPage({
  params,
}: ModuleAssessmentPageProps) {
  const { pathSlug, moduleSlug } = await params;
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect(`/login?callbackUrl=/learn/${pathSlug}/${moduleSlug}/assessment`);
  }

  const pathDetail = await getLearningPathDetail(pathSlug, user.id);
  if (!pathDetail) {
    notFound();
  }

  const currentModule = pathDetail.modules.find((m) => m.slug === moduleSlug);
  if (!currentModule) {
    notFound();
  }

  // Verify all lessons in the module are completed
  const uncompletedLessons = currentModule.lessons.filter(
    (l) => l.status !== "COMPLETED"
  );

  // If prerequisites not met, render locked barrier
  if (uncompletedLessons.length > 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ujian Akhir Modul Masih Terkunci
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Anda harus menyelesaikan seluruh materi pelajaran dalam modul <strong>{currentModule.title}</strong> terlebih dahulu sebelum dapat membuka lembar evaluasi akhir.
          </p>
        </div>

        <div className="p-5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-left max-w-md mx-auto">
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-semibold">Pelajaran yang belum selesai ({uncompletedLessons.length}):</p>
              <ul className="list-disc pl-4 space-y-1">
                {uncompletedLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/learn/${pathSlug}/${moduleSlug}/${lesson.slug}`}
                      className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-200"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={`/learn/${pathSlug}`}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Modul
          </Link>
        </div>
      </div>
    );
  }

  // Load and sanitize questions for this module
  // Currently supports welcome-to-networking; extensible for future modules
  const rawQuestions =
    moduleSlug === "welcome-to-networking" ? welcomeFinalConceptQuestions : [];
  const publicQuestions = rawQuestions.map(projectPublicFinalConceptQuestion);

  // Check if user has already passed
  const alreadyPassed = await prisma.assessmentAttempt.findFirst({
    where: {
      userId: user.id,
      moduleId: currentModule.id,
      passed: true,
    },
    select: { id: true },
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2"
      >
        <Link href="/learn" className="hover:underline">
          Learn
        </Link>
        <span>/</span>
        <Link href={`/learn/${pathSlug}`} className="hover:underline">
          {pathDetail.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200">{currentModule.title}</span>
        <span>/</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Ujian Akhir</span>
      </nav>

      {/* Module Assessment Player */}
      <ModuleAssessmentPlayer
        moduleId={currentModule.id}
        moduleTitle={currentModule.title}
        pathSlug={pathSlug}
        moduleSlug={moduleSlug}
        questions={publicQuestions}
        initialAlreadyPassed={Boolean(alreadyPassed)}
      />
    </div>
  );
}
