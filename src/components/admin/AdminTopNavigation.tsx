
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
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
  ChevronDown,
  LogOut,
  Bell,
  Menu
} from 'lucide-react';

const allNavigationItems = [
  { to: '/', icon: Home, label: 'Back to Site', section: 'core' },
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', section: 'core' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', section: 'core' },
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
];

export const AdminTopNavigation: React.FC = () => {
  const { user, profile, logout } = useAuth();
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

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  const isActiveItem = (to: string) => {
    if (to === '/admin') {
      return location.pathname === '/admin';
    }
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

        {/* Unified Dropdown Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || 'User'} />
                  <AvatarFallback className="bg-glee-spelman text-white text-xs">
                    {getInitials(profile?.first_name, profile?.last_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block">
                  {profile?.first_name} {profile?.last_name}
                </span>
                <Menu className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              {/* User Info */}
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              
              {/* Notifications */}
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>3 New Messages</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Navigation */}
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              {Object.entries(groupedItems).map(([section, items]) => (
                <div key={section}>
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    {getSectionLabel(section)}
                  </DropdownMenuLabel>
                  {items.map((item) => {
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
