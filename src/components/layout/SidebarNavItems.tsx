
import React from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Music, 
  Headphones, 
  Settings,
  Users,
  Bell,
  Box,
  Shirt,
  CheckSquare,
  BookOpen,
  ShoppingBag
} from "lucide-react";

import { NavItem } from "@/components/layout/NavItem";

export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Sheet Music",
    href: "/dashboard/sheet-music",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Practice",
    href: "/dashboard/practice",
    icon: <Music className="h-5 w-5" />,
  },
  {
    title: "Recordings",
    href: "/dashboard/recordings",
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    title: "Setlists",
    href: "/dashboard/setlists", 
    icon: <Box className="h-5 w-5" />,
  },
  {
    title: "Wardrobe",
    href: "/dashboard/wardrobe-status",
    icon: <Shirt className="h-5 w-5" />,
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    title: "Handbook",
    href: "/dashboard/handbook",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Merch",
    href: "/dashboard/merch",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
];

export function SidebarNavItems({ 
  items 
}: { 
  items: { 
    title: string; 
    href: string; 
    icon: React.ReactNode 
  }[] 
}) {
  return (
    <div className="grid gap-1">
      {items.map((item, index) => (
        <NavItem
          key={index}
          href={item.href}
          title={item.title}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
