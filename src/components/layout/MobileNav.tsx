
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  User,
  Bell,
  Mic
} from "lucide-react";

interface MobileNavProps {
  isAdmin: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  // Only show in dashboard paths
  if (!pathname.startsWith('/dashboard')) return null;
  
  // Don't show in PDF viewer pages
  if (pathname.includes('/sheet-music/') && pathname.split('/').length > 3) return null;
  
  // Bottom navigation tabs with improved styling
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t md:hidden">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center justify-around w-full">
          <Link 
            to="/dashboard" 
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1.5",
              pathname === "/dashboard" ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link 
            to="/dashboard/sheet-music" 
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1.5",
              pathname.includes("/dashboard/sheet-music") ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Music</span>
          </Link>
          <Link 
            to="/dashboard/recordings" 
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1.5",
              pathname.includes("/dashboard/recordings") ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <Mic className="h-5 w-5" />
            <span className="text-xs mt-1">Audio</span>
          </Link>
          <Link 
            to="/dashboard/announcements" 
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1.5",
              pathname.includes("/dashboard/announcements") ? "text-glee-spelman" : "text-muted-foreground"
            )}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Alerts</span>
          </Link>
          <Link 
            to="/dashboard/profile" 
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1.5",
              pathname.includes("/dashboard/profile") ? "text-glee-spelman" : "text-muted-foreground"
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
