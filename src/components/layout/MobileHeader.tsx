
import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { Clock, Menu, X, LogIn } from "lucide-react";
import { MobileMenu } from "@/components/landing/header/MobileMenu";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuProvider
} from "@/components/ui/dropdown-menu";

export function MobileHeader() {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { setOpenMobile, openMobile } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const isDashboardPath = location.pathname.startsWith("/dashboard");
  
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSidebarToggle = () => {
    console.log("Toggling sidebar or mobile menu. isDashboardPath:", isDashboardPath);
    
    if (isDashboardPath) {
      // For dashboard pages, use the sidebar's setOpenMobile function
      setOpenMobile(!openMobile);
    } else {
      // For public pages, toggle our local mobile menu state
      toggleMobileMenu();
    }
  };
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate("/login");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 flex h-14 items-center justify-between">
          {/* Left side: Logo and site name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold flex items-center hover:text-primary transition-colors">
              <Icons.logo className="h-6 w-auto" />
              <span className="text-base ml-2 text-foreground">Glee World</span>
            </Link>
          </div>
          
          {/* Right side: Login, Metronome, theme toggle, and menu button */}
          <div className="flex items-center gap-2">
            {/* Login Button - Removed */}
            
            <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 px-2 h-8"
                  onClick={handleOpenMetronome}
                >
                  <Clock className="h-4 w-4 text-foreground" />
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
                    className="flex-shrink-0 h-10 w-10"
                  >
                    <Menu className="h-6 w-6 text-foreground" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
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
                  
                  <DropdownMenuItem onClick={() => navigate("/press-kit")}>
                    Press Kit
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {isAuthenticated && (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  
                  {isDashboardPath && (
                    <DropdownMenuItem onClick={() => setOpenMobile(!openMobile)}>
                      Toggle Sidebar
                    </DropdownMenuItem>
                  )}
                  
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        Member Portal
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/login")}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/login")}>
                        Member Portal
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {!isAuthenticated && (
                    <DropdownMenuItem onClick={() => navigate("/register")}>
                      Register
                    </DropdownMenuItem>
                  )}
                  
                  {!isAuthenticated && (
                    <DropdownMenuItem onClick={() => navigate("/register/admin")}>
                      Admin Registration
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuProvider>
          </div>
        </div>
      </header>

      {/* Mobile menu for public pages */}
      {mobileMenuOpen && !isDashboardPath && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </>
  );
}
