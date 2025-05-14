
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
  
  if (isMobile) {
    return (
      <div className={`fixed bottom-16 right-4 z-30 ${className}`}>
        <Button
          onClick={onAddEvent}
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg bg-glee-purple hover:bg-glee-purple/90"
        >
          <CalendarPlus className="h-6 w-6" />
        </Button>
      </div>
    );
  }
  
  return (
    <Card className={`p-2 flex gap-2 ${className}`}>
      <Button onClick={onAddEvent} className="bg-glee-purple hover:bg-glee-purple/90">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Add Event
      </Button>
      
      {selectedEventId && (
        <>
          <Button onClick={onEditSelected} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={onDeleteSelected} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </>
      )}
    </Card>
  );
}
