import React from "react";
import { 
  LayoutDashboard, 
  Music, 
  Calendar, 
  FileText, 
  Mic, 
  Video, 
  Library, 
  MessageSquare, 
  Users, 
  UsersRound, 
  UserCog 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

interface SidebarNavProps {
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const adminNavItems = [
    {
      title: "User Management",
      href: "/dashboard/users",
      icon: UserCog,
    },
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      <NavLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
        Dashboard
      </NavLink>
      <NavLink href="/sheet-music" icon={<Music className="h-5 w-5" />}>
        Sheet Music
      </NavLink>
      <NavLink href="/calendar" icon={<Calendar className="h-5 w-5" />}>
        Calendar
      </NavLink>
      <NavLink href="/media-library" icon={<Library className="h-5 w-5" />}>
        Media Library
      </NavLink>
      <NavLink href="/recordings" icon={<Mic className="h-5 w-5" />}>
        Recordings
      </NavLink>
      <NavLink href="/profile" icon={<FileText className="h-5 w-5" />}>
        My Profile
      </NavLink>
      <NavLink href="/messaging" icon={<MessageSquare className="h-5 w-5" />}>
        Messaging
      </NavLink>
    </nav>
  );
};
