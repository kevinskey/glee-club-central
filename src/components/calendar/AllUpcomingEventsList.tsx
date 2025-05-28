
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { format, isAfter, startOfDay } from 'date-fns';
import { CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AllUpcomingEventsListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function AllUpcomingEventsList({ events, onEventClick }: AllUpcomingEventsListProps) {
  // Filter for all future events (not just current month)
  const today = startOfDay(new Date());
  
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start);
      return isAfter(eventDate, today) || format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  if (upcomingEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            All Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No upcoming events scheduled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            All Upcoming Events
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {upcomingEvents.length} events
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="rounded-lg border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors" 
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-sm">{event.title}</h3>
                  <div className="flex gap-1">
                    {event.source === 'google' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Google
                      </span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded capitalize">
                      {event.type}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {format(new Date(event.start), 'MMM d, yyyy')}
                  </div>
                  
                  {!event.allDay && (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(new Date(event.start), 'h:mm a')}
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
