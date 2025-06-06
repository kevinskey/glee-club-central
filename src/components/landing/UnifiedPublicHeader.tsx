
import React from "react";
import { Header } from "@/components/landing/Header";

interface UnifiedPublicHeaderProps {
  showTopSlider?: boolean;
  className?: string;
}

export function UnifiedPublicHeader({ 
  showTopSlider = true, 
  className = "" 
}: UnifiedPublicHeaderProps) {
  return (
    <>
      {/* Main Navigation Header */}
      <Header />
    </>
  );
}
