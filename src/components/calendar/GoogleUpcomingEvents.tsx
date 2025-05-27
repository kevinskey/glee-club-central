
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, RefreshCw } from "lucide-react";
import { fetchGoogleCalendarEvents } from "@/services/googleCalendar";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";

interface GoogleUpcomingEventsProps {
  isConnected: boolean;
  selectedCalendarId?: string;
}

export function GoogleUpcomingEvents({ isConnected, selectedCalendarId = 'primary' }: GoogleUpcomingEventsProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEvents = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      const googleEvents = await fetchGoogleCalendarEvents(selectedCalendarId);
      setEvents(googleEvents);
    } catch (error) {
      console.error("Error loading Google Calendar events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [isConnected, selectedCalendarId]);

  const formatEventDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatEventTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Google Events
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadEvents}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-md"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <h3 className="font-medium text-sm">{event.title}</h3>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatEventDate(event.start as string)}
                    {!event.allDay && (
                      <>
                        <Clock className="ml-2 mr-1 h-3 w-3" />
                        {formatEventTime(event.start as string)}
                      </>
                    )}
                  </p>
                  {event.location && (
                    <p className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground text-sm">No upcoming events</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
