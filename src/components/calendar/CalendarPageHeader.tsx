
import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar } from "lucide-react";
import { CalendarSyncButton } from "./CalendarSyncButton";

interface CalendarPageHeaderProps {
  onAddEventClick: () => void;
}

export function CalendarPageHeader({ onAddEventClick }: CalendarPageHeaderProps) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <h1 className="text-xl font-bold">Calendar</h1>
        </div>
        <div className="flex gap-2">
          <CalendarSyncButton size="sm" />
          <Button 
            size="sm" 
            onClick={onAddEventClick} 
            className="bg-glee-purple hover:bg-glee-purple/90"
          >
            <CalendarPlus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        View and manage upcoming events and performances
      </p>
    </div>
  );
}
