
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Metronome } from "@/components/ui/metronome";
import { NewsFeed } from "@/components/news/NewsFeed";
import { Logo } from "@/components/landing/header/Logo";
import { NavigationLinks } from "@/components/landing/header/NavigationLinks";
import { MemberPortalDropdown } from "@/components/landing/header/MemberPortalDropdown";
import { HeaderUtils } from "@/components/landing/header/HeaderUtils";
import { MobileMenuToggle } from "@/components/landing/header/MobileMenuToggle";
import { MobileMenu } from "@/components/landing/header/MobileMenu";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const isMobile = useIsMobile();
  const [showNewsFeed, setShowNewsFeed] = useState(initialShowNewsFeed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-hide the news feed after a shorter duration (2 seconds instead of default)
  useEffect(() => {
    if (showNewsFeed) {
      const timer = setTimeout(() => {
        setShowNewsFeed(false);
      }, 2000); // 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showNewsFeed]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showNewsFeed && <NewsFeed onClose={() => setShowNewsFeed(false)} />}
      <div className="container px-4 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <Metronome />
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-3">
          <NavigationLinks />
          <HeaderUtils />
          <MemberPortalDropdown />
        </div>
        
        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
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
  );
}
