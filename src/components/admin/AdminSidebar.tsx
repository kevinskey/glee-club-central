
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/components/layout/AdminNavItems";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, ChevronLeft } from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg transition-colors duration-200">
            <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Glee Club Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.url || 
            (item.url === "/admin" && location.pathname === "/admin");
          
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              )}
              end={item.url === "/admin"}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "scale-110" : "group-hover:scale-105"
              )} />
              <span className="flex-1">{item.title}</span>
              {item.title === "Orders" && (
                <Badge variant="destructive" className="bg-red-500 text-white text-xs animate-pulse">
                  12
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Button variant="outline" asChild className="w-full justify-start hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-200">
          <NavLink to="/dashboard/member">
            <Home className="h-4 w-4 mr-2" />
            Member Dashboard
          </NavLink>
        </Button>
        <Button variant="ghost" asChild className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
          <NavLink to="/">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Site
          </NavLink>
        </Button>
      </div>
    </aside>
  );
}
