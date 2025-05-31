
import React from "react";
import { 
  Calendar, 
  Users, 
  Upload, 
  Image, 
  ShoppingBag, 
  Settings,
  BarChart3,
  UserCog
} from "lucide-react";

export const adminNavItems = [
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
    title: "Media Uploader",
    url: "/admin/media-uploader",
    icon: Upload,
  },
  {
    title: "Hero Manager",
    url: "/admin/hero-manager",
    icon: Image,
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
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export const adminIcons = {
  Calendar,
  Users,
  Upload,
  Image,
  ShoppingBag,
  Settings,
  BarChart3,
  UserCog,
};

export function AdminNavItems() {
  return null; // This is just for exporting the nav items data
}
