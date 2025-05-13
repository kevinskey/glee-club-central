
import React from "react";
import { NavItem } from "./NavItem";
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

export const SidebarNavItems = () => {
  return (
    <div className="space-y-1">
      <NavItem icon={<Home />} href="/dashboard">
        Dashboard
      </NavItem>
      <NavItem icon={<CalendarDays />} href="/dashboard/calendar">
        Calendar
      </NavItem>
      <NavItem icon={<Music />} href="/dashboard/music">
        Music
      </NavItem>
      <NavItem icon={<FileText />} href="/dashboard/sheet-music">
        Sheet Music
      </NavItem>
      <NavItem icon={<ListMusic />} href="/dashboard/setlists">
        Setlists
      </NavItem>
      <NavItem icon={<Mic />} href="/dashboard/recordings">
        Recordings
      </NavItem>
      <NavItem icon={<Clock />} href="/dashboard/attendance">
        Attendance
      </NavItem>
      <NavItem icon={<Users />} href="/dashboard/members">
        Members
      </NavItem>
      <NavItem icon={<ImageIcon />} href="/dashboard/media">
        Media
      </NavItem>
      <NavItem icon={<User />} href="/dashboard/profile">
        My Profile
      </NavItem>
      <NavItem icon={<BookOpen />} href="/dashboard/resources">
        Resources
      </NavItem>
    </div>
  );
};
