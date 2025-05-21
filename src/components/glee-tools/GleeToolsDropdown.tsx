
import React, { useState, useRef } from "react";
import { Headphones, Piano, Mic, Clock, Music, LogIn } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PitchPipe } from "./PitchPipe";
import { Metronome } from "./Metronome";
import { AudioRecorder } from "./AudioRecorder";
import { PianoKeyboard } from "./PianoKeyboard";

export function GleeToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);
  const [pitchPipeOpen, setPitchPipeOpen] = useState(false);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const [audioRecorderOpen, setAudioRecorderOpen] = useState(false);
  const [pianoKeyboardOpen, setPianoKeyboardOpen] = useState(false);
  const [authCheckDialogOpen, setAuthCheckDialogOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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

  // Check authentication before opening recording studio
  const handleOpenRecordingStudio = () => {
    if (isAuthenticated && user) {
      setAudioRecorderOpen(true);
    } else {
      setAuthCheckDialogOpen(true);
    }
  };

  // Go to login page with recording intent
  const handleGoToLogin = () => {
    setAuthCheckDialogOpen(false);
    navigate('/login?returnTo=/dashboard/recording-studio&intent=recording');
  };

  // Go to dashboard recording studio
  const handleGoToDashboardStudio = () => {
    setAuthCheckDialogOpen(false);
    navigate('/dashboard/recording-studio');
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
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-popover shadow-lg border border-border"
        >
          <DropdownMenuLabel className="font-semibold">Glee Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setPitchPipeOpen(true)}>
            <Music className="h-4 w-4 mr-2" />
            Pitch Pipe
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setMetronomeOpen(true)}>
            <Clock className="h-4 w-4 mr-2" />
            Metronome
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setPianoKeyboardOpen(true)}>
            <Piano className="h-4 w-4 mr-2" />
            Piano Keyboard (3 Octaves)
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleOpenRecordingStudio}>
            <Mic className="h-4 w-4 mr-2" />
            Recording Studio
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => toast.info("Glee Tools v1.1 - Music Practice Suite")}
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
      
      {/* Piano Keyboard Dialog */}
      <Dialog open={pianoKeyboardOpen} onOpenChange={setPianoKeyboardOpen}>
        <DialogContent className="sm:max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Piano Keyboard</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <PianoKeyboard onClose={() => setPianoKeyboardOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Audio Recorder Dialog */}
      <Dialog open={audioRecorderOpen} onOpenChange={setAudioRecorderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recording Studio</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <AudioRecorder 
              onClose={() => setAudioRecorderOpen(false)} 
              audioContextRef={audioContextRef}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Authentication Check Dialog */}
      <Dialog open={authCheckDialogOpen} onOpenChange={setAuthCheckDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              You need to be logged in to save recordings. Would you like to:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="default" 
                className="flex-1" 
                onClick={handleGoToLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={handleGoToDashboardStudio}
              >
                <Mic className="mr-2 h-4 w-4" />
                Go to Dashboard Studio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
