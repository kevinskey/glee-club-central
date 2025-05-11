
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileMusic,
  Users,
  Bell,
  DollarSign,
  Settings,
  Mic
} from 'lucide-react';
import { useRolePermissions } from '@/contexts/RolePermissionContext';

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean;
}

export function DashboardNav({
  className,
  isCollapsed = false,
  ...props
}: DashboardNavProps) {
  const { pathname } = useLocation();
  const { hasPermission } = useRolePermissions();
  
  return (
    <nav className={cn('flex flex-col gap-2', className)} {...props}>
      <Button
        variant={pathname === '/dashboard' ? 'default' : 'ghost'}
        className={cn('justify-start', isCollapsed && 'justify-center')}
        asChild
      >
        <Link to="/dashboard">
          <Mic className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
      </Button>

      {hasPermission('view_sheet_music') && (
        <Button
          variant={pathname.includes('/dashboard/sheet-music') ? 'default' : 'ghost'}
          className={cn('justify-start', isCollapsed && 'justify-center')}
          asChild
        >
          <Link to="/dashboard/sheet-music">
            <FileMusic className="h-5 w-5 mr-2" />
            {!isCollapsed && <span>Sheet Music</span>}
          </Link>
        </Button>
      )}

      {hasPermission('view_calendar') && (
        <Button
          variant={pathname.includes('/dashboard/calendar') ? 'default' : 'ghost'}
          className={cn('justify-start', isCollapsed && 'justify-center')}
          asChild
        >
          <Link to="/dashboard/calendar">
            <Calendar className="h-5 w-5 mr-2" />
            {!isCollapsed && <span>Calendar</span>}
          </Link>
        </Button>
      )}

      {hasPermission('view_announcements') && (
        <Button
          variant={pathname.includes('/dashboard/announcements') ? 'default' : 'ghost'}
          className={cn('justify-start', isCollapsed && 'justify-center')}
          asChild
        >
          <Link to="/dashboard/announcements">
            <Bell className="h-5 w-5 mr-2" />
            {!isCollapsed && <span>Announcements</span>}
          </Link>
        </Button>
      )}

      {hasPermission('view_financials') && (
        <Button
          variant={pathname.includes('/dashboard/finances') ? 'default' : 'ghost'}
          className={cn('justify-start', isCollapsed && 'justify-center')}
          asChild
        >
          <Link to="/dashboard/finances">
            <DollarSign className="h-5 w-5 mr-2" />
            {!isCollapsed && <span>Finances</span>}
          </Link>
        </Button>
      )}

      {hasPermission('manage_users') && (
        <Button
          variant={pathname.includes('/dashboard/admin/members') ? 'default' : 'ghost'}
          className={cn('justify-start', isCollapsed && 'justify-center')}
          asChild
        >
          <Link to="/dashboard/admin/members">
            <Users className="h-5 w-5 mr-2" />
            {!isCollapsed && <span>Member Management</span>}
          </Link>
        </Button>
      )}

      {hasPermission('manage_users') && (
        <Button
          variant={pathname.includes('/dashboard/settings') ? 'default' : 'ghost'}
          className={cn('justify-start', isCollapsed && 'justify-center')}
          asChild
        >
          <Link to="/dashboard/settings">
            <Settings className="h-5 w-5 mr-2" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </Button>
      )}
    </nav>
  );
}
