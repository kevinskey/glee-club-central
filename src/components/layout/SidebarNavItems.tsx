
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Music, FileText, Mic2, Video, 
         BookOpen, Settings, Users, Shield } from 'lucide-react';
import { AdminNavigation } from './AdminNavItems';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { MemberManagementLink } from '@/components/dashboard/MemberManagementLink';

// Export the main nav items as an array for reuse
export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Sheet Music",
    href: "/dashboard/sheet-music",
    icon: <Music className="h-4 w-4" />,
  },
  {
    title: "Practice",
    href: "/dashboard/practice",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Recordings",
    href: "/dashboard/recordings",
    icon: <Mic2 className="h-4 w-4" />,
  },
  {
    title: "Videos",
    href: "/dashboard/videos",
    icon: <Video className="h-4 w-4" />,
  },
];

// Define the props interface for SidebarNavItems
interface SidebarNavItemsProps {
  items?: Array<{
    title: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

export function SidebarNavItems({ items }: SidebarNavItemsProps = {}) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { hasPermission } = usePermissions();
  const isUserAdmin = isAdmin && isAdmin();
  const canManageUsers = hasPermission('can_manage_users');

  if (!isAuthenticated) {
    return null;
  }

  // If items are provided, render them
  if (items) {
    return (
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    );
  }

  // Default rendering for when no items are provided
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
      {isUserAdmin && <AdminNavigation />}
    </nav>
  );
}
