
import React, { useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Clock, Music } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { PitchPipe } from '@/components/ui/pitch-pipe';
import { Button } from "@/components/ui/button";
import { resumeAudioContext, audioLogger, registerKeyboardShortcut } from "@/utils/audioUtils";

export function HeaderUtils() {
  const isMobile = useIsMobile();
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const [pitchPipeOpen, setPitchPipeOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context on first interaction
  const initAudioContext = () => {
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
  };
  
  // Handle opening the metronome
  const handleOpenMetronome = () => {
    initAudioContext();
    setMetronomeOpen(true);
  };
  
  // Handle opening the pitch pipe
  const handleOpenPitchPipe = () => {
    initAudioContext();
    setPitchPipeOpen(true);
  };
  
  // Register keyboard shortcuts
  React.useEffect(() => {
    const cleanupP = registerKeyboardShortcut('p', () => {
      setPitchPipeOpen(prev => !prev);
      if (!pitchPipeOpen) initAudioContext();
    });
    
    const cleanupM = registerKeyboardShortcut('m', () => {
      setMetronomeOpen(prev => !prev);
      if (!metronomeOpen) initAudioContext();
    });
    
    const cleanupEsc = registerKeyboardShortcut('Escape', () => {
      setPitchPipeOpen(false);
      setMetronomeOpen(false);
    });
    
    return () => {
      cleanupP();
      cleanupM();
      cleanupEsc();
    };
  }, [pitchPipeOpen, metronomeOpen]);
  
  return (
    <>
      {/* Glee Tools label and button */}
      <div className="flex items-center gap-2">
        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1" 
                  onClick={handleOpenPitchPipe}
                >
                  <Music className="h-4 w-4" />
                  <span>Pitch Pipe</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open pitch pipe (P)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1" 
                  onClick={handleOpenMetronome}
                >
                  <Clock className="h-4 w-4" />
                  <span>Metronome</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open metronome (M)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Mobile view buttons */}
        {isMobile && (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleOpenPitchPipe}
                    className="h-8 w-8"
                  >
                    <Music className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open pitch pipe (P)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleOpenMetronome}
                    className="h-8 w-8"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open metronome (M)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      {/* Pitch Pipe Dialog */}
      <Dialog open={pitchPipeOpen} onOpenChange={setPitchPipeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <PitchPipe size="md" audioContextRef={audioContextRef} />
        </DialogContent>
      </Dialog>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
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
