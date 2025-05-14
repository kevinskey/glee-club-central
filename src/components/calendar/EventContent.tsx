
import React from "react";
import { formatEventForMobile } from "@/utils/mobileUtils";

interface EventContentProps {
  eventInfo: any;
  view: string;
  isMobile?: boolean;
}

export const EventContent: React.FC<EventContentProps> = ({ eventInfo, view, isMobile = false }) => {
  const { title, extendedProps } = eventInfo.event;
  const { type, location } = extendedProps;
  
  // Get event colors based on type
  const getEventColor = () => {
    switch (type) {
      case "concert": 
        return { bg: "bg-glee-purple", text: "text-white" };
      case "rehearsal": 
        return { bg: "bg-blue-500", text: "text-white" };
      case "sectional": 
        return { bg: "bg-green-500", text: "text-white" };
      case "special": 
        return { bg: "bg-amber-500", text: "text-white" };
      default: 
        return { bg: "bg-gray-500", text: "text-white" };
    }
  };

  const { bg, text } = getEventColor();
  
  // Format event for mobile if needed
  const mobileFormat = isMobile ? formatEventForMobile(eventInfo.event) : null;
  
  // In list view, show more details
  if (view === "listWeek") {
    return (
      <div className="flex flex-col">
        <div className={`${bg} ${text} px-2 py-1 rounded-sm text-xs font-medium self-start`}>
          {type}
        </div>
        <div className="font-medium mt-1">
          {isMobile && mobileFormat ? mobileFormat.formattedTitle : title}
        </div>
        {location && (
          <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
            {isMobile && mobileFormat ? mobileFormat.location : location}
          </div>
        )}
      </div>
    );
  }
  
  // For month view on mobile, show very compact display
  if (view === "dayGridMonth" && isMobile) {
    return (
      <div className={`${bg} ${text} px-1.5 py-0.5 rounded text-xs truncate w-full`}>
        {mobileFormat ? mobileFormat.formattedTitle : title}
      </div>
    );
  }
  
  // For day/week view on mobile, show compact but with a bit more detail
  if ((view === "timeGridDay" || view === "timeGridWeek") && isMobile) {
    return (
      <div className={`${bg} ${text} px-1.5 py-0.5 rounded text-xs flex flex-col h-full`}>
        <div className="font-medium truncate">
          {mobileFormat ? mobileFormat.formattedTitle : title}
        </div>
        {location && !eventInfo.timeText && (
          <div className="truncate opacity-80 text-[10px]">
            {mobileFormat ? mobileFormat.location : location}
          </div>
        )}
      </div>
    );
  }
  
  // Default display for desktop
  return (
    <div className={`${bg} ${text} px-2 py-1 rounded flex flex-col h-full`}>
      <div className="font-medium">
        {title}
      </div>
      {location && !eventInfo.timeText && (
        <div className="text-xs opacity-90 truncate">
          {location}
        </div>
      )}
    </div>
  );
};
