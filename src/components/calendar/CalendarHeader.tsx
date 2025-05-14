
import { Button } from "@/components/ui/button";
import { Calendar, CalendarPlus, ViewIcon } from "lucide-react";
import { CalendarSyncButton } from "./CalendarSyncButton";

interface CalendarHeaderProps {
  onAddEvent: () => void;
  view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek') => void;
  userCanCreate: boolean;
}

export function CalendarHeader({ 
  onAddEvent, 
  view, 
  onViewChange,
  userCanCreate
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
      <div className="flex items-center">
        <Calendar className="h-6 w-6 mr-2" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            View and manage upcoming events and performances.
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Sync Calendar Button */}
        <CalendarSyncButton />
        
        {/* View options */}
        <div className="hidden md:flex border rounded-md">
          <Button
            variant={view === 'dayGridMonth' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('dayGridMonth')}
            className="rounded-r-none"
          >
            Month
          </Button>
          <Button
            variant={view === 'timeGridWeek' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('timeGridWeek')}
            className="rounded-none border-x"
          >
            Week
          </Button>
          <Button
            variant={view === 'timeGridDay' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('timeGridDay')}
            className="rounded-l-none"
          >
            Day
          </Button>
        </div>
        
        {/* Add Event button (if user has permission) */}
        {userCanCreate && (
          <Button onClick={onAddEvent} className="bg-glee-purple hover:bg-glee-purple/90">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
      </div>
    </div>
  );
}
