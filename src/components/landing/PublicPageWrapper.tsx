
import React from "react";
import { UnifiedPublicHeader } from "./UnifiedPublicHeader";

interface PublicPageWrapperProps {
  children: React.ReactNode;
  showTopSlider?: boolean;
  className?: string;
  contentClassName?: string;
}

export function PublicPageWrapper({ 
  children, 
  showTopSlider = true,
  className = "",
  contentClassName = ""
}: PublicPageWrapperProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <UnifiedPublicHeader showTopSlider={showTopSlider} />
      <main className={`w-full ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
}
