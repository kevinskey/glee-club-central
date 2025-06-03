import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
  DollarSign,
  Music,
  Image,
  Newspaper,
  ShoppingCart,
  MapPin,
  FileText,
  Megaphone,
  Clock
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  description: string;
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview of your store",
  },
  {
    title: "Events Calendar",
    href: "/admin/events",
    icon: Calendar,
    description: "Manage events and rehearsals",
  },
  {
    title: "Members",
    href: "/admin/members",
    icon: Users,
    description: "Manage members and roles",
  },
  {
    title: "Finances",
    href: "/admin/finances",
    icon: DollarSign,
    description: "Track income and expenses",
  },
  {
    title: "Merch Store",
    href: "/admin/store",
    icon: ShoppingCart,
    description: "Manage products and sales",
  },
  {
    title: "News Ticker",
    href: "/admin/news",
    icon: Newspaper,
    description: "Manage scrolling news items",
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: Image,
    description: "Manage photos and albums",
  },
  {
    title: "Sponsors",
    href: "/admin/sponsors",
    icon: DollarSign,
    description: "Manage sponsors and donations",
  },
  {
    title: "Glee Planner",
    href: "/admin/glee-planner",
    icon: Clock,
    description: "Plan and organize events with smart modules"
  },
  {
    title: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Configure site-wide settings",
  },
];

export default adminNavItems;
