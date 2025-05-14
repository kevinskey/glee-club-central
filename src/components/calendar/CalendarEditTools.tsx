
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import { CalendarResetButton } from './CalendarResetButton';

interface CalendarEditToolsProps {
  onAddEvent: () => void;
  selectedEventId?: string;
  onEditSelected?: () => void;
  onDeleteSelected?: () => Promise<boolean | void>;
  onResetCalendar?: () => Promise<boolean>;
  compact?: boolean;
  className?: string;
}

export function CalendarEditTools({
  onAddEvent,
  selectedEventId,
  onEditSelected,
  onDeleteSelected,
  onResetCalendar,
  compact = false,
  className = ''
}: CalendarEditToolsProps) {
  const { isSuperAdmin } = usePermissions();
  
  const handleDeleteEvent = async () => {
    if (!selectedEventId) {
      toast.error("No event selected");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await onDeleteSelected?.();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
      }
    }
  };
  
  const buttonClassName = compact ? "px-2" : "";
  
  return (
    <Card className={`p-2 flex flex-wrap gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size={compact ? "sm" : "default"}
        onClick={onAddEvent}
        className={buttonClassName}
      >
        <Plus className="h-4 w-4 mr-2" />
        {!compact && "Add Event"}
      </Button>
      
      {selectedEventId && (
        <>
          <Button 
            variant="outline" 
            size={compact ? "sm" : "default"} 
            onClick={onEditSelected}
            disabled={!onEditSelected}
            className={buttonClassName}
          >
            <Pencil className="h-4 w-4 mr-2" />
            {!compact && "Edit"}
          </Button>
          
          <Button 
            variant="outline" 
            size={compact ? "sm" : "default"} 
            onClick={handleDeleteEvent}
            disabled={!onDeleteSelected}
            className={`text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 ${buttonClassName}`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {!compact && "Delete"}
          </Button>
        </>
      )}
      
      {isSuperAdmin && onResetCalendar && (
        <CalendarResetButton 
          onResetCalendar={onResetCalendar}
          variant="outline"
          size={compact ? "sm" : "default"}
          className="ml-auto"
        />
      )}
    </Card>
  );
}
