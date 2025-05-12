
import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { Clock, Menu, X } from "lucide-react";
import { MobileMenu } from "@/components/landing/header/MobileMenu";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileHeader() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
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
    if (isDashboardPath) {
      toggleSidebar();
    } else {
      toggleMobileMenu();
    }
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-2 flex h-16 items-center justify-between">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSidebarToggle}
            >
              {mobileMenuOpen && !isDashboardPath ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Toggle sidebar"}</span>
            </Button>
            
            <div className="flex items-center">
              <Link to={isAuthenticated ? "/dashboard" : "/"} className="font-bold flex items-center gap-1 hover:text-primary transition-colors">
                <Icons.logo className="h-8 w-auto" />
                <span className="text-xl text-foreground">Glee Club</span>
              </Link>
              
              {/* Metronome Icon */}
              <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={handleOpenMetronome}>
                    <Clock className="h-4 w-4 text-foreground" />
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
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu for public pages */}
      {mobileMenuOpen && !isDashboardPath && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </>
  );
}
