import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Music, FileText, Mic2, Video, 
         BookOpen, Settings, Users, Shield } from 'lucide-react';
import { AdminNavItems } from './AdminNavItems';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { MemberManagementLink } from '@/components/dashboard/MemberManagementLink';

export function SidebarNavItems() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { hasPermission } = usePermissions();
  const isUserAdmin = isAdmin && isAdmin();
  const canManageUsers = hasPermission('can_manage_users');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="space-y-1">
      {/* Main Navigation */}
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <Home className="h-4 w-4 mr-2" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/calendar"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <Calendar className="h-4 w-4 mr-2" />
        <span>Calendar</span>
      </NavLink>

      {/* Member Management Link for Users with Permission */}
      <MemberManagementLink />
      
      {/* Admin Navigation */}
      {isUserAdmin && <AdminNavItems />}
    </nav>
  );
}
