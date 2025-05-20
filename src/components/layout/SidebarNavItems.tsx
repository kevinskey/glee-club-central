
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileMusic, 
  Calendar, 
  Bell, 
  Archive,
  CheckSquare,
  Headphones,
  User
} from "lucide-react";

export function SidebarNavItems() {
  const { pathname } = useLocation();
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      title: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: <FileMusic className="h-5 w-5" />
    },
    {
      title: "Recordings",
      href: "/dashboard/recordings",
      icon: <Headphones className="h-5 w-5" />
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: "Attendance",
      href: "/dashboard/attendance",
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      title: "Announcements",
      href: "/dashboard/announcements",
      icon: <Bell className="h-5 w-5" />
    },
    {
      title: "Archives",
      href: "/dashboard/archives",
      icon: <Archive className="h-5 w-5" />
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />
    }
  ];
  
  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item, index) => {
        const isActive = item.exact 
          ? pathname === item.href
          : pathname.startsWith(item.href);
          
        return (
          <NavLink
            key={index}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
            end={item.exact}
          >
            <span className="mr-3">{item.icon}</span>
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
