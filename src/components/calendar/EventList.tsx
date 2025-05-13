
import React from "react";
import { format, isSameDay } from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { EventItem } from "./EventItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventListProps {
  date: Date | undefined;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent) => void;
  getEventTypeColor: (type: string) => string;
}

export const EventList = React.memo(({
  date,
  events,
  selectedEvent,
  onSelectEvent,
  getEventTypeColor
}: EventListProps) => {
  const isMobile = useIsMobile();
  
  if (!date) return null;

  // Filter events for the selected date using isSameDay
  const eventsOnSelectedDate = events.filter(event => 
    isSameDay(event.start, date)
  );

  return (
    <div className="mb-4">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-2 md:mb-3 text-gray-800 dark:text-white`}>
        Events on {format(date, isMobile ? 'MMM d, yyyy' : 'MMMM d, yyyy')}
      </h2>
      {eventsOnSelectedDate.length === 0 ? (
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">No events scheduled for this date.</p>
      ) : (
        <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
          {eventsOnSelectedDate.map((event) => (
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
}, (prevProps, nextProps) => {
  // Implement custom compare function for memoization
  if (!prevProps.date && !nextProps.date) return true;
  if (!prevProps.date || !nextProps.date) return false;
  
  // Compare date values using isSameDay for better comparison
  const dateEqual = isSameDay(prevProps.date, nextProps.date);
  
  // Compare events length
  const eventsLengthEqual = prevProps.events.length === nextProps.events.length;
  
  // Compare selectedEvent
  const selectedEventEqual = 
    (!prevProps.selectedEvent && !nextProps.selectedEvent) ||
    (prevProps.selectedEvent?.id === nextProps.selectedEvent?.id);
  
  // Compare events content if lengths match
  let eventsContentEqual = true;
  if (eventsLengthEqual && prevProps.events.length > 0) {
    eventsContentEqual = prevProps.events.every((event, index) => {
      const nextEvent = nextProps.events[index];
      return event.id === nextEvent.id;
    });
  }
  
  return dateEqual && eventsLengthEqual && selectedEventEqual && eventsContentEqual;
});

EventList.displayName = "EventList";
