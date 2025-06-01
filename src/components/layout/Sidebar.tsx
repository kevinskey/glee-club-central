import React from 'react';
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Music, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Headphones, 
  BookOpen,
  Bell,
  User,
  LogOut,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const { profile, isAdmin } = usePermissions();
  const location = useLocation();

  const navigation = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: Music,
    },
    {
      name: "Recordings",
      href: "/dashboard/recordings",
      icon: Headphones,
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      name: "Announcements",
      href: "/dashboard/announcements",
      icon: Bell,
    },
    {
      name: "Attendance",
      href: "/dashboard/attendance",
      icon: FileText,
    },
  ];

  const adminNavigation = [
    {
      name: "Admin",
      href: "/admin",
      icon: Shield,
    },
    {
      name: "Members",
      href: "/admin/members",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const logoutNavigation = [
    {
      name: "Logout",
      href: "/",
      icon: LogOut,
    },
  ];

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <MusicIcon className="h-6 w-6" />
            <span>Glee Club</span>
          </Link>
        </div>
        <Separator />
        <div className="px-3">
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary hover:text-foreground",
                    location.pathname === item.href ? "bg-secondary text-foreground" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {isAdmin() && (
                <>
                  <Separator className="my-2" />
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-secondary hover:text-foreground",
                        location.pathname === item.href ? "bg-secondary text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        <div className="px-3">
          <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
