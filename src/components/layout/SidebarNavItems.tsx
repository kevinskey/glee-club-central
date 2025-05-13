
import React from "react";
import { NavLink } from "./NavLink";
import {
  Home,
  CalendarDays,
  Music,
  Users,
  User,
  FileText,
  Clock,
  ImageIcon,
  ListMusic,
  Mic,
  BookOpen
} from "lucide-react";

// Define and export the main navigation items array
export const mainNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: <Home /> },
  { title: "Calendar", href: "/dashboard/calendar", icon: <CalendarDays /> },
  { title: "Music", href: "/dashboard/music", icon: <Music /> },
  { title: "Sheet Music", href: "/dashboard/sheet-music", icon: <FileText /> },
  { title: "Setlists", href: "/dashboard/setlists", icon: <ListMusic /> },
  { title: "Recordings", href: "/dashboard/recordings", icon: <Mic /> },
  { title: "Attendance", href: "/dashboard/attendance", icon: <Clock /> },
  { title: "Members", href: "/dashboard/members", icon: <Users /> },
  { title: "Media", href: "/dashboard/media", icon: <ImageIcon /> },
  { title: "My Profile", href: "/dashboard/profile", icon: <User /> },
  { title: "Resources", href: "/dashboard/resources", icon: <BookOpen /> }
];

export const SidebarNavItems = () => {
  return (
    <div className="space-y-1">
      {mainNavItems.map((item) => (
        <NavLink key={item.href} href={item.href} icon={item.icon}>
          {item.title}
        </NavLink>
      ))}
    </div>
  );
};
