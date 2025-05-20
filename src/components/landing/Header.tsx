
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/landing/header/Logo";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { NavigationLinks } from "@/components/landing/header/NavigationLinks";
import { HeaderUtils } from "@/components/landing/header/HeaderUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuProvider
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const isMobile = useIsMobile();
  const [showNewsFeed, setShowNewsFeed] = useState(false);
  const navigate = useNavigate();
  
  // Set the news feed state after component mounts with a slight delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsFeed(initialShowNewsFeed);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [initialShowNewsFeed]);

  // Auto-hide the news feed after a shorter duration
  React.useEffect(() => {
    if (showNewsFeed) {
      const timer = setTimeout(() => {
        setShowNewsFeed(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showNewsFeed]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-4">
          <Logo />
          
          {/* Show navigation links in desktop view */}
          {!isMobile && <NavigationLinks className="ml-6" />}
        </div>
        
        {/* Right side: Header utilities including Glee Tools, theme toggle, and navigation dropdown */}
        <div className="flex items-center gap-3">
          {/* Header Utils - includes Glee Tools */}
          <HeaderUtils />
          
          {/* Only show dropdown menu on mobile */}
          {isMobile && (
            <DropdownMenuProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full"
                  >
                    <Menu className="h-5 w-5 text-foreground" />
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
                  
                  <DropdownMenuItem onClick={() => navigate("/social")}>
                    Social
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/contact")}>
                    Contact
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/press-kit")}>
                    Press Kit
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    Login
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuProvider>
          )}
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground border-t py-1">
        Glee Tools v1.0 – Production Ready
      </div>
    </header>
  );
}
