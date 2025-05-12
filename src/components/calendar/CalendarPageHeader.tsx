
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Metronome } from "@/components/ui/metronome";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
}

export const CalendarPageHeader = ({ onAddEventClick }: CalendarPageHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mb-3 sm:mb-0 self-start h-7 sm:h-8 px-2"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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
          {!isMobile && <Metronome />}
        </h1>
        
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
      </div>

      {/* Mobile Add Event Button */}
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
    </>
  );
};
