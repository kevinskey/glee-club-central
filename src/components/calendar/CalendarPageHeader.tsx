
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarPlus } from "lucide-react";
import { CalendarSyncButton } from "./CalendarSyncButton";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange?: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek') => void;
}

export function CalendarPageHeader({ 
  onAddEventClick,
  view,
  onViewChange
}: CalendarPageHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center mb-2">
        <Calendar className="h-6 w-6 mr-2 text-glee-purple" />
        <h1 className="text-2xl font-bold text-center">Calendar</h1>
      </div>
      
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        {/* View Selection Buttons */}
        {view && onViewChange && (
          <div className="border rounded-md flex w-full max-w-xs mb-2">
            <Button
              variant={view === 'dayGridMonth' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dayGridMonth')}
              className="rounded-r-none flex-1"
            >
              Month
            </Button>
            <Button
              variant={view === 'timeGridWeek' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeGridWeek')}
              className="rounded-none border-x flex-1"
            >
              Week
            </Button>
            <Button
              variant={view === 'timeGridDay' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeGridDay')}
              className="rounded-l-none flex-1"
            >
              Day
            </Button>
          </div>
        )}
      
        <div className="flex gap-2 items-center justify-center w-full">
          <CalendarSyncButton size="sm" />
          <Button 
            size="default" 
            onClick={onAddEventClick} 
            className="bg-glee-purple hover:bg-glee-purple/90 px-4 w-full max-w-[200px]"
          >
            <CalendarPlus className="h-5 w-5 mr-2" />
            Add Event
          </Button>
        </div>
      </div>
    </div>
  );
}
