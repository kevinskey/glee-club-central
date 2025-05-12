
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Metronome } from "@/components/ui/metronome";
import { Logo } from "@/components/landing/header/Logo";
import { NavigationLinks } from "@/components/landing/header/NavigationLinks";
import { MemberPortalDropdown } from "@/components/landing/header/MemberPortalDropdown";
import { HeaderUtils } from "@/components/landing/header/HeaderUtils";
import { MobileMenuToggle } from "@/components/landing/header/MobileMenuToggle";
import { MobileMenu } from "@/components/landing/header/MobileMenu";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const isMobile = useIsMobile();
  const [showNewsFeed, setShowNewsFeed] = useState(false); // Start hidden to avoid flicker
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);

  // Set the news feed state after component mounts with a slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsFeed(initialShowNewsFeed);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [initialShowNewsFeed]);

  // Auto-hide the news feed after a shorter duration
  useEffect(() => {
    if (showNewsFeed) {
      const timer = setTimeout(() => {
        setShowNewsFeed(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showNewsFeed]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-2 flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Logo />
            
            {/* Metronome Dialog in Header */}
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
                  <DialogDescription>
                    Adjust tempo and rhythm settings as needed for your practice.
                  </DialogDescription>
                </DialogHeader>
                <EnhancedMetronome showControls={true} size="md" />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <NavigationLinks />
            <HeaderUtils />
            <MemberPortalDropdown />
          </div>
          
          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-1 sm:gap-2">
            <HeaderUtils />
            <MobileMenuToggle 
              isOpen={mobileMenuOpen} 
              onToggle={toggleMobileMenu} 
            />
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
      </header>
    </>
  );
}
