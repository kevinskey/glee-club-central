
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Music, 
  Calendar, 
  User
} from "lucide-react";

interface MobileNavProps {
  isAdmin: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  // Simplified mobile navigation with just the essential items
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center justify-around w-full">
          <Link 
            to="/dashboard" 
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2",
              pathname === "/dashboard" ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/sheet-music" 
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2",
              pathname === "/dashboard/sheet-music" ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <Music className="h-5 w-5" />
            <span className="text-xs mt-1">Music</span>
          </Link>
          <Link 
            to="/dashboard/calendar" 
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2",
              pathname === "/dashboard/calendar" ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">Calendar</span>
          </Link>
          <Link 
            to="/dashboard/profile" 
            className={cn(
              "flex flex-col items-center justify-center px-4 py-2",
              pathname === "/dashboard/profile" ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
