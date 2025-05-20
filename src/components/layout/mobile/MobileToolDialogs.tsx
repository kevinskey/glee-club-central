
import React from "react";
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
  return (
    <>
      {/* Pitch Pipe Dialog */}
      <Dialog open={pitchPipeOpen} onOpenChange={setPitchPipeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <PitchPipe onClose={() => setPitchPipeOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Metronome Dialog */}
      <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <Metronome onClose={() => setMetronomeOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Piano Keyboard Dialog */}
      <Dialog open={pianoKeyboardOpen} onOpenChange={setPianoKeyboardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Piano Keyboard</DialogTitle>
          </DialogHeader>
          <PianoKeyboard onClose={() => setPianoKeyboardOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Audio Recorder Dialog */}
      <Dialog open={audioRecorderOpen} onOpenChange={setAudioRecorderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recording Studio</DialogTitle>
          </DialogHeader>
          <AudioRecorder onClose={() => setAudioRecorderOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
