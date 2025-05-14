
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { CalendarSyncButton } from "./CalendarSyncButton";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
}

export function CalendarPageHeader({ onAddEventClick }: CalendarPageHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center mb-2">Calendar</h1>
      
      <div className="flex gap-2 items-center justify-center">
        <CalendarSyncButton size="sm" />
        <Button 
          size="default" 
          onClick={onAddEventClick} 
          className="bg-glee-purple hover:bg-glee-purple/90 px-4"
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  );
}
