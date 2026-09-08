import { redirect } from "next/navigation";
import { getFreshActor } from "@/features/authorization/guards";
import { getPostLoginDestination } from "@/features/auth/post-login";

type ContinuePageProps = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function ContinuePage(props: ContinuePageProps) {
  const actor = await getFreshActor();

  if (!actor) {
    redirect("/?auth=sign-in");
    return;
  }

  const searchParams = props.searchParams ? await props.searchParams : undefined;
  redirect(getPostLoginDestination(actor.role, searchParams?.callbackUrl));
}
