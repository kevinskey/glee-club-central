
import React, { useRef } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { PitchPipe } from "@/components/glee-tools/PitchPipe";
import { Metronome } from "@/components/glee-tools/Metronome";
import { AudioRecorder } from "@/components/glee-tools/AudioRecorder";
import { PianoKeyboard } from "@/components/glee-tools/PianoKeyboard";
import { createAudioContext } from "@/utils/audioUtils";

interface MobileToolDialogsProps {
  pitchPipeOpen: boolean;
  metronomeOpen: boolean;
  audioRecorderOpen: boolean;
  pianoKeyboardOpen: boolean;
  setPitchPipeOpen: (open: boolean) => void;
  setMetronomeOpen: (open: boolean) => void;
  setAudioRecorderOpen: (open: boolean) => void;
  setPianoKeyboardOpen: (open: boolean) => void;
}

export function MobileToolDialogs({
  pitchPipeOpen,
  metronomeOpen,
  audioRecorderOpen,
  pianoKeyboardOpen,
  setPitchPipeOpen,
  setMetronomeOpen,
  setAudioRecorderOpen,
  setPianoKeyboardOpen
}: MobileToolDialogsProps) {
  // Create shared audio context that can be used by all tools
  // This helps reduce the total number of audio contexts created
  const sharedAudioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize the audio context when needed
  const getSharedAudioContext = () => {
    if (!sharedAudioContextRef.current) {
      try {
        sharedAudioContextRef.current = createAudioContext();
        console.log('Created shared audio context:', sharedAudioContextRef.current.state);
      } catch (e) {
        console.error('Failed to create shared audio context:', e);
      }
    }
    return sharedAudioContextRef.current;
  };
  
  // Initialize audio on dialog open
  const handleDialogOpen = (isOpen: boolean) => {
    if (isOpen) {
      const ctx = getSharedAudioContext();
      // Try to resume the context - this needs to happen in response to a user interaction
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(e => console.error('Failed to resume audio context:', e));
      }
    }
  };

  return (
    <>
      {/* Pitch Pipe Dialog */}
      <Dialog 
        open={pitchPipeOpen} 
        onOpenChange={(open) => {
          handleDialogOpen(open);
          setPitchPipeOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md" onPointerDown={() => getSharedAudioContext()?.resume()}>
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <PitchPipe 
            onClose={() => setPitchPipeOpen(false)} 
            audioContextRef={sharedAudioContextRef} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Metronome Dialog */}
      <Dialog 
        open={metronomeOpen} 
        onOpenChange={(open) => {
          handleDialogOpen(open);
          setMetronomeOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md" onPointerDown={() => getSharedAudioContext()?.resume()}>
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <Metronome onClose={() => setMetronomeOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Piano Keyboard Dialog */}
      <Dialog 
        open={pianoKeyboardOpen} 
        onOpenChange={(open) => {
          handleDialogOpen(open);
          setPianoKeyboardOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-auto" onPointerDown={() => getSharedAudioContext()?.resume()}>
          <DialogHeader>
            <DialogTitle>Piano Keyboard</DialogTitle>
          </DialogHeader>
          <PianoKeyboard 
            onClose={() => setPianoKeyboardOpen(false)} 
            audioContextRef={sharedAudioContextRef}
          />
        </DialogContent>
      </Dialog>
      
      {/* Audio Recorder Dialog */}
      <Dialog 
        open={audioRecorderOpen} 
        onOpenChange={(open) => {
          handleDialogOpen(open);
          setAudioRecorderOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md" onPointerDown={() => getSharedAudioContext()?.resume()}>
          <DialogHeader>
            <DialogTitle>Recording Studio</DialogTitle>
          </DialogHeader>
          <AudioRecorder 
            onClose={() => setAudioRecorderOpen(false)} 
            audioContextRef={sharedAudioContextRef}
          />
        </DialogContent>
      </Dialog>
      
      {/* Event handlers for unmounting to clean up shared audio context */}
      {React.useEffect(() => {
        return () => {
          if (sharedAudioContextRef.current && !pitchPipeOpen && !metronomeOpen && 
              !audioRecorderOpen && !pianoKeyboardOpen) {
            try {
              sharedAudioContextRef.current.close().catch(console.error);
              sharedAudioContextRef.current = null;
            } catch (e) {
              // Ignore cleanup errors
            }
          }
        };
      }, [pitchPipeOpen, metronomeOpen, audioRecorderOpen, pianoKeyboardOpen])}
    </>
  );
}
