
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { adminNavItems } from "@/components/layout/AdminNavItems";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/Icons";

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Icons.logo className="h-8 w-auto" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Glee Club</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              )}
              end={item.url === "/admin"}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {item.title === "Orders" && (
                <Badge variant="destructive" className="bg-red-500 text-white text-xs">
                  12
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
