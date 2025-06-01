
import React from "react";
import { MobileNavDropdown } from "./MobileNavDropdown";
import { useProfile } from "@/contexts/ProfileContext";

interface MobileHeaderActionsProps {
  onMenuClick: () => void;
}

export function MobileHeaderActions({ onMenuClick }: MobileHeaderActionsProps) {
  const { isAdmin } = useProfile();
  const isAdminUser = isAdmin();

  return (
    <div className="flex items-center gap-2">
      {/* Only show nav dropdown for non-admin users on mobile */}
      {!isAdminUser && <MobileNavDropdown />}
    </div>
  );
}
