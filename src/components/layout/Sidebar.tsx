
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "@/components/layout/NavItem";
import { MobileNavItem } from "@/components/layout/MobileNavItem";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Music2, 
  Mic2, 
  Video, 
  FileText, 
  CreditCard,
  Book,
  ShoppingBag,
  Users,
  MessageSquare,
  ClipboardCheck,
  LibraryBig,
  ListMusic,
  BellRing,
  PanelLeft,
  Megaphone,
  UserCircle,
  LayoutDashboard,
  Sliders,
  Gauge,
  Shirt,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { isOpen, onOpen, onClose, onToggle } = useSidebar();
  const isAdmin = user?.email?.includes("admin") || user?.email === "test@example.com";

  // Close sidebar on route change for mobile
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: <Music2 className="h-5 w-5" />,
    },
    {
      title: "Setlists",
      href: "/dashboard/setlists",
      icon: <ListMusic className="h-5 w-5" />,
    },
    {
      title: "Recordings",
      href: "/dashboard/recordings",
      icon: <Mic2 className="h-5 w-5" />,
    },
    {
      title: "Videos",
      href: "/dashboard/videos",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Media Library",
      href: "/dashboard/media-library",
      icon: <LibraryBig className="h-5 w-5" />,
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Attendance",
      href: "/dashboard/attendance",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Handbook",
      href: "/dashboard/handbook",
      icon: <Book className="h-5 w-5" />,
    },
    {
      title: "Dues",
      href: "/dashboard/dues",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Merchandise",
      href: "/dashboard/merch",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <UserCircle className="h-5 w-5" />,
    },
  ];

  // Admin-only navigation items
  const adminNavItems = [
    {
      title: "Admin Dashboard",
      href: "/dashboard/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Member Management",
      href: "/dashboard/admin/members",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Finance Management",
      href: "/dashboard/admin/finances",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Wardrobe Management",
      href: "/dashboard/admin/wardrobe",
      icon: <Shirt className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: <Gauge className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: <Sliders className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-30 h-screen w-64 border-r bg-background transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col pb-12 pt-16">
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Main Menu
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={() => item.icon}
                >
                  {item.title}
                </NavItem>
              ))}
            </div>
            
            {isAdmin && (
              <>
                <h2 className="mb-2 mt-6 px-2 text-lg font-semibold tracking-tight">
                  Admin
                </h2>
                <div className="space-y-1">
                  {adminNavItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={() => item.icon}
                    >
                      {item.title}
                    </NavItem>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="mt-auto px-6 py-4">
            <div 
              className="flex items-center justify-between rounded-lg border border-dashed p-3"
            >
              <div>
                <p className="text-xs font-semibold">Need Help?</p>
                <p className="text-xs text-muted-foreground">View the handbook</p>
              </div>
              <Link 
                to="/dashboard/handbook"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              >
                <Book className="h-4 w-4" />
                <span className="sr-only">View Handbook</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile Navigation */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-t bg-background px-4 lg:hidden"
      )}>
        <MobileNavItem
          href="/dashboard"
          title="Home"
        />
        <MobileNavItem
          href="/dashboard/sheet-music"
          title="Music"
        />
        <MobileNavItem
          href="/dashboard/setlists"
          title="Setlists"
        />
        <MobileNavItem
          href="/dashboard/calendar"
          title="Calendar"
        />
        <MobileNavItem
          href="#sidebar"
          title="Menu"
          onClick={() => isOpen ? onClose() : onOpen()}
        />
      </nav>
      
      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
