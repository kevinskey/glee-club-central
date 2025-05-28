
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FileMusic,
  Users,
  Bell,
  DollarSign,
  Settings,
  Mic,
  Home,
  Calendar,
  LayoutDashboard
} from 'lucide-react';
import { useRolePermissions } from '@/contexts/RolePermissionContext';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean;
}

export function DashboardNav({
  className,
  isCollapsed = false,
  ...props
}: DashboardNavProps) {
  const { pathname } = useLocation();
  const { hasPermission, userRole } = useRolePermissions();
  const { isAdmin, profile } = useAuth();
  const isAdminUser = profile?.is_super_admin || (isAdmin && isAdmin());
  
  // All buttons will use 'ghost' variant to remove highlights
  return (
    <nav className={cn('flex flex-col gap-2', className)} {...props}>
      {/* Dashboard link - goes to member dashboard for all users */}
      <Button
        variant="ghost"
        className={cn('justify-start', isCollapsed && 'justify-center')}
        asChild
      >
        <Link to="/dashboard/member">
          <Home className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
      </Button>

      <Button
        variant="ghost"
        className={cn('justify-start', isCollapsed && 'justify-center')}
        asChild
      >
        <Link to="/calendar">
          <Calendar className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Calendar</span>}
        </Link>
      </Button>

      <Button
        variant="ghost"
        className={cn('justify-start', isCollapsed && 'justify-center')}
        asChild
      >
        <Link to="/dashboard/sheet-music">
          <FileMusic className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Sheet Music</span>}
        </Link>
      </Button>

      <Button
        variant="ghost"
        className={cn('justify-start', isCollapsed && 'justify-center')}
        asChild
      >
        <Link to="/dashboard/announcements">
          <Bell className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Announcements</span>}
        </Link>
      </Button>

      {isAdminUser && (
        <>
          <Button
            variant="ghost"
            className={cn('justify-start', isCollapsed && 'justify-center')}
            asChild
          >
            <Link to="/admin">
              <LayoutDashboard className="h-5 w-5 mr-2" />
              {!isCollapsed && <span>Admin Dashboard</span>}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn('justify-start', isCollapsed && 'justify-center')}
            asChild
          >
            <Link to="/dashboard/finances">
              <DollarSign className="h-5 w-5 mr-2" />
              {!isCollapsed && <span>Finances</span>}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn('justify-start', isCollapsed && 'justify-center')}
            asChild
          >
            <Link to="/admin/calendar">
              <Calendar className="h-5 w-5 mr-2" />
              {!isCollapsed && <span>Admin Calendar</span>}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn('justify-start', isCollapsed && 'justify-center')}
            asChild
          >
            <Link to="/admin/members">
              <Users className="h-5 w-5 mr-2" />
              {!isCollapsed && <span>Member Management</span>}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn('justify-start', isCollapsed && 'justify-center')}
            asChild
          >
            <Link to="/admin/settings">
              <Settings className="h-5 w-5 mr-2" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </Button>
        </>
      )}
    </nav>
  );
}
