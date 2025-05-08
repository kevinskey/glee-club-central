
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
  useDropdownMenu,
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

export function Header() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Navigation items - simplified to prevent duplicate paths
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Member Directory",
      href: "/dashboard/member-directory",
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
      href: "/dashboard/members-management",
      icon: Users,
      adminOnly: true
    },
  ];

  // Determine if user is an admin to show admin-specific links
  const isAdmin = profile?.role === "administrator";

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold">
          Glee Club
        </Link>

        <nav className="flex items-center gap-4">
          {/* Main Navigation Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Navigation Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {navItems.map((item) => (
                <DropdownMenuItem 
                  key={item.href} 
                  onClick={() => navigate(item.href)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </DropdownMenuItem>
              ))}
              
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {adminItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.href} 
                      onClick={() => navigate(item.href)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              
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

          {/* User's name - could be expanded to include user menu */}
          <span className="hidden md:inline-flex text-sm">
            {profile?.first_name} {profile?.last_name}
          </span>
        </nav>
      </div>
    </header>
  );
}
