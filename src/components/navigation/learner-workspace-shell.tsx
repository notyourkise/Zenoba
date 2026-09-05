"use client";

import * as React from "react";
import { LearnerSidebar } from "./learner-sidebar";
import { LearnerMobileDrawer } from "./learner-mobile-drawer";
import { AccountModal, AccountTab } from "./account-modal/account-modal";

export interface LearnerWorkspaceShellProps {
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
  children: React.ReactNode;
}

export function LearnerWorkspaceShell({
  user,
  children,
}: LearnerWorkspaceShellProps) {
  const [userOverride, setUserOverride] = React.useState<LearnerWorkspaceShellProps["user"] | null>(null);
  const currentUser = userOverride ?? user;
  const [isAccountModalOpen, setIsAccountModalOpen] = React.useState(false);
  const [accountTab, setAccountTab] = React.useState<AccountTab>("profile");

  const openAccountModal = React.useCallback((tab: AccountTab = "profile") => {
    setAccountTab(tab);
    setIsAccountModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050811] text-white selection:bg-blue-500/30 selection:text-blue-200">
      {/* Mobile Drawer */}
      <LearnerMobileDrawer
        user={currentUser}
        onOpenAccountModal={() => openAccountModal("profile")}
      />

      {/* Desktop Sidebar */}
      <LearnerSidebar
        user={currentUser}
        onOpenAccountModal={() => openAccountModal("profile")}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
      </div>

      {/* Shared Account & Settings Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        initialTab={accountTab}
        user={currentUser}
        onUserUpdated={setUserOverride}
      />
    </div>
  );
}
