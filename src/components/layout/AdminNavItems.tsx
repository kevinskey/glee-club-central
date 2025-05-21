import {
  LayoutDashboard,
  Settings,
  ImagePlus,
  Users,
  Calendar,
  Megaphone,
} from "lucide-react";

export const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "layoutDashboard",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: "users",
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: "imagePlus",
  },
  {
    title: "Calendar",
    href: "/admin/calendar",
    icon: "calendar",
  },
  {
    title: "Landing Page",
    href: "/admin/landing-page",
    icon: "settings",
  },
  {
    title: "News Ticker",
    href: "/admin/news",
    icon: "megaphone", // Or any appropriate icon
  },
];

export const adminIcons = {
  layoutDashboard: LayoutDashboard,
  settings: Settings,
  imagePlus: ImagePlus,
  users: Users,
  calendar: Calendar,
  megaphone: Megaphone,
};
