import Link from "next/link";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const parameters = await searchParams;
  const token = Array.isArray(parameters.token)
    ? parameters.token[0]
    : parameters.token;

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
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
