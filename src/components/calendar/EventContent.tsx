
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventContentProps {
  eventInfo: any;
  view: string;
}

export function EventContent({ eventInfo, view }: EventContentProps) {
  const { event, timeText } = eventInfo;
  const isMobile = useIsMobile();
  
  // Get event type from extended props
  const eventType = event.extendedProps?.type || "default";
  
  // Get appropriate styling based on event type
  const getEventTypeStyles = () => {
    switch (eventType) {
      case "concert":
        return "bg-glee-purple border-glee-purple/70 text-white";
      case "rehearsal":
        return "bg-blue-500 border-blue-400 text-white";
      case "sectional":
        return "bg-green-500 border-green-400 text-white";
      case "special":
        return "bg-amber-500 border-amber-400 text-white";
      case "tour":
        return "bg-purple-500 border-purple-400 text-white";
      default:
        return "bg-gray-500 border-gray-400 text-white";
    }
  };
  
  const styles = getEventTypeStyles();
  
  // Different rendering for list view
  if (view === 'listWeek') {
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${styles.split(' ')[0]}`}></div>
        <div className="flex flex-col">
          <div className="font-medium">{event.title}</div>
          {event.extendedProps.location && !isMobile && (
            <div className="text-xs text-muted-foreground">{event.extendedProps.location}</div>
          )}
        </div>
      </div>
    );
  }

  // Smaller content for mobile month view
  if (isMobile && view === 'dayGridMonth') {
    return (
      <div className={`p-1 rounded text-xs ${styles}`}>
        <div className="font-medium truncate">{event.title}</div>
      </div>
    );
  }

  // Standard rendering for day/week grid views
  return (
    <div className={`p-1 rounded ${styles}`}>
      <div className="font-medium text-xs sm:text-sm truncate">
        {event.title}
      </div>
      {timeText && (
        <div className="text-xs opacity-90">{timeText}</div>
      )}
      {event.extendedProps.location && !isMobile && view !== 'dayGridMonth' && (
        <div className="text-xs opacity-90 truncate">{event.extendedProps.location}</div>
      )}
    </div>
  );
}
