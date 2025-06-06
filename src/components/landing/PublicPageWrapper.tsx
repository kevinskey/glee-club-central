
import React from "react";

interface PublicPageWrapperProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PublicPageWrapper({ 
  children, 
  className = "",
  contentClassName = ""
}: PublicPageWrapperProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <main className={`w-full ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
}
