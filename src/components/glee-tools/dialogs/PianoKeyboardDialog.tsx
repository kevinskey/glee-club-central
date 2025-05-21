
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Piano } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PianoKeyboard } from "../PianoKeyboard";

interface PianoKeyboardDialogProps {
  audioContextRef: React.RefObject<AudioContext | null>;
}

export function PianoKeyboardDialog({ audioContextRef }: PianoKeyboardDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-foreground"
      >
        <Piano className="h-4 w-4" />
        Piano Keyboard (3 Octaves)
      </DropdownMenuItem>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Piano Keyboard</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <PianoKeyboard onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
