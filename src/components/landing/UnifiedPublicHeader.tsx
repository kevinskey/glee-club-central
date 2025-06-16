
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
    <div className="py-8">
      {/* Main Navigation Header */}
      <Header />
    </div>
  );
}
