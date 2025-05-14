
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';

export interface EventListProps {
  events: CalendarEvent[];
  emptyMessage: string;
}

export const EventList: React.FC<EventListProps> = ({ events, emptyMessage }) => {
  if (events.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        // Convert start to Date if it's a string
        const startDate = typeof event.start === 'string' 
          ? new Date(event.start) 
          : event.start;
        
        return (
          <div key={event.id} className="p-3 border rounded-md bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-primary/10 p-2 flex-shrink-0">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm sm:text-base text-foreground truncate">
                  {event.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                  <span>
                    {format(startDate, 'MMM d, yyyy')}
                    {!event.allDay && ` • ${format(startDate, 'h:mm a')}`}
                  </span>
                  {event.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{event.location}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
