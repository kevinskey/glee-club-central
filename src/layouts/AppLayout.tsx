
import React from "react";
import { UniversalHeader } from "@/components/layout/UniversalHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader />
      <main>
        {children}
      </main>
    </div>
  );
}
