
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Users,
  Home,
  Settings,
  CalendarDays,
  FileText,
  Mic,
  MessageSquare,
  Music,
  LogOut,
  User,
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";

export function Header() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { onOpen } = useSidebar();

  // Navigation items - ensuring unique paths
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Member Directory",
      href: "/dashboard/members",
      icon: Users,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: CalendarDays,
    },
    {
      title: "Sheet Music",
      href: "/dashboard/sheet-music",
      icon: FileText,
    },
    {
      title: "Rehearsals",
      href: "/dashboard/rehearsals",
      icon: Mic,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ];

  // Admin-only items
  const adminItems = [
    {
      title: "Member Management",
      href: "/dashboard/member-management",
      icon: Users,
      adminOnly: true
    },
  ];

  // Determine if user is an admin to show admin-specific links
  const isAdmin = profile?.role === "administrator";

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onOpen}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Link to="/" className="font-bold">
            Glee Club
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          {/* Main Navigation Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {profile?.first_name} {profile?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => navigate("/dashboard/profile")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => navigate("/update-password")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={signOut}
                className="flex items-center gap-2 cursor-pointer text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
