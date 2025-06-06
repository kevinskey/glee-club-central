
import React from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { format, isSameDay, isToday, isTomorrow } from 'date-fns';

interface EventsListViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export const EventsListView: React.FC<EventsListViewProps> = ({
  events,
  onEventClick
}) => {
  const formatEventDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatEventTime = (startTime: Date, endTime: Date) => {
    const start = format(startTime, 'h:mm a');
    const end = format(endTime, 'h:mm a');
    
    if (isSameDay(startTime, endTime)) {
      return `${start} - ${end}`;
    }
    
    return `${start} - ${format(endTime, 'MMM d, h:mm a')}`;
  };

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Events Found</h3>
        <p className="text-sm text-muted-foreground">
          There are no events to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => {
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);

        return (
          <Card 
            key={event.id} 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onEventClick?.(event)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col space-y-3">
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {event.title}
                    </h3>
                    {event.short_description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.short_description}
                      </p>
                    )}
                  </div>
                  
                  {event.is_private && (
                    <Badge variant="secondary" className="text-xs">
                      Private Event
                    </Badge>
                  )}
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  {/* Date */}
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{formatEventDate(startDate)}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{formatEventTime(startDate, endDate)}</span>
                  </div>

                  {/* Location */}
                  {event.location_name && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.location_name}</span>
                    </div>
                  )}

                  {/* Host */}
                  {event.event_host_name && (
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.event_host_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
