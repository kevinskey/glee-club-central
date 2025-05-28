
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Music } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BasicPitchPipe } from "../BasicPitchPipe";

interface PitchPipeDialogProps {
  audioContextRef: React.RefObject<AudioContext | null>;
}

export function PitchPipeDialog({ audioContextRef }: PitchPipeDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem 
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center gap-2 text-popover-foreground"
      >
        <Music className="h-4 w-4" />
        Pitch Pipe
      </DropdownMenuItem>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Pitch Pipe</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <BasicPitchPipe onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
