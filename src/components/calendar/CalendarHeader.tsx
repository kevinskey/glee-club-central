
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  LayoutGrid, 
  LayoutList,
  Clock
} from "lucide-react";

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onAddEvent: () => void;
  userCanCreate: boolean;
}

export function CalendarHeader({ view, onViewChange, onAddEvent, userCanCreate }: CalendarHeaderProps) {
  const viewOptions = [
    { id: 'dayGridMonth', label: 'Month', icon: <LayoutGrid className="h-4 w-4" /> },
    { id: 'timeGridWeek', label: 'Week', icon: <Calendar className="h-4 w-4" /> },
    { id: 'timeGridDay', label: 'Day', icon: <Clock className="h-4 w-4" /> },
    { id: 'listWeek', label: 'Agenda', icon: <LayoutList className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-glee-spelman" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Calendar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Glee Club events, rehearsals and performances
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="flex w-full sm:w-auto bg-gray-100 dark:bg-gray-800 rounded-md p-1">
          {viewOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              className={`${
                view === option.id 
                  ? 'bg-white dark:bg-gray-700 text-glee-spelman shadow-sm' 
                  : 'bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => onViewChange(option.id)}
            >
              {option.icon}
              <span className="hidden sm:inline-block ml-1">{option.label}</span>
            </Button>
          ))}
        </div>
        
        {userCanCreate && (
          <Button 
            onClick={onAddEvent}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
      </div>
    </div>
  );
}
