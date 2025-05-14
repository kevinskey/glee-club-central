
import React, { useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { Button } from "@/components/ui/button";
import { resumeAudioContext, audioLogger } from "@/utils/audioUtils";

export function HeaderUtils() {
  const isMobile = useIsMobile();
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context on first interaction
  const handleOpenMetronome = () => {
    // Create AudioContext on first click if it doesn't exist
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
        audioLogger.log('HeaderUtils: Audio context created');
      } catch (e) {
        console.error("Failed to create AudioContext:", e);
      }
    }
    
    // Resume audio context if needed (for mobile browsers)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      resumeAudioContext(audioContextRef.current);
    }
    
    setMetronomeOpen(true);
  };
  
  return (
    <>
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size={isMobile ? "sm" : "icon"}
                  className="flex items-center gap-1"
                  onClick={handleOpenMetronome}
                >
                  <Clock className="h-4 w-4 text-glee-purple" />
                  {!isMobile && <span className="sr-only">Metronome</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open metronome</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <EnhancedMetronome showControls={true} size="md" audioContextRef={audioContextRef} />
        </DialogContent>
      </Dialog>
      
      <ThemeToggle />
    </>
  );
}
