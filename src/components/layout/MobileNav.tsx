
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

interface MobileNavProps {
  isAdmin?: boolean;
}

export function MobileNav({ isAdmin: propIsAdmin }: MobileNavProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const { isSuperAdmin } = usePermissions();
  
  // Check if user is admin
  const isAdmin = profile?.is_super_admin || isSuperAdmin || propIsAdmin;
  
  // Base navigation items
  const baseNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/member",
      icon: Home
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User
    },
    {
      title: "Music",
      href: "/dashboard/sheet-music",
      icon: Music
    },
    {
      title: "Studio",
      href: "/dashboard/recording-studio",
      icon: Mic
    }
  ];

  // Admin navigation items
  const adminNavItems = [
    {
      title: "Admin",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      title: "Calendar",
      href: "/admin/calendar",
      icon: Calendar
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: Users
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ];

  // Show admin items if user is admin
  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  const isActive = (href: string) => {
    if (href === "/dashboard/member") {
      return location.pathname === href || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 text-xs",
              isActive(item.href)
                ? "text-glee-spelman"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="truncate max-w-[60px]">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
