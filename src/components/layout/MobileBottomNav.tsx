
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

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t h-16 flex items-center justify-around md:hidden">
        <Link to="/" className={cn("flex flex-col items-center justify-center px-2 py-1", isActive('/') ? "text-primary" : "text-muted-foreground")}>
          <Home size={20} className="mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/recordings" className={cn("flex flex-col items-center justify-center px-2 py-1", isActive('/recordings') ? "text-primary" : "text-muted-foreground")}>
          <Camera size={20} className="mb-1" />
          <span className="text-xs">Media</span>
        </Link>
        <div className="flex flex-col items-center justify-center px-2 py-1" onClick={handleOpenMetronome}>
          <Clock size={20} className="mb-1 text-glee-purple" />
          <span className="text-xs">Metronome</span>
        </div>
        <Link to="/sheet-music" className={cn("flex flex-col items-center justify-center px-2 py-1", isActive('/sheet-music') ? "text-primary" : "text-muted-foreground")}>
          <BookOpen size={20} className="mb-1" />
          <span className="text-xs">Music</span>
        </Link>
        <Link to="/members" className={cn("flex flex-col items-center justify-center px-2 py-1", isActive('/members') ? "text-primary" : "text-muted-foreground")}>
          <Users size={20} className="mb-1" />
          <span className="text-xs">Members</span>
        </Link>
      </nav>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogContent className="sm:max-w-md">
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
