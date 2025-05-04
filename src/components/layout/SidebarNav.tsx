
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  CreditCard, 
  FileText, 
  Headphones, 
  Mic, 
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Navigation items with icons
  const items = [
    {
      title: "Sheet Music Library",
      href: "/dashboard/sheet-music",
      icon: FileText,
    },
    {
      title: "Practice on Your Own",
      href: "/dashboard/practice",
      icon: Headphones,
    },
    {
      title: "Recording Submissions",
      href: "/dashboard/recordings",
      icon: Mic,
    },
    {
      title: "Pay Dues",
      href: "/dashboard/dues",
      icon: CreditCard,
    },
    {
      title: "Glee Club Schedule",
      href: "/dashboard/schedule",
      icon: Calendar,
    },
    {
      title: "Club Handbook",
      href: "/dashboard/handbook",
      icon: BookOpen,
    },
    {
      title: "Buy Glee Merch",
      href: "/dashboard/merch",
      icon: ShoppingBag,
    },
    {
      title: "Check Attendance",
      href: "/dashboard/attendance",
      icon: CheckSquare,
    },
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              location.pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted hover:text-muted-foreground",
              "hover:bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
