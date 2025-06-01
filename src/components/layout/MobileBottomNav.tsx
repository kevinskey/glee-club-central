
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Music, 
  Bell, 
  User,
  Calendar,
  Settings
} from 'lucide-react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { profile } = useSimpleAuthContext();
  const { unreadCount } = useNotifications();
  
  // Check if user is admin
  const isAdmin = profile?.is_super_admin || profile?.role === 'admin';
  
  const isActiveRoute = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const navItems = [
    {
      title: "Home",
      href: "/dashboard/member",
      icon: Home,
      active: location.pathname === "/dashboard/member"
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: Calendar,
      active: location.pathname === "/calendar"
    },
    {
      title: "Music",
      href: "/dashboard/sheet-music",
      icon: Music,
      active: isActiveRoute("/dashboard/sheet-music")
    },
    {
      title: "Alerts",
      href: "/dashboard/announcements",
      icon: Bell,
      active: isActiveRoute("/dashboard/announcements"),
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      title: isAdmin ? "Admin" : "Profile",
      href: isAdmin ? "/admin" : "/dashboard/profile",
      icon: isAdmin ? Settings : User,
      active: isAdmin ? isActiveRoute("/admin") : isActiveRoute("/dashboard/profile")
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 text-xs transition-colors relative",
                item.active
                  ? "text-glee-spelman bg-glee-spelman/5"
                  : "text-gray-600 dark:text-gray-400 hover:text-glee-spelman"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
              {item.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
