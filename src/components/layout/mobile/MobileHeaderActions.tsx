
import React from "react";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";

interface MobileHeaderActionsProps {
  onMenuClick: () => void;
}

export function MobileHeaderActions({ onMenuClick }: MobileHeaderActionsProps) {
  return (
    <div className="flex items-center">
      <GleeToolsDropdown />
    </div>
  );
}
