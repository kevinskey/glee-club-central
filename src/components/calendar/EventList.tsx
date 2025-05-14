
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export interface EventListProps {
  events: CalendarEvent[];
  emptyMessage?: string;
  selectedEvent?: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent) => void;
  getEventTypeColor?: (type: string) => string;
  className?: string;
  maxHeight?: string;
  date?: Date;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  emptyMessage = "No events found",
  selectedEvent,
  onSelectEvent,
  getEventTypeColor,
  className = '',
  maxHeight = '500px',
  date
}) => {
  const getDefaultEventTypeColor = (type: string) => {
    switch (type) {
      case 'concert':
        return 'bg-glee-purple hover:bg-glee-purple/90';
      case 'rehearsal':
        return 'bg-blue-500 hover:bg-blue-500/90';
      case 'sectional':
        return 'bg-green-500 hover:bg-green-500/90';
      case 'special':
        return 'bg-amber-500 hover:bg-amber-500/90';
      default:
        return 'bg-gray-500 hover:bg-gray-500/90';
    }
  };

  // Use provided function or fallback to default
  const getEventColor = getEventTypeColor || getDefaultEventTypeColor;
  
  // Filter events by the current date if provided
  const filteredEvents = date 
    ? events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === date.toDateString();
      })
    : events;
    
  // Sort events by date and time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.start).getTime();
    const dateB = new Date(b.start).getTime();
    return dateA - dateB;
  });
  
  if (filteredEvents.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 overflow-auto ${className}`} style={{ maxHeight }}>
      {sortedEvents.map((event) => (
        <Button
          key={event.id}
          variant="outline"
          className={`w-full justify-start text-left ${
            selectedEvent?.id === event.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectEvent(event)}
        >
          <div className="flex items-start gap-2 w-full overflow-hidden">
            <div className={`w-2 self-stretch ${getEventColor(event.type)}`} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{event.title}</h4>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.start), 'MMM d, yyyy')}
                {event.time && ` • ${event.time}`}
              </p>
              {event.location && (
                <p className="text-xs text-muted-foreground truncate">{event.location}</p>
              )}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};
