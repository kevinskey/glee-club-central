
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarPlus, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEditToolsProps {
  onAddEvent: () => void;
  selectedEventId?: string;
  onEditSelected?: () => void;
  onDeleteSelected?: () => void;
  className?: string;
}

export function CalendarEditTools({
  onAddEvent,
  selectedEventId,
  onEditSelected,
  onDeleteSelected,
  className
}: CalendarEditToolsProps) {
  const hasSelectedEvent = !!selectedEventId;
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button 
        type="button"
        onClick={onAddEvent} 
        size="sm"
        variant="outline"
        className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Add Event
      </Button>
      
      {hasSelectedEvent && (
        <>
          {onEditSelected && (
            <Button 
              type="button"
              onClick={onEditSelected} 
              size="sm"
              variant="outline"
              className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Selected
            </Button>
          )}
          
          {onDeleteSelected && (
            <Button 
              type="button"
              onClick={onDeleteSelected} 
              size="sm"
              variant="outline"
              className="bg-white hover:bg-gray-100 text-red-500 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
        </>
      )}
    </div>
  );
}
