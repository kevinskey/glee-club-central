
import React from "react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAddToGoogleCalendarUrl, getViewGoogleCalendarUrl } from "@/utils/googleCalendar";

interface EventDetailsProps {
  selectedEvent: CalendarEvent;
  onEditEvent?: () => void;
  onDeleteEvent?: () => void;
}

export const EventDetails = ({
  selectedEvent,
  onEditEvent,
  onDeleteEvent,
}: EventDetailsProps) => {
  const isMobile = useIsMobile();
  const isGoogleEvent = selectedEvent.source === "google";

  // Helper function to render button or link label based on device
  const renderButtonLabel = (text: string, icon: React.ReactNode) => (
    <div className="flex items-center space-x-1">
      {icon}
      {!isMobile && <span>{text}</span>}
    </div>
  );

  return (
    <Card className="p-4 mt-4 bg-white dark:bg-gray-800">
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold">{selectedEvent.title}</h2>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-start md:items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 mt-0.5 md:mt-0" />
            <span>{format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-start md:items-center gap-2 text-sm">
            <Clock className="h-4 w-4 mt-0.5 md:mt-0" />
            <span>{selectedEvent.time}</span>
          </div>
          
          <div className="flex items-start md:items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 md:mt-0" />
            <span>{selectedEvent.location}</span>
          </div>
        </div>
      </div>
      
      {selectedEvent.description && (
        <div className="mb-4">
          <h3 className="font-medium mb-1">Description</h3>
          <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
        </div>
      )}
      
      <div className="flex flex-wrap justify-end gap-2 mt-4">
        {isGoogleEvent ? (
          // Google Calendar event actions
          <>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => window.open(getViewGoogleCalendarUrl(), "_blank")}
            >
              {renderButtonLabel("View in Google Calendar", <ExternalLink className="h-4 w-4" />)}
            </Button>
          </>
        ) : (
          // Local event actions
          <>
            {onEditEvent && (
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={onEditEvent}
              >
                {renderButtonLabel("Edit", <span className="h-4 w-4">✏️</span>)}
              </Button>
            )}
            
            {onDeleteEvent && (
              <Button
                variant="destructive"
                size={isMobile ? "sm" : "default"}
                onClick={onDeleteEvent}
              >
                {renderButtonLabel("Delete", <span className="h-4 w-4">🗑️</span>)}
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
