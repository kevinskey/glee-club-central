
import React from "react";
import { NavItem } from "@/components/layout/NavItem";
import {
  Home,
  Calendar,
  Music,
  FileMusic,
  ListMusic,
  User,
  Bell,
  BookOpen,
  DollarSign,
  Shirt,
  Users,
  MessageSquare,
  Headphones,
  FileVideo,
  FileImage,
  ClipboardCheck,
} from "lucide-react";

export const mainNavItems = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-5 w-5" />,
    external: true,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Sheet Music",
    href: "/dashboard/sheet-music",
    icon: <FileMusic className="h-5 w-5" />,
  },
  {
    title: "Setlists",
    href: "/dashboard/setlists",
    icon: <ListMusic className="h-5 w-5" />,
  },
  {
    title: "Recordings",
    href: "/dashboard/recordings",
    icon: <Music className="h-5 w-5" />,
  },
  {
    title: "Practice",
    href: "/dashboard/practice",
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    title: "Videos",
    href: "/dashboard/videos",
    icon: <FileVideo className="h-5 w-5" />,
  },
  {
    title: "Media Sources",
    href: "/dashboard/media-library",
    icon: <FileImage className="h-5 w-5" />,
  },
  {
    title: "Handbook",
    href: "/dashboard/handbook",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="h-5 w-5" />,
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
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    title: "Dues",
    href: "/dashboard/dues",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Wardrobe",
    href: "/dashboard/wardrobe",
    icon: <Shirt className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User className="h-5 w-5" />,
  },
];

export function SidebarNavItems({ items }: { items: typeof mainNavItems }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <NavItem
          key={item.href}
          title={item.title}
          href={item.href}
          icon={item.icon}
          external={item.external}
        />
      ))}
    </div>
  );
}
