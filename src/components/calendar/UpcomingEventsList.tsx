
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UpcomingEventsListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function UpcomingEventsList({ events, onEventClick }: UpcomingEventsListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">No upcoming events scheduled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="px-1">
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-md p-2 cursor-pointer hover:bg-accent"
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start gap-2">
                <div className={`w-1 h-full min-h-[40px] rounded-full ${getEventTypeColor(event.type)}`} />
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="grid grid-cols-1 gap-0.5 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatEventDate(event.start)}
                    </div>
                    {event.time && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(event.time)}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getEventTypeBadgeColor(event.type)}`}>
                  {capitalizeFirstLetter(event.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
const formatEventDate = (date: Date | string): string => {
  const eventDate = typeof date === 'string' ? new Date(date) : date;
  return format(eventDate, 'EEE, MMM d, yyyy');
};

const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return time;
  }
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'concert': return 'bg-glee-purple';
    case 'rehearsal': return 'bg-blue-500';
    case 'sectional': return 'bg-green-500';
    case 'special': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

const getEventTypeBadgeColor = (type: string): string => {
  switch (type) {
    case 'concert': return 'bg-glee-purple/20 text-glee-purple';
    case 'rehearsal': return 'bg-blue-500/20 text-blue-600';
    case 'sectional': return 'bg-green-500/20 text-green-600';
    case 'special': return 'bg-amber-500/20 text-amber-600';
    default: return 'bg-gray-500/20 text-gray-600';
  }
};
