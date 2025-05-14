
import React, { useState, useEffect, useRef } from "react";
import { CalendarEvent } from "@/types/calendar";
import { format, isToday, isTomorrow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIntersection } from "@/hooks/use-intersection";
import { CalendarClock, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UpcomingEventsListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  className?: string;
  initialLimit?: number;
  increment?: number;
  maxHeight?: string;
}

export function UpcomingEventsList({ 
  events, 
  onEventClick, 
  className = "",
  initialLimit = 5,
  increment = 5,
  maxHeight = "400px"
}: UpcomingEventsListProps) {
  const [visibleEvents, setVisibleEvents] = useState<CalendarEvent[]>([]);
  const [limit, setLimit] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  });
  
  // Format the event date for display
  const formatEventDate = (date: string | Date) => {
    const eventDate = new Date(date);
    
    if (isToday(eventDate)) {
      return "Today";
    } else if (isTomorrow(eventDate)) {
      return "Tomorrow";
    } else {
      return format(eventDate, 'EEE, MMM d');
    }
  };
  
  // Get event type color
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'concert':
        return 'bg-glee-purple text-white';
      case 'rehearsal':
        return 'bg-blue-500 text-white';
      case 'sectional':
        return 'bg-green-500 text-white';
      case 'special':
        return 'bg-amber-500 text-white';
      case 'tour':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Load more events when intersection observer triggers
  useEffect(() => {
    if (entry?.isIntersecting && visibleEvents.length < events.length && !isLoading) {
      setIsLoading(true);
      
      // Simulate loading delay (remove in production if not needed)
      setTimeout(() => {
        setLimit(prevLimit => prevLimit + increment);
        setIsLoading(false);
      }, 300);
    }
  }, [entry, events.length, increment, isLoading, visibleEvents.length]);
  
  // Update visible events when limit changes or events change
  useEffect(() => {
    setVisibleEvents(events.slice(0, limit));
  }, [events, limit]);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-2">
        <ScrollArea className={`h-[${maxHeight}]`} style={{ height: maxHeight }}>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No upcoming events scheduled
            </p>
          ) : (
            <div className="space-y-3 pr-2">
              {visibleEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-3 p-2 rounded-md border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-md bg-muted">
                    <span className="text-xs font-medium">{format(new Date(event.start), "MMM")}</span>
                    <span className="text-lg font-bold">{format(new Date(event.start), "dd")}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatEventDate(event.start)}
                      {event.time && ` • ${event.time}`}
                      {event.location && ` • ${event.location}`}
                    </p>
                  </div>
                  
                  <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
              ))}
              
              {/* Loading indicator and intersection observer element */}
              <div 
                ref={ref} 
                className="flex justify-center py-2"
                style={{ display: visibleEvents.length >= events.length ? 'none' : 'flex' }}
              >
                {isLoading && (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
