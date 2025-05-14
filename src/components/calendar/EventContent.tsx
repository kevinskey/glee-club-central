
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { getEventTypeColor } from "@/utils/calendarUtils";

interface EventContentProps {
  eventInfo: any;
  view: string;
  isMobile: boolean;
}

export function EventContent({ eventInfo, view, isMobile }: EventContentProps) {
  const { event } = eventInfo;
  const eventType = event.extendedProps?.type || 'special';
  const location = event.extendedProps?.location;
  
  const isListView = view === 'listWeek';
  const colorClass = getEventTypeColor(eventType);
  
  return (
    <div className={`flex flex-col h-full ${isListView ? 'py-1 px-2' : 'p-1'}`}>
      {/* Event title with colored dot for event type */}
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colorClass}`} />
        <span className={`text-xs font-medium ${isListView ? '' : 'truncate'}`}>
          {event.title}
        </span>
      </div>
      
      {/* Show location but not description */}
      {location && !isMobile && (
        <div className="mt-0.5 text-xs text-muted-foreground truncate">
          {location}
        </div>
      )}
    </div>
  );
}
