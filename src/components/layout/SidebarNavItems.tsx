
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Music, 
  Calendar, 
  CheckSquare,
  Bell, 
  Users, 
  Upload, 
  BarChart,
  Settings,
  MessageSquare,
  FileText
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Sheet Music",
    href: "/dashboard/sheet-music",
    icon: <Music className="h-4 w-4" />,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    title: "Practice Resources",
    href: "/dashboard/practice",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Contact Admin",
    href: "/dashboard/contact",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

export const adminNavItems: NavItem[] = [
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

interface SidebarNavItemsProps {
  items: NavItem[];
}

export function SidebarNavItems({ items }: SidebarNavItemsProps) {
  const location = useLocation();
  
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
            location.pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent hover:text-accent-foreground transition-colors"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
