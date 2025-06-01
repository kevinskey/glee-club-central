
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Home, 
  Calendar, 
  Music, 
  Bell, 
  User,
  Users,
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  adminOnly?: boolean;
}

export function MobileBottomNav() {
  const { user, isAdmin } = useSimpleAuthContext();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  if (!user) return null;

  const navItems: NavItem[] = [
    { to: '/dashboard/member', icon: Home, label: 'Home' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/dashboard/sheet-music', icon: Music, label: 'Music' },
    { to: '/dashboard/announcements', icon: Bell, label: 'Alerts' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  // Add admin-specific items if user is admin
  if (isAdmin && isAdmin()) {
    navItems.splice(1, 0, { to: '/admin', icon: Users, label: 'Admin', adminOnly: true });
    navItems.push({ to: '/settings', icon: Settings, label: 'Settings', adminOnly: true });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 lg:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
                          (item.to === '/dashboard/member' && location.pathname.startsWith('/dashboard'));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center p-2 text-xs transition-colors ${
                isActive 
                  ? 'text-glee-spelman' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-glee-spelman'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-1" />
                {item.label === 'Alerts' && unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center p-0"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
