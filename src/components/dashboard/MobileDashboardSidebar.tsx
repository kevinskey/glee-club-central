
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
  Home,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiredTags?: string[];
}

interface MobileDashboardSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDashboardSidebar({ open, onOpenChange }: MobileDashboardSidebarProps) {
  const { user, profile } = useAuth();
  const roleTags = profile?.role_tags || [];
  
  const generalNavItems: NavItem[] = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/sheet-music', icon: Music, label: 'Sheet Music' },
    { to: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/dashboard/members', icon: Users, label: 'Members' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ];

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

  const adminNavItems: NavItem[] = [
    { 
      to: '/admin', 
      icon: Shield, 
      label: 'Admin Dashboard', 
      requiredTags: []
    },
  ];

  const hasRequiredTag = (requiredTags?: string[]) => {
    if (!requiredTags || requiredTags.length === 0) return true;
    return requiredTags.some(tag => roleTags.includes(tag));
  };

  const isAdmin = profile?.is_super_admin || profile?.role === 'admin';
  const visibleExecItems = execNavItems.filter(item => hasRequiredTag(item.requiredTags));
  const hasExecRoles = visibleExecItems.length > 0;

  const handleNavClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Glee Dashboard
                </h2>
                {profile && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {profile.first_name} {profile.last_name}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-4">
              {/* General Navigation */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  General
                </h3>
                <div className="space-y-1">
                  {generalNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors',
                            isActive
                              ? 'bg-glee-spelman text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          )
                        }
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Executive Board Navigation */}
              {hasExecRoles && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Executive Board
                  </h3>
                  <div className="space-y-1">
                    {visibleExecItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors',
                              isActive
                                ? 'bg-glee-spelman text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            )
                          }
                        >
                          <Icon className="mr-2 h-4 w-4" />
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
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Administration
                  </h3>
                  <div className="space-y-1">
                    {adminNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-colors',
                              isActive
                                ? 'bg-glee-spelman text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            )
                          }
                        >
                          <Icon className="mr-2 h-4 w-4" />
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
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {roleTags.length > 0 && (
                <div>
                  <span className="font-medium">Roles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {roleTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Export trigger button component
export function MobileDashboardSidebarTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onOpen}
      className="md:hidden h-6 w-6"
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
}
