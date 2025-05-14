
import React, { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/landing/header/Logo";
import { Clock, Menu, X, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { PitchPipeDialog } from "@/components/ui/pitch-pipe-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuProvider
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  initialShowNewsFeed?: boolean;
}

export function Header({ initialShowNewsFeed = true }: HeaderProps) {
  const isMobile = useIsMobile();
  const [showNewsFeed, setShowNewsFeed] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const navigate = useNavigate();
  
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

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 flex h-16 items-center justify-between">
        {/* Left side: Logo and site name */}
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        
        {/* Right side: Pitch Pipe, Metronome, theme toggle, and navigation dropdown */}
        <div className="flex items-center gap-3">
          {/* Pitch Pipe Icon */}
          <PitchPipeDialog triggerClassName="h-10 w-10 rounded-full" />
          
          {/* Metronome Icon */}
          <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full" 
                onClick={handleOpenMetronome}
              >
                <Clock className="h-5 w-5 text-foreground" />
                <span className="sr-only">Open metronome</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Metronome</DialogTitle>
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
                  className="h-10 w-10 rounded-full"
                >
                  <Menu className="h-5 w-5 text-foreground" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate("/")} className="py-2">
                  Home
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/about")} className="py-2">
                  About
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/login")} className="py-2">
                  Login
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/privacy")} className="py-2">
                  Privacy Policy
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/terms")} className="py-2">
                  Terms of Service
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate("/press-kit")} className="py-2">
                  Press Kit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuProvider>
        </div>
      </div>
    </header>
  );
}
