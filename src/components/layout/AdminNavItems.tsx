
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Users, 
  Calendar, 
  Settings,
  Upload,
  BarChart3,
  ShoppingCart,
  Image
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { icon: Home, label: "Dashboard", href: "/admin" },
  { icon: Calendar, label: "Calendar", href: "/admin/calendar" },
  { icon: Users, label: "User Management", href: "/admin/user-management" },
  { icon: Upload, label: "Media Uploader", href: "/admin/media-uploader" },
  { icon: Image, label: "Hero Manager", href: "/admin/hero-manager" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminNavItems() {
  return (
    <nav className="space-y-1">
      {adminNavItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
