
import React, { useState, useRef } from "react";
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
  Clock
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Icons } from "@/components/Icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";

export function Header() {
  const { profile, signOut } = useAuth();
  const { toggleSidebar, open } = useSidebar();
  const navigate = useNavigate();
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };

  // Initialize audio context on first interaction
  const handleOpenMetronome = () => {
    // Create AudioContext on first click if it doesn't exist
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch (e) {
        console.error("Failed to create AudioContext:", e);
      }
    }
    
    // Resume audio context if needed (for mobile browsers)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(console.error);
    }
    
    setMetronomeOpen(true);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b hidden md:block">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold flex items-center gap-2 hover:text-primary transition-colors">
            <Icons.logo className="h-6 w-auto" />
            <span className="text-base text-foreground">Glee World</span>
          </Link>
        </div>
          
        {/* Right side: Dashboard button, Metronome, theme toggle, and user dropdown */}
        <div className="flex items-center gap-3">
          {/* Dashboard Button */}
          <Button
            variant="spelman"
            size="sm"
            className="h-9 flex items-center gap-1"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
          
          {/* Metronome Icon */}
          <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleOpenMetronome}>
                <Clock className="h-5 w-5 text-foreground" />
                <span className="sr-only">Open metronome</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Metronome</DialogTitle>
                <DialogDescription>
                  Use the metronome to practice at different tempos and time signatures.
                </DialogDescription>
              </DialogHeader>
              <EnhancedMetronome showControls={true} size="md" audioContextRef={audioContextRef} />
            </DialogContent>
          </Dialog>
          
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
    </header>
  );
}
