
import React from "react";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "./Header";
import { SidebarNav } from "./SidebarNav";

export const DashboardLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container flex flex-1 gap-4 md:gap-8 pt-4 md:pt-6">
        {!isMobile && (
          <aside className="hidden w-56 md:w-64 shrink-0 md:block">
            <SidebarNav className="sticky top-20" />
          </aside>
        )}
        <main className="flex-1 pb-12 md:pb-16 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
