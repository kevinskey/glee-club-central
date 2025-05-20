
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label="Open pitch pipe"
        >
          <Music className="h-5 w-5 text-foreground" />
          <span className="sr-only">Pitch Pipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pitch Pipe</DialogTitle>
        </DialogHeader>
        <PitchPipe showControls={true} size="md" />
      </DialogContent>
    </Dialog>
  );
}
