
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FileMusic,
  Users,
  Bell,
  DollarSign,
  Settings,
  Home,
  Calendar,
  LayoutDashboard,
  Library,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean;
}

export function DashboardNav({
  className,
  isCollapsed = false,
  ...props
}: DashboardNavProps) {
  const { pathname } = useLocation();
  const { isAdmin, profile } = useAuth();
  const isAdminUser = profile?.is_super_admin || (isAdmin && isAdmin());
  
  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard/member",
      icon: Home,
      active: pathname === "/dashboard/member"
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: Calendar,
      active: pathname === "/calendar"
    },
    {
      label: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: FileMusic,
      active: pathname === "/dashboard/sheet-music"
    },
    {
      label: "Media Library",
      href: "/dashboard/media-library",
      icon: Library,
      active: pathname === "/dashboard/media-library"
    },
    {
      label: "Announcements",
      href: "/dashboard/announcements",
      icon: Bell,
      active: pathname === "/dashboard/announcements"
    }
  ];

  const adminItems = [
    {
      label: "Admin Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname.startsWith("/admin")
    },
    {
      label: "Finances",
      href: "/dashboard/finances",
      icon: DollarSign,
      active: pathname === "/dashboard/finances"
    },
    {
      label: "Member Management",
      href: "/admin/members",
      icon: Users,
      active: pathname === "/admin/members"
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: pathname === "/admin/settings"
    }
  ];
  
  return (
    <nav className={cn('flex flex-col gap-2', className)} {...props}>
      {/* Main Navigation */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                'justify-start w-full transition-all duration-200',
                isCollapsed && 'justify-center px-2',
                item.active && 'bg-glee-spelman text-white shadow-sm hover:bg-glee-spelman/90'
              )}
              asChild
            >
              <Link to={item.href}>
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.label}</span>}
                {item.active && !isCollapsed && (
                  <ChevronRight className="h-3 w-3 ml-auto" />
                )}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Admin Section */}
      {isAdminUser && (
        <>
          <div className="my-4">
            <div className="h-px bg-border" />
          </div>
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administration
              </p>
            )}
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    'justify-start w-full transition-all duration-200',
                    isCollapsed && 'justify-center px-2',
                    item.active && 'bg-red-500 text-white shadow-sm hover:bg-red-500/90'
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span>{item.label}</span>}
                    {item.active && !isCollapsed && (
                      <ChevronRight className="h-3 w-3 ml-auto" />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
}
