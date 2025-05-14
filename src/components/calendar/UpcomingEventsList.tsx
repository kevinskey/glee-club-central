import React from 'react';
import { format, isToday, isTomorrow, addDays, isSameDay } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { CalendarDays, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpcomingEventsListProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

export function UpcomingEventsList({ events, onEventClick, className }: UpcomingEventsListProps) {
  // Get today and sort events by date
  const now = new Date();
  const sortedEvents = [...events]
    .filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= now;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5); // Only show the next 5 events
  
  const formatEventDate = (date: Date | string) => {
    const eventDate = new Date(date);
    
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    
    // If within next 7 days, show day name
    const nextWeek = addDays(now, 7);
    if (eventDate <= nextWeek) {
      return format(eventDate, 'EEEE'); // Day name (Monday, Tuesday, etc)
    }
    
    // Otherwise show full date
    return format(eventDate, 'MMM d, yyyy');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "concert":
        return "bg-glee-purple";
      case "rehearsal":
        return "bg-blue-500";
      case "sectional":
        return "bg-green-500";
      case "special":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  if (sortedEvents.length === 0) {
    return (
      <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center", className)}>
        <CalendarDays className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-muted-foreground">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow", className)}>
      <h3 className="font-medium text-lg px-4 pt-3 pb-2 border-b flex items-center">
        <CalendarDays className="h-5 w-5 mr-2 text-glee-purple" />
        Upcoming Events
      </h3>
      <ul className="divide-y">
        {sortedEvents.map((event) => {
          const eventDate = new Date(event.start);
          const colorClass = getEventTypeColor(event.type);
          
          return (
            <li 
              key={event.id} 
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-center">
                <div className={cn("h-10 w-2 rounded-sm mr-3", colorClass)} />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <div className="mr-3">{formatEventDate(eventDate)}</div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(eventDate, 'h:mm a')}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
