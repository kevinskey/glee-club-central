
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  // Navigation handler for mobile dropdown
  const handleNavigation = (value: string) => {
    setValue(value);
    navigate(value);
  };

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {/* Mobile view: Dropdown menu */}
      <div className="md:hidden w-full mb-4">
        <Select value={value} onValueChange={handleNavigation}>
          <SelectTrigger>
            <SelectValue placeholder="Navigate to..." />
          </SelectTrigger>
          <SelectContent>
            {navItems.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop view: Traditional sidebar links */}
      <div className="hidden md:block">
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
      </div>
    </nav>
  );
}
