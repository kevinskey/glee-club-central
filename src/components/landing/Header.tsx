
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/landing/header/Logo";
import { NavigationLinks } from "@/components/landing/header/NavigationLinks";
import { HeaderUtils } from "@/components/landing/header/HeaderUtils";
import { NewsTicker } from "@/components/landing/news/NewsTicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

export function Header() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showNewsTicker, setShowNewsTicker] = useState(true);
  
  return (
    <>
      {showNewsTicker && <NewsTicker onClose={() => setShowNewsTicker(false)} />}
      
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 w-full">
        <div className="container mx-auto px-4 md:px-6 flex h-16 md:h-20 items-center justify-between">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-full"
                  >
                    <Menu className="h-5 w-5" />
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
                  
                  <DropdownMenuItem onClick={() => navigate("/events")}>
                    Events
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/press-kit")}>
                    Press Kit
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/recordings/submit")}>
                    Recording Studio
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/contact")}>
                    Contact
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate("/privacy")}>
                    Privacy Policy
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate("/terms")}>
                    Terms of Service
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/login")}
                    className="bg-glee-purple text-white hover:bg-glee-purple/90 hover:text-white"
                  >
                    Member Login
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
