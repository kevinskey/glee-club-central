
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

export function DashboardEvents() {
  // Get calendar events from the hook
  const { events, loading: eventsLoading } = useCalendarEvents();
  
  // Upcoming events state
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  // Process and set upcoming events when events are loaded
  useEffect(() => {
    if (!eventsLoading && events.length > 0) {
      console.log("Processing calendar events for dashboard...");
      
      // Get today's date and filter upcoming events
      const today = new Date();
      const upcoming = events
        .filter(event => event.date >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 3) // Get first 3 upcoming events
        .map(event => ({
          id: event.id,
          title: event.title,
          date: format(event.date, 'MMM d'),
          time: event.time,
          location: event.location
        }));
      
      setUpcomingEvents(upcoming);
      console.log("Dashboard upcoming events set:", upcoming);
    }
  }, [events, eventsLoading]);
  
  if (eventsLoading) {
    return <div className="text-xs md:text-sm text-muted-foreground">Loading events...</div>;
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {upcomingEvents && upcomingEvents.length > 0 ? (
        upcomingEvents.map(event => (
          <div key={event.id} className="border-b pb-3 last:border-0">
            <h3 className="font-medium text-sm md:text-base">{event.title}</h3>
            <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
              <span>{event.date}</span>
              <span>{event.time}</span>
            </div>
            {event.location && <div className="text-xs text-muted-foreground truncate">{event.location}</div>}
          </div>
        ))
      ) : (
        <div className="text-xs md:text-sm text-muted-foreground">No upcoming events</div>
      )}
      <div className="mt-3 md:mt-4">
        <Link 
          to="/dashboard/calendar" 
          className="text-xs md:text-sm text-glee-spelman hover:underline inline-flex items-center"
        >
          View full calendar
        </Link>
      </div>
    </div>
  );
}
