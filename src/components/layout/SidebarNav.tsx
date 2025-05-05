
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  FolderOpen,
  Home,
  LibraryBig,
  Mic2,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Sheet Music",
    href: "/dashboard/sheet-music",
    icon: FileText,
  },
  {
    title: "Media Library",
    href: "/dashboard/media-library",
    icon: FolderOpen,
  },
  {
    title: "Practice",
    href: "/dashboard/practice",
    icon: LibraryBig,
  },
  {
    title: "Submit Recordings",
    href: "/dashboard/recordings",
    icon: Mic2,
  },
  {
    title: "Pay Dues",
    href: "/dashboard/dues",
    icon: CreditCard,
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
  },
  {
    title: "Club Handbook",
    href: "/dashboard/handbook",
    icon: BookOpen,
  },
  {
    title: "Glee Merch",
    href: "/dashboard/merch",
    icon: ShoppingBag,
  },
  {
    title: "Attendance Records",
    href: "/dashboard/attendance",
    icon: ShieldCheck,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/dashboard"}
          className={({ isActive }) => 
            cn("group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
               isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn(
                "mr-2 h-4 w-4",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
              )} />
              <span>{item.title}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
