
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarPlus, Edit, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  className = ""
}: CalendarEditToolsProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className={`p-1 flex gap-1 border border-glee-purple/30 ${className}`}>
      <Button onClick={onAddEvent} className="bg-glee-purple hover:bg-glee-purple/90 font-medium p-1 h-auto text-xs" size="sm">
        <CalendarPlus className="h-3.5 w-3.5 mr-1" />
        Add Event
      </Button>
      
      {selectedEventId && onEditSelected && (
        <Button 
          onClick={onEditSelected} 
          variant="outline"
          size="sm"
          className="p-1 h-auto text-xs"
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      )}
      
      {selectedEventId && onDeleteSelected && (
        <Button 
          onClick={onDeleteSelected} 
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto text-xs"
        >
          <Trash className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      )}
    </Card>
  );
}
