
import React, { useState } from "react";
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
  User,
  Settings,
  LogOut,
  Music,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Icons } from "@/components/Icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { profile, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Link to="/" className="font-bold flex items-center gap-1 sm:gap-2 hover:text-primary transition-colors">
            <Icons.logo className="h-5 sm:h-6 w-auto" />
            <span>Glee Club</span>
          </Link>

          {/* Metronome Dialog in Header - hidden on mobile */}
          {!isMobile && (
            <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Music className="h-4 w-4" />
                  <span className="sr-only">Open metronome</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Metronome</DialogTitle>
                </DialogHeader>
                <EnhancedMetronome showControls={true} size="md" />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>
                {profile?.first_name} {profile?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
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
        </nav>
      </div>
    </header>
  );
}
