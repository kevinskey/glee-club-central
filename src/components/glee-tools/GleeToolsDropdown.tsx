
import React, { useState, useRef } from "react";
import { Headphones, Piano, Mic, Clock, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { PitchPipe } from "./PitchPipe";
import { Metronome } from "./Metronome";
import { AudioRecorder } from "./AudioRecorder";

export function GleeToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);
  const [pitchPipeOpen, setPitchPipeOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const [audioRecorderOpen, setAudioRecorderOpen] = useState(false);

  // Initialize audio context on first interaction
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
        
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(console.error);
        }
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
        toast.error("Could not initialize audio. Please check browser permissions.");
      }
    }
  };

  const handleHeadphonesClick = () => {
    initAudioContext();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleHeadphonesClick}
          >
            <Headphones className="h-5 w-5" />
            <span className="sr-only">Glee Tools</span>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-glee-columbia"></span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Glee Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setPitchPipeOpen(true)}>
            <Music className="h-4 w-4 mr-2" />
            Pitch Pipe
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setMetronomeOpen(true)}>
            <Clock className="h-4 w-4 mr-2" />
            Metronome
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setAudioRecorderOpen(true)}>
            <Piano className="h-4 w-4 mr-2" />
            Piano & Recording
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => toast.info("Glee Tools v1.0 - Music Practice Suite")}
            className="cursor-pointer"
          >
            About Glee Tools
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Pitch Pipe Dialog */}
      <Dialog open={pitchPipeOpen} onOpenChange={setPitchPipeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <PitchPipe onClose={() => setPitchPipeOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <Metronome onClose={() => setMetronomeOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Audio Recorder Dialog */}
      <Dialog open={audioRecorderOpen} onOpenChange={setAudioRecorderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Piano & Recording Studio</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <AudioRecorder onClose={() => setAudioRecorderOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
