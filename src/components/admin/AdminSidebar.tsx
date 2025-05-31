
import React from "react";
import { NavLink } from "react-router-dom";
import { Settings, Users, BarChart3, FileImage, LayoutDashboard, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/orders",
    },
    {
      title: "Media Library",
      icon: <FileImage className="h-5 w-5" />,
      href: "/admin/media",
    },
    {
      title: "Site Images",
      icon: <FileImage className="h-5 w-5" />,
      href: "/admin/site-images",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/analytics",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r p-4">
      <div className="py-2 mb-6">
        <h1 className="text-2xl font-bold text-center">Admin Panel</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-accent/50 text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
            end={item.href === "/admin"}
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-4">
        <Button variant="outline" asChild className="w-full">
          <NavLink to="/">Back to Site</NavLink>
        </Button>
      </div>
    </aside>
  );
}
