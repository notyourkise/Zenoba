import { redirect } from "next/navigation";
import { getSafeAuthCallback } from "@/features/auth/callback-url";

type SignUpPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const parameters = await searchParams;
  const requestedCallback = Array.isArray(parameters.callbackUrl)
    ? parameters.callbackUrl[0]
    : parameters.callbackUrl;
  const callbackUrl = getSafeAuthCallback(requestedCallback);
  const destination = new URLSearchParams({ auth: "sign-up" });
  if (callbackUrl) destination.set("callbackUrl", callbackUrl);
  redirect(`/?${destination.toString()}`);
}
