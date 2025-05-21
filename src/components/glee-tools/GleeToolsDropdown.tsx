
import React, { useRef } from "react";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Import our refactored dialog components
import { PitchPipeDialog } from "./dialogs/PitchPipeDialog";
import { MetronomeDialog } from "./dialogs/MetronomeDialog";
import { PianoKeyboardDialog } from "./dialogs/PianoKeyboardDialog";
import { RecordingStudioDialog } from "./dialogs/RecordingStudioDialog";
import { AboutGleeToolsItem } from "./dialogs/AboutGleeToolsItem";

export function GleeToolsDropdown() {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={initAudioContext}
        >
          <Headphones className="h-5 w-5" />
          <span className="sr-only">Glee Tools</span>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-glee-columbia"></span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-popover shadow-lg border border-border"
      >
        <DropdownMenuLabel className="font-semibold">Glee Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Import our dialog components */}
        <PitchPipeDialog audioContextRef={audioContextRef} />
        <MetronomeDialog audioContextRef={audioContextRef} />
        <PianoKeyboardDialog audioContextRef={audioContextRef} />
        <RecordingStudioDialog audioContextRef={audioContextRef} />
        
        <DropdownMenuSeparator />
        <AboutGleeToolsItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
