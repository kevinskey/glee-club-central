
import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";

interface EventItemProps {
  event: CalendarEvent;
  isSelected: boolean;
  onSelect: (event: CalendarEvent) => void;
  typeColor: string;
}

// Using memo to prevent unnecessary re-renders
export const EventItem = memo(({
  event,
  isSelected,
  onSelect,
  typeColor
}: EventItemProps) => (
  <div
    key={event.id}
    className={`p-4 border rounded-lg cursor-pointer ${
      isSelected
        ? 'border-glee-purple bg-glee-purple/5'
        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
    }`}
    onClick={() => onSelect(event)}
  >
    <div className="flex justify-between items-start">
      <h3 className="font-medium text-lg">{event.title}</h3>
      <Badge className={`${typeColor} text-white`}>
        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      </Badge>
    </div>
    <div className="mt-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1 mb-1">
        <Clock className="h-4 w-4" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        <span>{event.location}</span>
      </div>
    </div>
    {isSelected && (
      <p className="mt-3 text-sm">{event.description}</p>
    )}
  </div>
));

EventItem.displayName = "EventItem";
