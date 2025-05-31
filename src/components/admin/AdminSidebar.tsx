
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminNavItems } from "@/components/layout/AdminNavItems";

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r p-4">
      <div className="py-2 mb-6">
        <h1 className="text-2xl font-bold text-center">Admin Panel</h1>
      </div>
      <nav className="space-y-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-accent/50 text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
              end={item.url === "/admin"}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto pt-4">
        <Button variant="outline" asChild className="w-full">
          <NavLink to="/">Back to Site</NavLink>
        </Button>
      </div>
    </aside>
  );
}
