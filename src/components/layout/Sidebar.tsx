import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Music, 
  Bell, 
  FileText, 
  User,
  Users,
  Mic,
  Settings,
  Archive,
  ClipboardList
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const { isAdminRole, isSuperAdmin } = usePermissions();
  
  // Check if user is admin
  const isAdmin = profile?.is_super_admin || isAdminRole || isSuperAdmin;
  
  // Base menu items that all users can see
  const baseMenuItems = [
    {
      title: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: Music
    },
    {
      title: "Recordings",
      href: "/dashboard/recordings",
      icon: Mic
    },
    {
      title: "Recording Studio",
      href: "/dashboard/recording-studio",
      icon: Mic
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: Bell
    },
    {
      title: "Archives",
      href: "/dashboard/archives",
      icon: Archive
    },
    {
      title: "Attendance",
      href: "/dashboard/attendance",
      icon: ClipboardList
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User
    }
  ];

  // Admin-only menu items
  const adminMenuItems = [
    {
      title: "Members",
      href: "/dashboard/members",
      icon: Users
    },
    {
      title: "Admin Dashboard",
      href: "/dashboard/admin",
      icon: Settings
    }
  ];

  // Combine menu items based on role
  const menuItems = isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

  const isActiveRoute = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 z-40 hidden md:block",
      className
    )}>
      <nav className="space-y-2">
        <div className="mb-4">
          <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
            Navigation
          </h3>
        </div>
        
        {/* Dashboard link - everyone goes to member dashboard for simplicity */}
        <Button
          variant={isActiveRoute("/dashboard/member", true) ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            isActiveRoute("/dashboard/member", true) && "bg-glee-spelman/10 text-glee-spelman"
          )}
          asChild
        >
          <Link to="/dashboard/member">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        
        {/* Other menu items */}
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActiveRoute(item.href) && "bg-glee-spelman/10 text-glee-spelman"
            )}
            asChild
          >
            <Link to={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
