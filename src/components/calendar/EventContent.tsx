
import React from "react";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventContentProps {
  eventInfo: any;
  view: string;
}

export const EventContent = ({ eventInfo, view }: EventContentProps) => {
  const event = eventInfo.event;
  const { type } = event.extendedProps;
  
  const getEventTypeColor = () => {
    switch (type) {
      case "concert":
        return "bg-glee-purple text-white";
      case "rehearsal":
        return "bg-blue-500 text-white";
      case "sectional":
        return "bg-green-500 text-white";
      case "meeting":
        return "bg-amber-500 text-white";
      case "tour":
        return "bg-red-500 text-white";
      case "special":
        return "bg-pink-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getEventTypeIcon = () => {
    switch (type) {
      case "concert":
        return "🎵";
      case "rehearsal":
        return "🎤";
      case "sectional":
        return "👥";
      case "meeting":
        return "📋";
      case "tour":
        return "🚌";
      case "special":
        return "✨";
      default:
        return "📅";
    }
  };

  // For month view or when allDay is true
  if (view === "dayGridMonth" || event.allDay) {
    return (
      <div className={cn(
        "px-2 py-1 text-xs rounded truncate",
        getEventTypeColor()
      )}>
        <span className="mr-1">{getEventTypeIcon()}</span>
        {event.title}
      </div>
    );
  }
  
  // For week or day view
  return (
    <div className={cn(
      "h-full w-full p-1 overflow-hidden",
      getEventTypeColor()
    )}>
      <div className="font-medium">{event.title}</div>
      
      {event.extendedProps.location && (
        <div className="flex items-center text-xs mt-1 opacity-90">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate">{event.extendedProps.location}</span>
        </div>
      )}
      
      {!event.allDay && view !== "listWeek" && (
        <div className="flex items-center text-xs mt-1 opacity-90">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {new Date(event.start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
            {event.end && ` - ${new Date(event.end).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}`}
          </span>
        </div>
      )}
    </div>
  );
};
