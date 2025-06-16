
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
    <div className="">
      {/* Main Navigation Header */}
      <Header />
    </div>
  );
}
