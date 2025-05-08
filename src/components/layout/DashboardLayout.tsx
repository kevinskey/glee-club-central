
import React from "react";
import { Header } from "@/components/layout/Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
