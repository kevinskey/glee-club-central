
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeaderUtils() {
  return (
    <>
      <ThemeToggle />
    </>
  );
}
