
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
  Upload, 
  BarChart,
  Settings,
  Users,
  MessageSquare,
  FileText
} from "lucide-react";

interface MobileNavProps {
  isAdmin: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  const { pathname } = useLocation();
  const { open, setOpen } = useSidebar();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: <Music className="h-4 w-4" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Attendance",
      href: "/dashboard/attendance",
      icon: <CheckSquare className="h-4 w-4" />,
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      title: "Practice Resources",
      href: "/dashboard/practice",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Contact Admin",
      href: "/dashboard/contact",
      icon: <MessageSquare className="h-4 w-4" />,
    }
  ];
  
  const adminNavItems = [
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Media Manager",
      href: "/dashboard/admin/media",
      icon: <Upload className="h-4 w-4" />,
    },
    {
      title: "Event Manager",
      href: "/dashboard/admin/events",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Site Settings",
      href: "/dashboard/admin/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex items-center lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-1 sm:mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-4 sm:h-5 w-4 sm:w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 sm:max-w-xs w-[90%] sm:w-[85%] px-0">
          <div className="space-y-3 sm:space-y-4 py-1 sm:py-2 h-full flex flex-col">
            <div className="px-2 sm:px-3 flex-1 overflow-auto">
              <h2 className="mb-1 sm:mb-2 px-2 text-base sm:text-lg font-semibold tracking-tight">
                Main Menu
              </h2>
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-2 py-2 text-sm font-medium",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground transition-colors"
                    )}
                  >
                    <span className="mr-2 sm:mr-3 flex h-5 w-5 items-center justify-center">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {isAdmin && (
              <div className="px-2 sm:px-3 border-t pt-3 sm:pt-4">
                <h2 className="mb-1 sm:mb-2 px-2 text-base sm:text-lg font-semibold tracking-tight">
                  Admin Menu
                </h2>
                <div className="space-y-1">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-2 py-2 text-sm font-medium",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground transition-colors"
                      )}
                    >
                      <span className="mr-2 sm:mr-3 flex h-5 w-5 items-center justify-center">{item.icon}</span>
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
