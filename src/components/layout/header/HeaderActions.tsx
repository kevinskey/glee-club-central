
import React from "react";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <GleeToolsDropdown />
    </div>
  );
}
