
import React from "react";
import { Header } from "@/components/landing/Header";
import { TopSlider } from "@/components/landing/TopSlider";

interface UnifiedPublicHeaderProps {
  showTopSlider?: boolean;
  className?: string;
}

export function UnifiedPublicHeader({ 
  showTopSlider = true, 
  className = "" 
}: UnifiedPublicHeaderProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Main Navigation Header */}
      <Header />
      
      {/* Top Slider - Admin managed banner */}
      {showTopSlider && <TopSlider />}
    </div>
  );
}
