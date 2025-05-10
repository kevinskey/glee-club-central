
import React from "react";
import { 
  Users, 
  Upload, 
  Calendar, 
  BarChart,
  Settings 
} from "lucide-react";
import { SidebarNavItems } from "@/components/layout/SidebarNavItems";

export const adminNavItems = [
  {
    title: "User Management",
    href: "/dashboard/admin/users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Media Manager",
    href: "/dashboard/admin/media",
    icon: <Upload className="h-4 w-4" />,
  },
  {
    title: "Event Manager",
    href: "/dashboard/admin/events",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "Site Settings",
    href: "/dashboard/admin/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

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
