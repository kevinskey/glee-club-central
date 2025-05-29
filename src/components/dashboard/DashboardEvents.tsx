
import React from "react";
import { Link } from "react-router-dom";
import { CalendarEvent } from "@/types/calendar";
import { formatEventDate, formatEventTime } from "@/utils/calendarUtils";

interface DashboardEventsProps {
  events: CalendarEvent[];
  limit?: number;
}

export function DashboardEvents({ events, limit = 5 }: DashboardEventsProps) {
  // Filter to upcoming events only
  const now = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.start_time) > now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, limit);

  if (upcomingEvents.length === 0) {
    return (
      <div className="space-y-3 md:space-y-4">
        <div className="text-xs md:text-sm text-muted-foreground">No upcoming events</div>
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

  return (
    <div className="space-y-3 md:space-y-4">
      {upcomingEvents.map(event => (
        <div key={event.id} className="border-b pb-3 last:border-0">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm md:text-base flex-1">{event.title}</h3>
            {event.event_type && (
              <span className="text-xs bg-glee-purple/10 text-glee-purple px-2 py-1 rounded-full ml-2 flex-shrink-0">
                {event.event_type}
              </span>
            )}
          </div>
          <div className="flex justify-between text-xs md:text-sm text-muted-foreground mt-1">
            <span>{formatEventDate(event.start_time)}</span>
            <span>{formatEventTime(event.start_time)}</span>
          </div>
          {event.location_name && (
            <div className="text-xs text-muted-foreground truncate mt-1">{event.location_name}</div>
          )}
          {event.is_private && (
            <div className="text-xs text-orange-600 font-medium mt-1">Members Only</div>
          )}
        </div>
      ))}
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
