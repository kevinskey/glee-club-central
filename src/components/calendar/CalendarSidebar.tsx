
import React from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendarStore } from "@/hooks/useCalendarStore";

export function CalendarSidebar() {
  const { events } = useCalendarStore();
  
  // Get today's events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  // Get upcoming events (next 7 days excluding today)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() > today.getTime() && eventDate.getTime() <= nextWeek.getTime();
  }).slice(0, 5); // Show only 5 upcoming events

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for upcoming events
  const formatDate = (isoString: string) => {
    const eventDate = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if event is today or tomorrow
    if (eventDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return eventDate.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Legend</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-sm">Rehearsal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <span className="text-sm">Concert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm">Sectional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500" />
              <span className="text-sm">Special Event</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map(event => (
                <div key={event.id} className="border-l-4 pl-3 py-1 text-sm" 
                     style={{ 
                       borderColor: event.type === 'rehearsal' ? '#3b82f6' :
                                  event.type === 'concert' ? '#f97316' :
                                  event.type === 'sectional' ? '#22c55e' :
                                  '#a855f7'
                     }}>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                  {event.location && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {event.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No events today</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border-l-4 pl-3 py-1 text-sm" 
                     style={{ 
                       borderColor: event.type === 'rehearsal' ? '#3b82f6' :
                                  event.type === 'concert' ? '#f97316' :
                                  event.type === 'sectional' ? '#22c55e' :
                                  '#a855f7'
                     }}>
                  <div className="text-xs font-medium text-gray-500">
                    {formatDate(event.start)}
                  </div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {formatTime(event.start)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No upcoming events</div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" className="text-glee-spelman border-glee-spelman" onClick={() => {
          document.getElementById('today-button')?.click();
        }}>
          <Calendar className="h-4 w-4 mr-2" />
          Jump to Today
        </Button>
      </div>
    </div>
  );
}
