
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
  UserCog,
  Archive,
  Book,
  Mail,
  Package,
  List,
  Bell,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps {
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const { isAdmin, profile } = useAuth();
  
  // Debug the admin status
  const adminStatus = isAdmin ? isAdmin() : false;
  console.log("SidebarNav - Admin status:", adminStatus, "User role:", profile?.role);
  
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      <NavLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>
        Dashboard
      </NavLink>
      <NavLink href="/dashboard/calendar" icon={<Calendar className="h-5 w-5" />}>
        Calendar
      </NavLink>
      <NavLink href="/dashboard/profile" icon={<User className="h-5 w-5" />}>
        My Profile
      </NavLink>
      <NavLink href="/dashboard/member-directory" icon={<Users className="h-5 w-5" />}>
        Member Directory
      </NavLink>
      <NavLink href="/fan-page" icon={<Users className="h-5 w-5" />}>
        Fan Page
      </NavLink>
      <NavLink href="/dashboard/media-library" icon={<Archive className="h-5 w-5" />}>
        Media Library
      </NavLink>
      <NavLink href="/dashboard/sheet-music" icon={<Book className="h-5 w-5" />}>
        Sheet Music
      </NavLink>
      <NavLink href="/dashboard/messaging" icon={<Mail className="h-5 w-5" />}>
        Messaging
      </NavLink>
      <NavLink href="/dashboard/recordings" icon={<Mic className="h-5 w-5" />}>
        Recordings
      </NavLink>
      <NavLink href="/dashboard/practice" icon={<Music className="h-5 w-5" />}>
        Practice
      </NavLink>
      <NavLink href="/dashboard/audio-management" icon={<Library className="h-5 w-5" />}>
        Audio Management
      </NavLink>
      <NavLink href="/dashboard/videos" icon={<Video className="h-5 w-5" />}>
        Videos
      </NavLink>
      
      {/* Only show admin tools if the user is an admin */}
      {adminStatus && (
        <>
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admin Tools
            </h4>
            <NavLink href="/dashboard/member-management" icon={<UserCog className="h-5 w-5" />}>
              Member Management
            </NavLink>
            <NavLink href="/dashboard/invite-member" icon={<Bell className="h-5 w-5" />}>
              Invite Members
            </NavLink>
            <NavLink href="/dashboard/handbook" icon={<Book className="h-5 w-5" />}>
              Handbook
            </NavLink>
          </div>
        </>
      )}
    </nav>
  );
}
