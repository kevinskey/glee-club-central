
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";

export function HeaderUtils() {
  return (
    <div className="flex items-center gap-2">
      <GleeToolsDropdown />
      <ThemeToggle />
    </div>
  );
}
