
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { NewsFeed } from "@/components/news/NewsFeed";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const navigate = useNavigate();
  const [showNewsFeed, setShowNewsFeed] = useState(initialShowNewsFeed);

  // Auto-hide the news feed after a shorter duration (2 seconds instead of default)
  useEffect(() => {
    if (showNewsFeed) {
      const timer = setTimeout(() => {
        setShowNewsFeed(false);
      }, 2000); // 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showNewsFeed]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showNewsFeed && <NewsFeed onClose={() => setShowNewsFeed(false)} />}
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-glee-purple" />
          <span className="font-playfair text-lg font-semibold text-glee-purple">
            Glee World
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Clock />
          <Button 
            variant="outline" 
            className="text-glee-purple border-glee-purple hover:bg-glee-purple/10" 
            onClick={() => navigate("/login")}
          >
            Member Login
          </Button>
        </div>
      </div>
    </header>
  );
}
