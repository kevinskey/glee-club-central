
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Menu, 
  Music, 
  Calendar, 
  CheckSquare,
  Bell, 
  BarChart,
  Settings,
  Users,
  MessageSquare,
  FileText,
  Archive,
  User,
  Home
} from "lucide-react";

interface MobileNavProps {
  isAdmin: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  const { pathname } = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  const mainNavItems = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      external: true,
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: <Music className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Attendance",
      href: "/dashboard/attendance",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Practice Resources",
      href: "/dashboard/practice",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Media Library",
      href: "/dashboard/archives",
      icon: <Archive className="h-5 w-5" />,
    },
    {
      title: "Contact Admin",
      href: "/dashboard/contact",
      icon: <MessageSquare className="h-5 w-5" />,
    }
  ];
  
  const adminNavItems = [
    {
      title: "Admin Dashboard",
      href: "/dashboard/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Event Manager",
      href: "/dashboard/admin/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Site Settings",
      href: "/dashboard/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden">
      <div className="flex items-center justify-between px-4 py-2">
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] px-2 py-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h2 className="px-4 text-lg font-semibold tracking-tight mb-3">
                  Main Menu
                </h2>
                <div className="space-y-1 px-2">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpenMobile(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        pathname === item.href 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-accent/50 hover:text-accent-foreground"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
              
              {isAdmin && (
                <div>
                  <h2 className="px-4 text-lg font-semibold tracking-tight mb-3">
                    Admin Menu
                  </h2>
                  <div className="space-y-1 px-2">
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setOpenMobile(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                          pathname === item.href 
                            ? "bg-accent text-accent-foreground" 
                            : "hover:bg-accent/50 hover:text-accent-foreground"
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/dashboard" 
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1",
              pathname === "/dashboard" ? "text-glee-spelman" : "text-muted-foreground"
            )}
            onClick={() => setOpenMobile(false)}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/sheet-music" 
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1",
              pathname === "/dashboard/sheet-music" ? "text-glee-spelman" : "text-muted-foreground"
            )}
            onClick={() => setOpenMobile(false)}
          >
            <Music className="h-5 w-5" />
            <span className="text-xs mt-1">Music</span>
          </Link>
          <Link 
            to="/dashboard/calendar" 
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1",
              pathname === "/dashboard/calendar" ? "text-glee-spelman" : "text-muted-foreground"
            )}
            onClick={() => setOpenMobile(false)}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">Calendar</span>
          </Link>
          <Link 
            to="/dashboard/profile" 
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1",
              pathname === "/dashboard/profile" ? "text-glee-spelman" : "text-muted-foreground"
            )}
            onClick={() => setOpenMobile(false)}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
