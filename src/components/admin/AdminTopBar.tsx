
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search, Home, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  Image,
  Package,
  Palette,
  Music,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AdminTopBarProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

const navigationGroups = [
  {
    label: 'Dashboard',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
      { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ]
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
      { to: '/admin/media-library', icon: Image, label: 'Media Library' },
      { to: '/admin/music', icon: Music, label: 'Music Player' },
      { to: '/admin/communications', icon: MessageSquare, label: 'Communications' },
    ]
  },
  {
    label: 'Management',
    items: [
      { to: '/admin/users', icon: Users, label: 'Users' },
      { to: '/admin/store', icon: ShoppingCart, label: 'Store Admin' },
      { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    ]
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', icon: Settings, label: 'Settings' },
    ]
  }
];

export function AdminTopBar({ onMenuClick, isMobile = false }: AdminTopBarProps) {
  const { user, logout, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  const isActivePath = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 h-full">
      {/* Top Bar with improved spacing */}
      <div className="h-20 flex items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-12 w-12 p-0"
            title="Go to Public Homepage"
          >
            <Home className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-4 sm:gap-6">
            <Search className="h-6 w-6 text-gray-400" />
            <span className="text-base text-gray-500 dark:text-gray-400 hidden sm:inline">Search...</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative h-12 w-12 p-0"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || 'User'} />
                  <AvatarFallback className="bg-orange-500 text-white text-base">
                    {getInitials(profile?.first_name, profile?.last_name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-3">
                <p className="text-sm font-medium leading-none">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation with improved spacing */}
      {isMobile && (
        <div className="px-6 sm:px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-navy-900 dark:text-white">
              Admin Panel
            </h1>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-12 w-12 p-0">
                  <Menu className="h-7 w-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {navigationGroups.map((group, groupIndex) => (
                  <div key={group.label}>
                    <div className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.to, item.end);
                      return (
                        <DropdownMenuItem
                          key={item.to}
                          onClick={() => handleNavigate(item.to)}
                          className={cn(
                            "flex items-center gap-4 cursor-pointer ml-4 py-4",
                            isActive && "bg-glee-spelman text-white"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </DropdownMenuItem>
                      );
                    })}
                    {groupIndex < navigationGroups.length - 1 && <DropdownMenuSeparator />}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  );
}
