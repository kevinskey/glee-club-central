
import React from "react";
import { 
  Calendar, 
  Users, 
  User,
  Upload, 
  Image, 
  ShoppingBag, 
  Settings,
  BarChart3,
  UserCog,
  Tags,
  LayoutDashboard,
  Rss
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    url: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Members",
    url: "/admin/members",
    icon: Users,
  },
  {
    title: "User Management",
    url: "/admin/user-management",
    icon: UserCog,
  },
  {
    title: "Hero Manager",
    url: "/admin/hero-manager",
    icon: Image,
  },
  {
    title: "Media Manager",
    url: "/admin/media-uploader",
    icon: Upload,
  },
  {
    title: "News Ticker",
    url: "/admin/news-ticker",
    icon: Rss,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Fan Tags",
    url: "/admin/fan-tags",
    icon: Tags,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export const adminIcons = {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  Upload,
  Image,
  ShoppingBag,
  Settings,
  BarChart3,
  UserCog,
  Tags,
};

export function AdminNavItems() {
  return null; // This is just for exporting the nav items data
}
