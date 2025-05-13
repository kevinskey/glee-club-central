
import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Icons } from "@/components/Icons";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";

export function ConsolidatedHeader() {
  const { profile, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const isDashboardPath = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");
  
  // Function to determine if we can use the sidebar functionality
  const useSidebarIfAvailable = () => {
    try {
      // Dynamically import to avoid the error when no SidebarProvider exists
      const sidebarModule = require("@/components/ui/sidebar");
      return sidebarModule.useSidebar();
    } catch (e) {
      // Return fallback values if sidebar is not available
      return {
        toggleSidebar: () => {},
        open: false
      };
    }
  };

  // Get sidebar functionality or fallback values
  const { toggleSidebar } = useSidebarIfAvailable();
  
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 flex h-16 items-center justify-between">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
            <Icons.logo className="h-6 w-auto" />
            <span className="text-base ml-2 text-foreground">Glee World</span>
          </Link>
        </div>
          
        {/* Right side: Metronome, theme toggle, and menu dropdown */}
        <div className="flex items-center gap-2">
          {/* Metronome Icon */}
          <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'}`}
                onClick={handleOpenMetronome}
              >
                <Clock className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${isMobile ? 'h-10 w-10' : 'h-11 w-11'}`}
                >
                  <Menu className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-foreground`} />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                {isAuthenticated ? (
                  <>
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
                    
                    {isDashboardPath && (
                      <DropdownMenuItem onClick={() => navigate("/")}>
                        <Icons.logo className="h-4 w-auto mr-2" />
                        <span>Home Page</span>
                      </DropdownMenuItem>
                    )}
                    
                    {isDashboardPath && (
                      <DropdownMenuItem onClick={toggleSidebar}>
                        <Menu className="h-4 w-4 mr-2" />
                        <span>Toggle Sidebar</span>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="flex items-center gap-2 cursor-pointer text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate("/")}>
                      Home
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate("/about")}>
                      About
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate("/privacy")}>
                      Privacy Policy
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate("/terms")}>
                      Terms of Service
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate("/press-kit")}>
                      Press Kit
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      Member Login
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate("/register/admin")}>
                      Admin Registration
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuProvider>
        </div>
      </div>
    </header>
  );
}
