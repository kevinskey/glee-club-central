
import React, { useRef, useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Metronome } from "@/components/ui/metronome";
import { BackButton } from "@/components/ui/back-button";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedMetronome } from "@/components/ui/enhanced-metronome";
import { Clock } from "lucide-react";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
}

export const CalendarPageHeader = ({ onAddEventClick }: CalendarPageHeaderProps) => {
  const isMobile = useIsMobile();
  const { isSuperAdmin } = usePermissions();
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context on first interaction
  const handleOpenMetronome = () => {
    // Create AudioContext on first click if it doesn't exist
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch (e) {
        console.error("Failed to create AudioContext:", e);
      }
    }
    
    // Resume audio context if needed (for mobile browsers)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(console.error);
    }
    
    setMetronomeOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
        <BackButton fallbackPath="/dashboard" />
        
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold flex items-center gap-2 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[2.75rem]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-glee-purple" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Calendar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span>Performance <span className="text-glee-purple">Calendar</span></span>
          
          {!isMobile && (
            <Dialog open={metronomeOpen} onOpenChange={setMetronomeOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleOpenMetronome}
                  className="ml-2"
                >
                  <Clock className="h-5 w-5 text-glee-purple" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Metronome</DialogTitle>
                </DialogHeader>
                <EnhancedMetronome showControls={true} size="md" audioContextRef={audioContextRef} />
              </DialogContent>
            </Dialog>
          )}
        </h1>
        
        {isSuperAdmin && (
          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onAddEventClick}
                    className="bg-glee-purple hover:bg-glee-purple/90 text-white hidden sm:flex h-7 sm:h-8 px-2 sm:px-3 text-xs"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Event
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new calendar event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Mobile Add Event Button - Only for super admins */}
      {isSuperAdmin && (
        <div className="flex justify-end sm:hidden mb-3 sm:mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onAddEventClick}
                  className="bg-glee-purple hover:bg-glee-purple/90 w-full sm:w-auto text-white h-8 text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Event
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new calendar event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  );
};
