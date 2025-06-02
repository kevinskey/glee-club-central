
import React from 'react';
import { CalendarEvent } from '@/types/calendar';

export interface CalendarViewProps {
  view?: 'month' | 'week' | 'day';
  date?: Date;
  onEventClick?: (event: any) => void;
  events?: CalendarEvent[];
  showPrivateEvents?: boolean;
}

export function CalendarView({ 
  view = 'month', 
  date = new Date(), 
  onEventClick = () => {},
  events = [],
  showPrivateEvents = false 
}: CalendarViewProps) {
  return (
    <div className="calendar-view">
      <p className="text-center text-muted-foreground mb-4">
        Calendar view for {view} view on {date.toDateString()}
      </p>
      
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event, index) => (
            <div
              key={event.id || index}
              className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => onEventClick(event)}
            >
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(event.start_time).toLocaleDateString()}
              </p>
              {event.short_description && (
                <p className="text-sm mt-1">{event.short_description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No events found for this period</p>
        </div>
      )}
    </div>
  );
}
