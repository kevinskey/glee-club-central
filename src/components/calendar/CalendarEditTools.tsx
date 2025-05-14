
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarEditToolsProps {
  onAddEvent: () => void;
  selectedEventId: string | null | undefined;
  onEditSelected: () => void;
  onDeleteSelected: () => void;
  className?: string;
}

export function CalendarEditTools({
  onAddEvent,
  selectedEventId,
  onEditSelected,
  onDeleteSelected,
  className = "",
}: CalendarEditToolsProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className={`p-2 flex gap-2 border-2 border-glee-purple/30 ${className}`}>
      <Button onClick={onAddEvent} className="bg-glee-purple hover:bg-glee-purple/90 font-medium">
        <CalendarPlus className="mr-2 h-5 w-5" />
        Add Event
      </Button>
      
      {selectedEventId && (
        <>
          <Button onClick={onEditSelected} variant="outline" className="border-glee-purple/30 hover:bg-glee-purple/10">
            <Edit className="mr-2 h-5 w-5" />
            Edit
          </Button>
          <Button onClick={onDeleteSelected} variant="destructive">
            <Trash2 className="mr-2 h-5 w-5" />
            Delete
          </Button>
        </>
      )}
    </Card>
  );
}
