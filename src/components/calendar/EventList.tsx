
import React from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { EventItem } from "./EventItem";

interface EventListProps {
  date: Date | undefined;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent) => void;
  getEventTypeColor: (type: string) => string;
}

export const EventList = ({
  date,
  events,
  selectedEvent,
  onSelectEvent,
  getEventTypeColor
}: EventListProps) => {
  if (!date) return null;

  return (
    <div className="mb-4">
      <h2 className="text-xl font-medium mb-1">
        Events on {format(date, 'MMMM d, yyyy')}
      </h2>
      {events.length === 0 ? (
        <p className="text-muted-foreground">No events scheduled for this date.</p>
      ) : (
        <div className="space-y-4 mt-4">
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              isSelected={selectedEvent?.id === event.id}
              onSelect={onSelectEvent}
              typeColor={getEventTypeColor(event.type)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
