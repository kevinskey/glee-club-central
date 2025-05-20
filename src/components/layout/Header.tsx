
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
  DropdownMenuProvider
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Icons } from "@/components/Icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { GleeTools } from "@/components/glee-tools/GleeTools";

export function Header() {
  const { profile, signOut } = useAuth();
  const { toggleSidebar, open } = useSidebar();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b hidden md:block">
      <div className="max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold flex items-center gap-2 hover:text-primary transition-colors">
            <Icons.logo className="h-6 w-auto" />
            <span className="text-base text-foreground">Glee World</span>
          </Link>
        </div>
          
        {/* Right side: Glee Tools, theme toggle, and user dropdown */}
        <div className="flex items-center gap-3">
          {/* GleeTools */}
          <GleeTools />
          
          <ThemeToggle />
          
          <DropdownMenuProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11">
                  <Menu className="h-7 w-7 text-foreground" />
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel>
                  {profile?.first_name} {profile?.last_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/update-password")}>
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <Icons.logo className="h-4 w-auto mr-2" />
                  <span>Home Page</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={toggleSidebar}>
                  <Menu className="h-4 w-4 mr-2" />
                  <span>Toggle Sidebar</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuProvider>
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground border-t py-1">
        Glee Tools v1.0 – Production Ready
      </div>
    </header>
  );
}
