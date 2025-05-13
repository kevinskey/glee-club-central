
import React from "react";
import { cn } from "@/lib/utils";
import { SidebarNavItems } from "@/components/layout/SidebarNavItems";
import { AdminNavItems } from "@/components/layout/AdminNavItems";
import { SidebarHelp } from "@/components/layout/SidebarHelp";

interface DesktopSidebarProps {
  isOpen: boolean;
  isAdmin: boolean;
}

export function DesktopSidebar({ isOpen, isAdmin }: DesktopSidebarProps) {
  return (
    <aside className={cn(
      "fixed left-0 top-0 z-30 h-screen w-64 border-r bg-background transition-transform lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col pb-12 pt-16">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Main Menu
          </h2>
          <SidebarNavItems />
          
          {isAdmin && <AdminNavItems />}
        </div>
        
        <SidebarHelp />
      </div>
    </aside>
  );
}
