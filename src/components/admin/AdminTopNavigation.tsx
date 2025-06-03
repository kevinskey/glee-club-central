
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
  ShoppingCart,
  Megaphone,
  Image,
  ImageIcon,
  Home,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      { to: '/admin/hero-manager', icon: ImageIcon, label: 'Hero Manager' },
      { to: '/admin/media-library', icon: Image, label: 'Media Library' },
      { to: '/admin/news-items', icon: Megaphone, label: 'News Items' },
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

export const AdminTopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Go to Public Homepage"
          >
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationGroups.map((group) => (
            <DropdownMenu key={group.label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {group.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.to, item.end);
                  return (
                    <DropdownMenuItem
                      key={item.to}
                      onClick={() => handleNavigate(item.to)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive && "bg-glee-spelman text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {navigationGroups.map((group, groupIndex) => (
                <div key={group.label}>
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
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
                          "flex items-center gap-2 cursor-pointer ml-2",
                          isActive && "bg-glee-spelman text-white"
                        )}
                      >
                        <Icon className="h-4 w-4" />
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
    </nav>
  );
};
