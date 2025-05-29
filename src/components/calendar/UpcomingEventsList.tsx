
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { format } from 'date-fns';

interface UpcomingEventsListProps {
  limit?: number;
  eventType?: string;
}

export function UpcomingEventsList({ limit = 5, eventType }: UpcomingEventsListProps) {
  const { events, loading, error } = useCalendarEvents();

  if (loading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error loading events: {error}
      </div>
    );
  }

  // Filter events by type if specified, and get only upcoming events
  const now = new Date();
  const filteredEvents = events
    .filter(event => {
      const eventDate = new Date(event.start_time);
      const isUpcoming = eventDate > now;
      const matchesType = eventType ? event.event_type === eventType : true;
      return isUpcoming && matchesType;
    })
    .slice(0, limit);

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No upcoming {eventType ? eventType.toLowerCase() + 's' : 'events'} at this time.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredEvents.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-glee-purple">{event.title}</h3>
              {event.event_type && (
                <span className="text-xs bg-glee-purple/10 text-glee-purple px-2 py-1 rounded-full">
                  {event.event_type}
                </span>
              )}
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{format(new Date(event.start_time), 'EEE, MMM d')}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{format(new Date(event.start_time), 'h:mm a')}</span>
              </div>
              
              {event.location_name && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location_name}</span>
                </div>
              )}
            </div>
            
            {event.short_description && (
              <p className="text-sm text-gray-700 mt-2">
                {event.short_description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
