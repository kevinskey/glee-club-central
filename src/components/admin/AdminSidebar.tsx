
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  Upload,
  DollarSign,
  UserCog,
  Shield,
  Presentation,
  Package,
  ChevronDown,
  LogOut,
  Bell
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Back to Site' },
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/admin/users', icon: Users, label: 'Members' },
  { to: '/admin/user-roles', icon: UserCog, label: 'User Roles' },
  { to: '/admin/permissions', icon: Shield, label: 'Permissions' },
  { to: '/admin/financial', icon: DollarSign, label: 'Financial' },
  { to: '/admin/media-library', icon: Image, label: 'Media Library' },
  { to: '/admin/music', icon: Music, label: 'Music Player' },
  { to: '/admin/soundcloud', icon: Music, label: 'SoundCloud' },
  { to: '/admin/videos', icon: Video, label: 'Videos' },
  { to: '/admin/hero-slides', icon: Presentation, label: 'Hero Slides' },
  { to: '/admin/news-items', icon: Megaphone, label: 'News Items' },
  { to: '/admin/communications', icon: MessageSquare, label: 'Communications' },
  { to: '/admin/store', icon: ShoppingCart, label: 'Store Admin' },
  { to: '/admin/orders', icon: Package, label: 'Orders' },
  { to: '/admin/handbook', icon: FileText, label: 'Handbook' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminSidebar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <aside className="fixed left-0 top-0 z-30 w-64 h-screen bg-background border-r border-border overflow-y-auto flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-glee-spelman to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">GleeWorld</p>
          </div>
        </div>

        {/* User Info */}
        {profile && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || 'User'} />
              <AvatarFallback className="bg-glee-spelman text-white text-xs">
                {getInitials(profile?.first_name, profile?.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-glee-spelman text-white'
                      : 'text-foreground hover:bg-muted hover:text-glee-spelman'
                  )
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
          <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              <span>Account</span>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" forceMount>
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
    </aside>
  );
};
