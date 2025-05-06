
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { NewsFeed } from "@/components/news/NewsFeed";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const navigate = useNavigate();
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
          <Music className="h-5 w-5 text-glee-purple" />
          <span className="font-playfair text-lg font-semibold text-glee-purple">
            Glee World
          </span>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Clock />
          <Button 
            variant="outline" 
            size="sm"
            className="text-glee-purple border-glee-purple hover:bg-glee-purple/10 h-8 px-3 text-xs" 
            onClick={() => navigate("/fan-page")}
          >
            Guest Access
          </Button>
          <Button 
            size="sm"
            className="bg-glee-purple hover:bg-glee-purple/90 h-8 px-3 text-xs" 
            onClick={() => navigate("/login")}
          >
            Member Portal
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-glee-purple"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container py-4 px-4 flex flex-col gap-4">
            <div className="flex justify-center gap-4">
              <ThemeToggle />
              <Clock />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-glee-purple border-glee-purple hover:bg-glee-purple/10 w-full h-8 text-xs" 
              onClick={() => {
                navigate("/fan-page");
                setMobileMenuOpen(false);
              }}
            >
              Guest Access
            </Button>
            <Button 
              size="sm"
              className="bg-glee-purple hover:bg-glee-purple/90 w-full h-8 text-xs" 
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
            >
              Member Portal
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
