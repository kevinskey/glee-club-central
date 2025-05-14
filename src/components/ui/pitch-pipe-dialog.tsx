
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PitchPipe } from '@/components/ui/pitch-pipe';
import { Button } from '@/components/ui/button';
import { Music2 } from 'lucide-react';

interface PitchPipeDialogProps {
  triggerClassName?: string;
}

export function PitchPipeDialog({ triggerClassName }: PitchPipeDialogProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => {
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
    
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={triggerClassName}
          onClick={handleOpen}
        >
          <Music2 className="h-5 w-5 text-foreground" />
          <span className="sr-only">Pitch Pipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pitch Pipe</DialogTitle>
        </DialogHeader>
        <PitchPipe size="md" audioContextRef={audioContextRef} />
      </DialogContent>
    </Dialog>
  );
}
