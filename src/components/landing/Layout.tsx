
import React from "react";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
  showThemeToggle?: boolean;
}

export default function Layout({ children, showThemeToggle = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {children}
      {showThemeToggle && (
        <FloatingThemeToggle position="bottom-right" />
      )}
    </div>
  );
}

// Named export for backward compatibility
export { Layout };
