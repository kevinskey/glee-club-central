
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { NewsFeed } from "@/components/news/NewsFeed";
import { useIsMobile } from "@/hooks/use-mobile";

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
        <div className="hidden md:flex items-center gap-4">
          <Clock />
          <Button 
            variant="outline" 
            className="text-glee-purple border-glee-purple hover:bg-glee-purple/10" 
            onClick={() => navigate("/login")}
          >
            Member Login
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
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-white border-t border-gray-200 dark:border-gray-200">
          <div className="container py-4 px-4 flex flex-col gap-4">
            <div className="flex justify-center">
              <Clock />
            </div>
            <Button 
              variant="outline" 
              className="text-glee-purple border-glee-purple hover:bg-glee-purple/10 w-full" 
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
            >
              Member Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
