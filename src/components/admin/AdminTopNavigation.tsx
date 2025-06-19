import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  Image,
  Home,
  Music,
  Video,
  FileText,
  Megaphone,
  DollarSign,
  UserCog,
  Shield,
  Presentation,
  Package,
  LogOut,
  Bell,
  Menu
} from 'lucide-react';

const allNavigationItems = [
  { to: '/', icon: Home, label: 'Back to Site', section: 'core' },
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', section: 'core' },
  { to: '/admin/calendar', icon: Calendar, label: 'Calendar', section: 'core' },
  { to: '/admin/users', icon: Users, label: 'Members', section: 'users' },
  { to: '/admin/user-roles', icon: UserCog, label: 'User Roles', section: 'users' },
  { to: '/admin/permissions', icon: Shield, label: 'Permissions', section: 'users' },
  { to: '/admin/media-library', icon: Image, label: 'Media Library', section: 'content' },
  { to: '/admin/music', icon: Music, label: 'Music Player', section: 'content' },
  { to: '/admin/videos', icon: Video, label: 'Videos', section: 'content' },
  { to: '/admin/hero-slides', icon: Presentation, label: 'Hero Slides', section: 'content' },
  { to: '/admin/news-items', icon: Megaphone, label: 'News Items', section: 'content' },
  { to: '/admin/handbook', icon: FileText, label: 'Handbook', section: 'content' },
  { to: '/admin/financial', icon: DollarSign, label: 'Financial', section: 'business' },
  { to: '/admin/store', icon: ShoppingCart, label: 'Store Admin', section: 'business' },
  { to: '/admin/orders', icon: Package, label: 'Orders', section: 'business' },
  { to: '/admin/communications', icon: MessageSquare, label: 'Communications', section: 'business' },
  { to: '/admin/settings', icon: Settings, label: 'Settings', section: 'system' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', section: 'system' },
];

export const AdminTopNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActiveItem = (to: string) => {
    // Special case for root path - only highlight when exactly on root
    if (to === '/') {
      return location.pathname === '/';
    }
    // Special case for admin root - only highlight when exactly on /admin
    if (to === '/admin') {
      return location.pathname === '/admin';
    }
    // For other admin routes, check if current path starts with the route
    return location.pathname === to || location.pathname.startsWith(to);
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'core': return 'Core';
      case 'users': return 'User Management';
      case 'content': return 'Content Management';
      case 'business': return 'Business';
      case 'system': return 'System';
      default: return section;
    }
  };

  const groupedItems = allNavigationItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof allNavigationItems>);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-glee-spelman to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
          </div>
        </div>

        {/* Hamburger Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              {/* Notifications */}
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>3 New Messages</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Navigation - ordered sections: core, users, content, business, system */}
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              {['core', 'users', 'content', 'business', 'system'].map((section) => (
                <div key={section}>
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    {getSectionLabel(section)}
                  </DropdownMenuLabel>
                  {groupedItems[section]?.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem 
                        key={item.to}
                        onClick={() => navigate(item.to)}
                        className={isActiveItem(item.to) ? "bg-accent" : ""}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              ))}
              
              <DropdownMenuSeparator />
              
              {/* User Actions */}
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
