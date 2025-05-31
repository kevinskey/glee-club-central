
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
    <aside className="hidden md:flex flex-col w-64 border-r bg-white shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-glee-spelman/10 rounded-lg">
            <div className="w-6 h-6 bg-glee-spelman rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Glee Club Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {adminNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.url || 
            (item.url === "/admin" && location.pathname === "/admin");
          
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-glee-spelman text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              end={item.url === "/admin"}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.title}</span>
              {item.title === "Orders" && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                  12
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Button variant="outline" asChild className="w-full justify-start">
          <NavLink to="/dashboard/member">
            <Home className="h-4 w-4 mr-2" />
            Member Dashboard
          </NavLink>
        </Button>
        <Button variant="ghost" asChild className="w-full justify-start text-gray-500">
          <NavLink to="/">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Site
          </NavLink>
        </Button>
      </div>
    </aside>
  );
}
