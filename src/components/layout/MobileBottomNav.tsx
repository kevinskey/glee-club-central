
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, Home, BookOpen, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [metronomeOpen, setMetronomeOpen] = React.useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  
  // Skip rendering if not mobile
  if (!isMobile) return null;
  
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

  // Helper function to check if the link is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navigationItems = [
    { 
      icon: <Home size={18} />, 
      label: "Home", 
      path: "/" 
    },
    { 
      icon: <Camera size={18} />, 
      label: "Media", 
      path: "/recordings" 
    },
    { 
      icon: <Clock size={18} className="text-glee-purple" />, 
      label: "Metronome", 
      onClick: handleOpenMetronome 
    },
    { 
      icon: <BookOpen size={18} />, 
      label: "Music", 
      path: "/sheet-music" 
    },
    { 
      icon: <Users size={18} />, 
      label: "Members", 
      path: "/members" 
    }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t h-16 flex items-center justify-around md:hidden">
        {navigationItems.map((item, index) => (
          item.onClick ? (
            <div 
              key={index}
              className="flex flex-col items-center justify-center px-2 py-1 cursor-pointer" 
              onClick={item.onClick}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-[10px]">{item.label}</span>
            </div>
          ) : (
            <Link 
              key={index}
              to={item.path} 
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1", 
                isActive(item.path) 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-[10px]">{item.label}</span>
              {isActive(item.path) && (
                <div className="absolute bottom-0 w-6 h-0.5 bg-glee-spelman rounded-t-sm" />
              )}
            </Link>
          )
        ))}
      </nav>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogContent className="sm:max-w-md max-w-[95%] h-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
            <DialogDescription>
              Use the metronome to practice at different tempos and time signatures.
            </DialogDescription>
          </DialogHeader>
          <EnhancedMetronome showControls={true} size="md" audioContextRef={audioContextRef} />
        </DialogContent>
      </Dialog>
    </>
  );
};
