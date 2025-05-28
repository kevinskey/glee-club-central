
import React from "react";
import { Info } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AboutGleeToolsItem() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer flex items-center gap-2">
        <Info className="h-4 w-4" />
        About Glee Tools
      </DropdownMenuItem>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About Glee Tools</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Essential music tools for choir members:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Pitch Pipe:</strong> Play chromatic notes to find your starting pitch</li>
              <li><strong>Metronome:</strong> Keep steady tempo during practice</li>
            </ul>
            <p className="text-muted-foreground">Built for Spelman College Glee Club</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
