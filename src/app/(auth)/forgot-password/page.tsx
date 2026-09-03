import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030308] px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(56,189,248,0.12),transparent_35%)]" />
      <Link
        href="/"
        className="relative mb-7 font-brand text-2xl font-bold tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        NETLOKA
      </Link>
      <div className="relative w-full flex justify-center">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
