
import React, { useEffect } from "react";
import { EventType } from "@/types/calendar";

interface EventContentProps {
  eventInfo: any;
  view: string;
}

export const EventContent = ({ eventInfo, view }: EventContentProps) => {
  useEffect(() => {
    if (!eventInfo?.event?.title) {
      console.warn("EventContent received invalid event info", eventInfo);
      return;
    }
    console.log("EventContent rendering for event:", eventInfo.event.title);
  }, [eventInfo?.event?.title]);
  
  if (!eventInfo?.event) {
    console.error("EventContent: No event data available");
    return null;
  }
  
  const typeColors: Record<EventType, string> = {
    'rehearsal': 'bg-blue-500 border-blue-600',
    'concert': 'bg-orange-500 border-orange-600',
    'sectional': 'bg-green-500 border-green-600',
    'special': 'bg-purple-500 border-purple-600',
    'tour': 'bg-teal-500 border-teal-600' // Added missing 'tour' type
  };

  const eventType = (eventInfo.event.extendedProps?.type as EventType) || 'special';
  const location = eventInfo.event.extendedProps?.location || '';
  
  // Different rendering based on view type
  if (view === 'dayGridMonth') {
    return (
      <div className="w-full overflow-hidden">
        <div className={`flex items-center py-1 px-2 rounded-sm ${typeColors[eventType]}`}>
          <div className="flex-1 text-white truncate">
            <div className="font-medium text-xs md:text-sm truncate">{eventInfo.event.title}</div>
            {location && <div className="text-xs text-white/80 truncate">{location}</div>}
          </div>
        </div>
      </div>
    );
  } else {
    // Week/Day view with more detailed info
    return (
      <div className="w-full h-full overflow-hidden">
        <div className={`flex flex-col h-full py-1 px-2 ${typeColors[eventType]}`}>
          <div className="font-medium text-xs md:text-sm text-white">{eventInfo.event.title}</div>
          {location && (
            <div className="text-xs text-white/80 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
};
