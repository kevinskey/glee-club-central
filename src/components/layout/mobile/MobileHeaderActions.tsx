
import React from "react";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";
import { MobileNavDropdown } from "./MobileNavDropdown";
import { useAuth } from "@/contexts/AuthContext";

interface MobileHeaderActionsProps {
  onMenuClick: () => void;
}

export function MobileHeaderActions({ onMenuClick }: MobileHeaderActionsProps) {
  const { isAdmin } = useAuth();
  const isAdminUser = isAdmin && isAdmin();

  return (
    <div className="flex items-center gap-2">
      <GleeToolsDropdown />
      {/* Only show nav dropdown for non-admin users on mobile */}
      {!isAdminUser && <MobileNavDropdown />}
    </div>
  );
}
