
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
}

export const CalendarPageHeader = ({ onAddEventClick }: CalendarPageHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-0 self-start"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-glee-purple" />
          <span>Performance <span className="text-glee-purple">Calendar</span></span>
        </h1>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <ThemeToggle variant="toggle" size="sm" />
          <Button
            onClick={onAddEventClick}
            className="bg-glee-purple hover:bg-glee-purple/90 hidden sm:flex"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Mobile Add Event Button */}
      <div className="flex justify-end sm:hidden mb-4">
        <Button
          onClick={onAddEventClick}
          className="bg-glee-purple hover:bg-glee-purple/90 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
    </>
  );
};
