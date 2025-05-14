
import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar } from "lucide-react";
import { CalendarSyncButton } from "./CalendarSyncButton";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
}

export function CalendarPageHeader({ onAddEventClick }: CalendarPageHeaderProps) {
  return (
    <div className="space-y-2 mb-2 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          View and manage upcoming events and performances
        </p>
        <div className="flex gap-2 items-center justify-center mt-2">
          <CalendarSyncButton size="sm" />
          <Button 
            size="md" 
            onClick={onAddEventClick} 
            className="bg-glee-purple hover:bg-glee-purple/90 px-4"
          >
            <CalendarPlus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </div>
    </div>
  );
}
