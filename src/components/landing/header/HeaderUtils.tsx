
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { GleeToolsDropdown } from "@/components/glee-tools/GleeToolsDropdown";

export function HeaderUtils() {
  return (
    <>
      <GleeToolsDropdown />
      <ThemeToggle />
    </>
  );
}
