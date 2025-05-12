
import React from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState, useRef } from "react";

export function Logo() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
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
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <Icons.logo className={`${isMobile ? "h-8" : "h-6"} w-auto`} />
              <span className={`font-playfair ${isMobile ? "text-xl" : "text-lg"} font-semibold text-foreground`}>
                Glee World
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to homepage</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 -mr-1" onClick={handleOpenMetronome}>
            <Clock className="h-4 w-4 text-foreground" />
            <span className="sr-only">Open metronome</span>
          </Button>
        </DialogTrigger>
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
    </div>
  );
}
