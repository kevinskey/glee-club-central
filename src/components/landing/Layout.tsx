
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

// Named export for backward compatibility
export { Layout };
