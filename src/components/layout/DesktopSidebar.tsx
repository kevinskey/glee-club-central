
import React from "react";
import { cn } from "@/lib/utils";
import { SidebarNavItems } from "@/components/layout/SidebarNavItems";
import { adminNavItems } from "@/components/layout/AdminNavItems";
import { SidebarHelp } from "@/components/layout/SidebarHelp";
import { NavItem } from "@/components/ui/nav-item";

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
          
          {isAdmin && (
            <div className="mt-6">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                Admin
              </h2>
              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavItem
                      key={item.url}
                      to={item.url}
                      label={item.title}
                      icon={Icon ? <Icon className="w-4 h-4" /> : undefined}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <SidebarHelp />
      </div>
    </aside>
  );
}
