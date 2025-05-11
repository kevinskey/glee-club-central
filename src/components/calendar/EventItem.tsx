
import React from "react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventItemProps {
  event: CalendarEvent;
  isSelected: boolean;
  onSelect: (event: CalendarEvent) => void;
  typeColor: string;
}

export const EventItem = ({ event, isSelected, onSelect, typeColor }: EventItemProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-md transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
        isSelected ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
      )}
      onClick={() => onSelect(event)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm md:text-base font-medium">{event.title}</h3>
          
          <div className="mt-1 space-y-1">
            {event.time && (
              <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1.5" />
                <span>{event.time}</span>
              </div>
            )}
            
            <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-3 w-3 mr-1.5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-2">
          <Button
            variant="ghost"
            size="sm"
            className={`${typeColor} text-white text-xs px-2 py-0.5 h-auto rounded-md`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event);
            }}
          >
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Button>
        </div>
      </div>
    </div>
  );
};
