
import React from "react";
import { UnifiedPublicHeader } from "./UnifiedPublicHeader";
import { OptimizedNewsTicker } from "./news/OptimizedNewsTicker";
import { Footer } from "./Footer";

interface PublicPageWrapperProps {
  children: React.ReactNode;
  showTopSlider?: boolean;
  className?: string;
}

export function PublicPageWrapper({ 
  children, 
  showTopSlider = true, 
  className = "" 
}: PublicPageWrapperProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {showTopSlider && <OptimizedNewsTicker autoHide={false} />}
      <UnifiedPublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
