
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
  Bell
} from 'lucide-react';

const navigationSections = {
  core: [
    { to: '/', icon: Home, label: 'Back to Site' },
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  ],
  users: [
    { to: '/admin/users', icon: Users, label: 'Members' },
    { to: '/admin/user-roles', icon: UserCog, label: 'User Roles' },
    { to: '/admin/permissions', icon: Shield, label: 'Permissions' },
  ],
  content: [
    { to: '/admin/media-library', icon: Image, label: 'Media Library' },
    { to: '/admin/music', icon: Music, label: 'Music Player' },
    { to: '/admin/videos', icon: Video, label: 'Videos' },
    { to: '/admin/hero-slides', icon: Presentation, label: 'Hero Slides' },
    { to: '/admin/news-items', icon: Megaphone, label: 'News Items' },
    { to: '/admin/handbook', icon: FileText, label: 'Handbook' },
  ],
  business: [
    { to: '/admin/financial', icon: DollarSign, label: 'Financial' },
    { to: '/admin/store', icon: ShoppingCart, label: 'Store Admin' },
    { to: '/admin/orders', icon: Package, label: 'Orders' },
    { to: '/admin/communications', icon: MessageSquare, label: 'Communications' },
  ],
  system: [
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ]
};

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

  const isActiveSection = (items: typeof navigationSections.core) => {
    return items.some(item => location.pathname === item.to || 
      (item.to !== '/admin' && location.pathname.startsWith(item.to)));
  };

  const isActiveItem = (to: string) => {
    if (to === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === to || location.pathname.startsWith(to);
  };

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

        {/* Navigation Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Core Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isActiveSection(navigationSections.core) ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Core
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {navigationSections.core.map((item) => {
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
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Users Management */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isActiveSection(navigationSections.users) ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Users
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {navigationSections.users.map((item) => {
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
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Content Management */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isActiveSection(navigationSections.content) ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Image className="h-4 w-4" />
                Content
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {navigationSections.content.map((item) => {
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
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Business Management */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isActiveSection(navigationSections.business) ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Business
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {navigationSections.business.map((item) => {
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
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isActiveSection(navigationSections.system) ? "default" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                System
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {navigationSections.system.map((item) => {
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || 'User'} />
                  <AvatarFallback className="bg-glee-spelman text-white text-xs">
                    {getInitials(profile?.first_name, profile?.last_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block">
                  {profile?.first_name} {profile?.last_name}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
