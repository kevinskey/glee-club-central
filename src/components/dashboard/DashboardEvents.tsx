
import React from "react";
import { Link } from "react-router-dom";
import { Event } from "@/pages/dashboard/DashboardPage";

interface DashboardEventsProps {
  events: Event[];
}

export function DashboardEvents({ events }: DashboardEventsProps) {
  if (events.length === 0) {
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
      {events.map(event => (
        <div key={event.id} className="border-b pb-3 last:border-0">
          <h3 className="font-medium text-sm md:text-base">{event.title}</h3>
          <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
            <span>{event.date.toLocaleDateString()}</span>
            <span>{event.time}</span>
          </div>
          {event.location && <div className="text-xs text-muted-foreground truncate">{event.location}</div>}
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
