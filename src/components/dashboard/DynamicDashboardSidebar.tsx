
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Music,
  FileText,
  Settings,
  DollarSign,
  Camera,
  Megaphone,
  BookOpen,
  Crown,
  Shield,
  Star,
  Home
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiredTags?: string[];
}

export function DynamicDashboardSidebar() {
  const { user, profile } = useAuth();
  const roleTags = profile?.role_tags || [];
  
  // General navigation items (always visible)
  const generalNavItems: NavItem[] = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/sheet-music', icon: Music, label: 'Sheet Music' },
    { to: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/dashboard/members', icon: Users, label: 'Members' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ];

  // Executive Board navigation items (role-based)
  const execNavItems: NavItem[] = [
    { 
      to: '/exec/president', 
      icon: Crown, 
      label: 'President Tools', 
      requiredTags: ['President'] 
    },
    { 
      to: '/exec/treasurer', 
      icon: DollarSign, 
      label: 'Budget & Dues', 
      requiredTags: ['Treasurer'] 
    },
    { 
      to: '/exec/historian', 
      icon: Camera, 
      label: 'Photo Archive', 
      requiredTags: ['Historian'] 
    },
    { 
      to: '/exec/secretary', 
      icon: FileText, 
      label: 'Meeting Notes', 
      requiredTags: ['Secretary'] 
    },
    { 
      to: '/exec/social-chair', 
      icon: Star, 
      label: 'Social Events', 
      requiredTags: ['Social Chair'] 
    },
    { 
      to: '/exec/librarian', 
      icon: BookOpen, 
      label: 'Music Library', 
      requiredTags: ['Librarian'] 
    },
    { 
      to: '/admin/announcements', 
      icon: Megaphone, 
      label: 'Announcements', 
      requiredTags: ['President', 'Secretary'] 
    },
    { 
      to: '/admin/handbook', 
      icon: BookOpen, 
      label: 'Handbook Editor', 
      requiredTags: ['President', 'Secretary'] 
    },
    { 
      to: '/exec/calendar', 
      icon: Calendar, 
      label: 'Exec Calendar', 
      requiredTags: ['President', 'Secretary', 'Treasurer'] 
    },
  ];

  // Admin navigation items (for super admins)
  const adminNavItems: NavItem[] = [
    { 
      to: '/admin', 
      icon: Shield, 
      label: 'Admin Dashboard', 
      requiredTags: [] // Will be handled by admin check
    },
  ];

  // Check if user has any of the required tags
  const hasRequiredTag = (requiredTags?: string[]) => {
    if (!requiredTags || requiredTags.length === 0) return true;
    return requiredTags.some(tag => roleTags.includes(tag));
  };

  // Check if user is admin
  const isAdmin = profile?.is_super_admin || profile?.role === 'admin';

  // Filter exec items based on role tags
  const visibleExecItems = execNavItems.filter(item => hasRequiredTag(item.requiredTags));

  // Check if user has any exec roles
  const hasExecRoles = visibleExecItems.length > 0;

  return (
    <aside className="fixed left-0 top-0 z-30 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Glee Dashboard
          </h2>
          {profile && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profile.first_name} {profile.last_name}
            </p>
          )}
        </div>

        <nav className="space-y-6">
          {/* General Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              General
            </h3>
            <div className="space-y-1">
              {generalNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-glee-spelman text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )
                    }
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Executive Board Navigation */}
          {hasExecRoles && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Executive Board
              </h3>
              <div className="space-y-1">
                {visibleExecItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-glee-spelman text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )
                      }
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Administration
              </h3>
              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-glee-spelman text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )
                      }
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* User Info Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {roleTags.length > 0 && (
            <div>
              <span className="font-medium">Roles:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {roleTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
