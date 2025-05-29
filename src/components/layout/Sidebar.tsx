
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  ClipboardList,
  Calendar,
  LayoutDashboard,
  Library,
  Headphones
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const { isSuperAdmin } = usePermissions();
  const { unreadCount } = useNotifications();
  
  // Check if user is admin
  const isAdmin = profile?.is_super_admin || isSuperAdmin;
  
  const isActiveRoute = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // Organized menu sections
  const menuSections = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Home",
          href: "/dashboard/member",
          icon: Home,
          exact: true
        }
      ]
    },
    {
      title: "My Music",
      items: [
        {
          title: "Sheet Music",
          href: "/dashboard/sheet-music",
          icon: Music
        },
        {
          title: "Practice Recordings",
          href: "/dashboard/recordings",
          icon: Headphones
        },
        {
          title: "Recording Studio",
          href: "/dashboard/recording-studio",
          icon: Mic
        },
        {
          title: "Media Library",
          href: "/dashboard/media-library",
          icon: Library
        }
      ]
    },
    {
      title: "Events & Activities",
      items: [
        {
          title: "Calendar",
          href: "/calendar",
          icon: Calendar
        },
        {
          title: "Attendance",
          href: "/dashboard/attendance",
          icon: ClipboardList
        }
      ]
    },
    {
      title: "Personal",
      items: [
        {
          title: "My Profile",
          href: "/dashboard/profile",
          icon: User
        },
        {
          title: "Announcements",
          href: "/dashboard/announcements",
          icon: Bell,
          badge: unreadCount > 0 ? unreadCount : null
        },
        {
          title: "Archives",
          href: "/dashboard/archives",
          icon: Archive
        }
      ]
    }
  ];

  // Admin menu items
  const adminMenuItems = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      title: "Admin Calendar",
      href: "/admin/calendar",
      icon: Calendar
    },
    {
      title: "Member Management",
      href: "/dashboard/members",
      icon: Users
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ];

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4 z-40 hidden md:block overflow-y-auto",
      className
    )}>
      <nav className="space-y-6">
        {/* Regular menu sections */}
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Button
                  key={item.href}
                  variant={isActiveRoute(item.href, item.exact) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start relative",
                    isActiveRoute(item.href, item.exact) && "bg-glee-spelman/10 text-glee-spelman font-medium"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                    {item.badge && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Admin section */}
        {isAdmin && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="mb-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </h3>
              <div className="space-y-1">
                {adminMenuItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActiveRoute(item.href) && "bg-amber-100 text-amber-900 font-medium"
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
