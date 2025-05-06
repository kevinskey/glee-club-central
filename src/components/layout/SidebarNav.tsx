
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
  UserCog,
  Shield 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps {
  className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const { isAdmin } = useAuth();

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
      
      {/* Admin navigation section */}
      {isAdmin() && (
        <>
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admin Tools
            </h4>
            <NavLink href="/dashboard/users" icon={<UserCog className="h-5 w-5" />}>
              User Management
            </NavLink>
            <NavLink href="/dashboard/members" icon={<Users className="h-5 w-5" />}>
              Member Directory
            </NavLink>
            <NavLink href="/dashboard/sections" icon={<Shield className="h-5 w-5" />}>
              Section Management
            </NavLink>
            <NavLink href="/dashboard/invite-member" icon={<UsersRound className="h-5 w-5" />}>
              Invite Members
            </NavLink>
          </div>
        </>
      )}
    </nav>
  );
};
