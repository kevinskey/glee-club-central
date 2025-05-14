
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarPlus, Pencil, Trash2 } from "lucide-react";

interface CalendarEditToolsProps {
  onAddEvent: () => void;
  selectedEventId?: string;
  onEditSelected: () => void;
  onDeleteSelected: () => void;
  className?: string;
}

export function CalendarEditTools({
  onAddEvent,
  selectedEventId,
  onEditSelected,
  onDeleteSelected,
  className,
}: CalendarEditToolsProps) {
  return (
    <Card className={cn("p-2 flex flex-col sm:flex-row items-center gap-2 dark:bg-gray-800/50", className)}>
      <Button onClick={onAddEvent} className="w-full sm:w-auto bg-glee-purple hover:bg-glee-purple/90 dark:bg-glee-purple dark:hover:bg-glee-purple/90">
        <CalendarPlus className="h-4 w-4 mr-2" />
        Add Event
      </Button>
      
      <div className="w-full sm:w-auto flex gap-2 mt-2 sm:mt-0">
        <Button
          variant="outline"
          className="flex-1 sm:flex-auto"
          onClick={onEditSelected}
          disabled={!selectedEventId}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 sm:flex-auto text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
          onClick={onDeleteSelected}
          disabled={!selectedEventId}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
