
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
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
  
  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      exact: true
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar
    },
    {
      title: "Member Dashboard",
      href: "/dashboard/member",
      icon: User
    },
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
        
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant={isActiveRoute(item.href, item.exact) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActiveRoute(item.href, item.exact) && "bg-glee-spelman/10 text-glee-spelman"
            )}
            asChild
          >
            <Link to={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
        
        {(isAdminRole || isSuperAdmin) && (
          <>
            <div className="mb-4 mt-6">
              <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
                Admin
              </h3>
            </div>
            <Button
              variant={isActiveRoute("/dashboard/admin") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActiveRoute("/dashboard/admin") && "bg-glee-spelman/10 text-glee-spelman"
              )}
              asChild
            >
              <Link to="/dashboard/admin">
                <Settings className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
          </>
        )}
      </nav>
    </div>
  );
}
