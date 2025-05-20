
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { GleeTools } from "@/components/glee-tools/GleeTools";

export function HeaderUtils() {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* GleeTools component that handles both pitch pipe and metronome */}
      <GleeTools />
      
      <ThemeToggle />
    </>
  );
}
