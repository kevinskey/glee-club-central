
import React from "react";
import { 
  LayoutDashboard,
  Users,
  DollarSign,
  Shirt,
  Gauge,
  Sliders
} from "lucide-react";
import { SidebarNavItems } from "@/components/layout/SidebarNavItems";

export const adminNavItems = [
  {
    title: "Admin Dashboard",
    href: "/dashboard/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Member Management",
    href: "/dashboard/admin/members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Finance Management",
    href: "/dashboard/admin/finances",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Wardrobe Management",
    href: "/dashboard/admin/wardrobe",
    icon: <Shirt className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: <Gauge className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: <Sliders className="h-5 w-5" />,
  },
];

export function AdminNavigation() {
  return (
    <>
      <h2 className="mb-2 mt-6 px-2 text-lg font-semibold tracking-tight">
        Admin
      </h2>
      <SidebarNavItems items={adminNavItems} />
    </>
  );
}
