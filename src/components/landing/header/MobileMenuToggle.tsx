
import React from "react";
import { Menu, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenuToggle({ isOpen, onToggle }: MobileMenuToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={onToggle}
            className="p-2 text-foreground"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOpen ? "Close menu" : "Open menu"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
