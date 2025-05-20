
import React, { useState, useRef } from "react";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuProvider
} from "@/components/ui/dropdown-menu";
import { GleeTools } from "./GleeTools";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function GleeToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first interaction
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
        
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(console.error);
        }
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
        toast.error("Could not initialize audio. Please check browser permissions.");
      }
    }
  };

  const handleHeadphonesClick = () => {
    initAudioContext();
  };

  return (
    <DropdownMenuProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleHeadphonesClick}
          >
            <Headphones className="h-5 w-5" />
            <span className="sr-only">Glee Tools</span>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Glee Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-2">
            <GleeTools variant="minimal" />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => toast.info("Glee Tools v1.0 - Music Practice Suite")}
            className="cursor-pointer"
          >
            About Glee Tools
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenuProvider>
  );
}
