
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BasicMetronome } from "../BasicMetronome";

export function BasicMetronomeDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem 
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center gap-2"
      >
        <Clock className="h-4 w-4" />
        Metronome
      </DropdownMenuItem>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Metronome</DialogTitle>
          </DialogHeader>
          <BasicMetronome onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
