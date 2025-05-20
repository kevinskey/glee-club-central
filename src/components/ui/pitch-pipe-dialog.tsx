
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Music } from "lucide-react";
import { PitchPipe } from "@/components/glee-tools/PitchPipe";

interface PitchPipeDialogProps {
  triggerClassName?: string;
}

export function PitchPipeDialog({ triggerClassName }: PitchPipeDialogProps) {
  const [open, setOpen] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  // Initialize audio context on first open
  const handleOpenDialog = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
      }
    }
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label="Open pitch pipe"
          onClick={handleOpenDialog}
        >
          <Music className="h-5 w-5 text-foreground" />
          <span className="sr-only">Pitch Pipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pitch Pipe</DialogTitle>
        </DialogHeader>
        <PitchPipe onClose={() => setOpen(false)} audioContextRef={audioContextRef} />
      </DialogContent>
    </Dialog>
  );
}
