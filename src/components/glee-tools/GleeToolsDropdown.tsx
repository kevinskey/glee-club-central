
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

// Import our refactored dialog components
import { PitchPipeDialog } from "./dialogs/PitchPipeDialog";
import { MetronomeDialog } from "./dialogs/MetronomeDialog";
import { PianoKeyboardDialog } from "./dialogs/PianoKeyboardDialog";
import { RecordingStudioDialog } from "./dialogs/RecordingStudioDialog";
import { AboutGleeToolsItem } from "./dialogs/AboutGleeToolsItem";
import { useAudioContext } from "@/hooks/use-audio-context";

export function GleeToolsDropdown() {
  const { audioContextRef, initializeAudioContext } = useAudioContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={initializeAudioContext}
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
        className="w-56 !bg-popover !text-popover-foreground border border-border shadow-md"
        style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}
      >
        <DropdownMenuLabel className="font-semibold text-popover-foreground">Glee Tools</DropdownMenuLabel>
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
