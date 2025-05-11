
import React from "react";
import { 
  Users, 
  Upload, 
  Calendar, 
  BarChart,
  Settings,
  Files
} from "lucide-react";
import { NavLink } from 'react-router-dom';

export const adminNavItems = [
  {
    title: "User Management",
    href: "/dashboard/admin/members",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Media Manager",
    href: "/dashboard/admin/media",
    icon: <Files className="h-4 w-4" />,
  },
  {
    title: "Media Manager (Legacy)",
    href: "/dashboard/admin/media-legacy",
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

export function AdminNavigation() {
  return (
    <div className="px-4 py-2">
      <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
        Admin Menu
      </h2>
      <nav className="space-y-1">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
