
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SimpleMetronome } from "../SimpleMetronome";

export function SimpleMetronomeDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem 
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center gap-2 text-popover-foreground"
      >
        <Clock className="h-4 w-4" />
        Metronome
      </DropdownMenuItem>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <SimpleMetronome onClose={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
