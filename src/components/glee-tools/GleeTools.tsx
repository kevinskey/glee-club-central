
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Music, Clock, Headphones } from "lucide-react";
import { registerKeyboardShortcut } from "@/utils/audioUtils";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our basic implementations
import { BasicPitchPipe } from "./BasicPitchPipe";
import { BasicMetronome } from "./BasicMetronome";

export interface GleeToolsProps {
  variant?: "default" | "minimal";
  className?: string;
}

export function GleeTools({ variant = "default", className = "" }: GleeToolsProps) {
  const [pitchPipeOpen, setPitchPipeOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first interaction
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
        
        // Resume audio context if it's suspended (mobile browsers often require this)
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(console.error);
        }
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
        toast.error("Could not initialize audio. Please check browser permissions.");
      }
    }
  };
  
  // Register keyboard shortcuts
  useEffect(() => {
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
  
  // Handle opening the pitch pipe
  const handleOpenPitchPipe = () => {
    initAudioContext();
    setPitchPipeOpen(true);
  };
  
  // Handle opening the metronome
  const handleOpenMetronome = () => {
    initAudioContext();
    setMetronomeOpen(true);
  };

  // Render the tools based on the variant
  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleOpenPitchPipe}
          className="h-8 w-8 rounded-full"
          title="Pitch Pipe (P)"
        >
          <Music className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleOpenMetronome}
          className="h-8 w-8 rounded-full"
          title="Metronome (M)"
        >
          <Clock className="h-4 w-4" />
        </Button>
        
        {/* Pitch Pipe Dialog */}
        <Dialog open={pitchPipeOpen} onOpenChange={setPitchPipeOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pitch Pipe</DialogTitle>
            </DialogHeader>
            <BasicPitchPipe onClose={() => setPitchPipeOpen(false)} />
          </DialogContent>
        </Dialog>
        
        {/* Metronome Dialog */}
        <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Metronome</DialogTitle>
            </DialogHeader>
            <BasicMetronome onClose={() => setMetronomeOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="outline"
        size="sm" 
        onClick={handleOpenPitchPipe}
        className="flex items-center gap-1"
      >
        <Music className="h-4 w-4" />
        <span className={isMobile ? "sr-only" : ""}>Pitch Pipe</span>
      </Button>
      
      <Button 
        variant="outline"
        size="sm" 
        onClick={handleOpenMetronome}
        className="flex items-center gap-1"
      >
        <Clock className="h-4 w-4" />
        <span className={isMobile ? "sr-only" : ""}>Metronome</span>
      </Button>
      
      {/* Pitch Pipe Dialog */}
      <Dialog open={pitchPipeOpen} onOpenChange={setPitchPipeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <BasicPitchPipe onClose={() => setPitchPipeOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <BasicMetronome onClose={() => setMetronomeOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
