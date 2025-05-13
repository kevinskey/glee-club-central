
import React, { useState, useEffect } from "react";
import { Clock as ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";

interface ClockProps {
  showTime?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Clock = ({ showTime = false, size = "md" }: ClockProps) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  
  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
  
  // Determine the size of the icon and text
  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;
  const textClass = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  
  return (
    <>
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 hover:bg-muted/30 transition-colors"
            onClick={handleOpenMetronome}
          >
            <ClockIcon size={iconSize} className="text-glee-purple" />
            {showTime && (
              <span className={`${textClass} font-mono`}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <EnhancedMetronome showControls={true} size="md" audioContextRef={audioContextRef} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Clock;
