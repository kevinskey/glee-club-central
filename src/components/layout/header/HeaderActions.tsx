
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
    </div>
  );
}
