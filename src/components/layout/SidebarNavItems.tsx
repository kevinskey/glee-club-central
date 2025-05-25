
import React from 'react';
import { useRolePermissions } from '@/contexts/RolePermissionContext';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { useLocation } from 'react-router-dom';

import {
  CalendarDays,
  FileText,
  Home,
  Music,
  Bell,
  Archive,
  ClipboardCheck,
  Users,
  FileAudio,
  Settings,
  Mic,
} from 'lucide-react';

export function SidebarNavItems() {
  const location = useLocation();
  const { hasPermission, userRole } = useRolePermissions();
  const { totalCount } = useMediaLibrary();

  // Check if route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Only show admin items for admin users
  const showAdminItems = userRole === 'admin';
  
  // Check if we're on any members-related page
  const isOnMembersPage = location.pathname.includes('/members');

  return (
    <>
      <div className="px-3 py-2">
        {/* Single Dashboard link for everyone - points to member dashboard */}
        <a href="/dashboard/member" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/member') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <Home className="h-4 w-4" />
          Dashboard
        </a>
        
        {/* Recording Studio highlight for all users */}
        <a href="/dashboard/recording-studio" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mt-2 ${isActive('/dashboard/recording-studio') ? 'bg-glee-spelman text-white' : 'bg-glee-spelman/10 text-glee-spelman hover:bg-glee-spelman/20'}`}>
          <Mic className="h-4 w-4" />
          Recording Studio
        </a>
      </div>
      
      <div className="px-3 py-2">
        <h3 className="mb-2 px-4 text-xs font-medium">Menu</h3>
        <a href="/dashboard/calendar" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/calendar') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <CalendarDays className="h-4 w-4" />
          Calendar
        </a>
        
        <a href="/dashboard/sheet-music" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/sheet-music') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <FileText className="h-4 w-4" />
          Sheet Music
        </a>
        <a href="/dashboard/recordings" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/recordings') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <FileAudio className="h-4 w-4" />
          Recordings
        </a>
        
        <a href="/dashboard/announcements" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/announcements') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <Bell className="h-4 w-4" />
          Announcements
        </a>
        
        <a href="/dashboard/media-library" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/media-library') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <Music className="h-4 w-4" />
          Media Library
          {totalCount > 0 && (
            <span className="ml-auto bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              {totalCount}
            </span>
          )}
        </a>
        
        <a href="/dashboard/archives" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/archives') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <Archive className="h-4 w-4" />
          Archives
        </a>
        
        <a href="/dashboard/attendance" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/dashboard/attendance') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <ClipboardCheck className="h-4 w-4" />
          Attendance
        </a>
        
        {/* Admin Settings - only show for admin users */}
        {showAdminItems && (
          <a href="/admin/settings" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${isActive('/admin/settings') ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
            <Settings className="h-4 w-4" />
            Settings
          </a>
        )}
      </div>
    </>
  );
}
