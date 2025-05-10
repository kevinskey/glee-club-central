
import React from "react";
import { adminNavItems, SidebarNavItems } from "@/components/layout/SidebarNavItems";

export function AdminNavigation() {
  return (
    <div className="px-4 py-2">
      <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
        Admin Menu
      </h2>
      <SidebarNavItems items={adminNavItems} />
    </div>
  );
}
