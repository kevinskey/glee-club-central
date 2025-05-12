
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/landing/header/Logo";
import { NavigationLinks } from "@/components/landing/header/NavigationLinks";
import { MemberPortalDropdown } from "@/components/landing/header/MemberPortalDropdown";
import { HeaderUtils } from "@/components/landing/header/HeaderUtils";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const isMobile = useIsMobile();
  const [showNewsFeed, setShowNewsFeed] = useState(false); // Start hidden to avoid flicker
  
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

  // This component will now only be rendered on desktop
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-2 flex h-16 items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <Logo />
        </div>
        
        {/* Desktop navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NavigationLinks />
          <HeaderUtils />
          <MemberPortalDropdown />
        </div>
      </div>
    </header>
  );
};
