
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { useAuth } from "@/contexts/AuthContext";

interface EventDetailsProps {
  selectedEvent: CalendarEvent;
  onDeleteEvent: () => Promise<void>;
}

export const EventDetails = ({ 
  selectedEvent, 
  onDeleteEvent 
}: EventDetailsProps) => {
  const { user } = useAuth();

  if (!selectedEvent) return null;

  return (
    <div className="mt-6 pt-6 border-t">
      {/* Show event image if available */}
      {selectedEvent.image_url && (
        <div className="mb-4">
          <img
            src={selectedEvent.image_url}
            alt={selectedEvent.title}
            className="w-full h-auto max-h-60 object-cover rounded-lg shadow-sm"
          />
        </div>
      )}

      <h3 className="text-xl font-medium mb-3">{selectedEvent.title}</h3>
      <div className="space-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(selectedEvent.date, 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{selectedEvent.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{selectedEvent.location}</span>
        </div>
      </div>
      <p className="text-sm">{selectedEvent.description}</p>

      {/* Event actions */}
      <div className="mt-6 flex gap-3">
        <Button className="bg-glee-purple hover:bg-glee-purple/90">
          Add to Calendar
        </Button>
        <Button variant="outline">
          Share Event
        </Button>
        {user && user.id && (
          <Button
            variant="outline"
            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={onDeleteEvent}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
