
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
  Archive
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
    <div className="flex items-center lg:hidden">
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 sm:max-w-xs w-[300px] px-1">
          <div className="space-y-4 py-3 h-full flex flex-col overflow-hidden">
            <div className="px-3 flex-1 overflow-auto">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                Main Menu
              </h2>
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpenMobile(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 hover:text-accent-foreground transition-colors"
                    )}
                  >
                    <span className="mr-3 flex h-5 w-5 items-center justify-center">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {isAdmin && (
              <div className="px-3 border-t pt-4">
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                  Admin Menu
                </h2>
                <div className="space-y-1 mb-4">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpenMobile(false)}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 hover:text-accent-foreground transition-colors"
                      )}
                    >
                      <span className="mr-3 flex h-5 w-5 items-center justify-center">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
