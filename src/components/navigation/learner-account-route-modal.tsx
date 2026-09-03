"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AccountModal, AccountTab } from "./account-modal/account-modal";

interface LearnerAccountRouteModalProps {
  initialTab: AccountTab;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
    headline?: string | null;
    streakCount?: number;
    lastStreakDate?: string | null;
  } | null;
}

export function LearnerAccountRouteModal({
  initialTab,
  user,
}: LearnerAccountRouteModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/dashboard");
  };

  return (
    <AccountModal
      isOpen={isOpen}
      onClose={handleClose}
      initialTab={initialTab}
      user={user}
    />
  );
}
