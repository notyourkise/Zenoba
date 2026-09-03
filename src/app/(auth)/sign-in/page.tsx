import { redirect } from "next/navigation";
import { getSafeAuthCallback } from "@/features/auth/callback-url";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const parameters = await searchParams;
  const requestedCallback = Array.isArray(parameters.callbackUrl)
    ? parameters.callbackUrl[0]
    : parameters.callbackUrl;
  const callbackUrl = getSafeAuthCallback(requestedCallback);
  const destination = new URLSearchParams({ auth: "sign-in" });
  if (callbackUrl) destination.set("callbackUrl", callbackUrl);
  redirect(`/?${destination.toString()}`);
}
