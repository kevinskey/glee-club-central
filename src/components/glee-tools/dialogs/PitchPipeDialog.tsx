
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Music } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PitchPipe } from "../PitchPipe";

interface PitchPipeDialogProps {
  audioContextRef: React.RefObject<AudioContext | null>;
}

export function PitchPipeDialog({ audioContextRef }: PitchPipeDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem onClick={() => setOpen(true)}>
        <Music className="h-4 w-4 mr-2" />
        Pitch Pipe
      </DropdownMenuItem>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <PitchPipe onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
