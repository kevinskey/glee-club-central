
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Music, 
  Bell, 
  User,
  Users,
  Mic,
  Settings,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import { useSimpleAuthContext } from "@/contexts/SimpleAuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useNotifications } from "@/hooks/useNotifications";

interface MobileNavProps {
  isAdmin?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string | null;
}

export function MobileNav({ isAdmin: propIsAdmin }: MobileNavProps) {
  const location = useLocation();
  const { profile } = useSimpleAuthContext();
  const { isSuperAdmin } = usePermissions();
  const { unreadCount } = useNotifications();
  
  // Check if user is admin
  const isAdmin = profile?.is_super_admin || isSuperAdmin || propIsAdmin;
  
  // Base navigation items - most frequently used
  const baseNavItems: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard/member",
      icon: Home
    },
    {
      title: "Music",
      href: "/dashboard/sheet-music",
      icon: Music
    },
    {
      title: "Alerts",
      href: "/dashboard/announcements",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User
    }
  ];

  // Admin gets admin-focused bottom nav
  const adminNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard/member",
      icon: Home
    },
    {
      title: "Admin",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: Users
    },
    {
      title: "Calendar",
      href: "/admin/calendar",
      icon: Calendar
    }
  ];

  // Show different nav based on role
  const navItems = isAdmin ? adminNavItems : baseNavItems;

  const isActive = (href: string) => {
    if (href === "/dashboard/member") {
      return location.pathname === href || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 text-xs min-w-0 flex-1 relative",
              isActive(item.href)
                ? "text-glee-spelman font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5 mb-1" />
              {item.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="truncate max-w-[60px]">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
