import * as React from "react";
import { requireDeveloperActor, getFreshActor } from "@/features/authorization/guards";
import { AuthorizationError } from "@/features/authorization/types";
import { touchUserActivity } from "@/features/analytics/activity";
import { DeveloperShell } from "@/features/developer/components/developer-shell";

export default async function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDeveloperActor();
  const actor = await getFreshActor();

  if (!actor) {
    throw new AuthorizationError("UNAUTHENTICATED", "Authentication required");
  }

  await touchUserActivity(actor.id);

  return <DeveloperShell actor={actor}>{children}</DeveloperShell>;
}
