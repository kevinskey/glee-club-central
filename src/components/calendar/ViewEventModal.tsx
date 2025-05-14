
import React, { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import { Trash2, Edit, MapPin, Calendar, Clock } from "lucide-react";
import { MobileFitCheck } from "./MobileFitCheck";
import { useIsMobile } from "@/hooks/use-mobile";

interface ViewEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => Promise<boolean | void>;
  onDelete: (id: string) => Promise<boolean | void>;
  userCanEdit: boolean;
}

export const ViewEventModal = ({
  event,
  onClose,
  onUpdate,
  onDelete,
  userCanEdit
}: ViewEventModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      setIsLoading(true);
      try {
        await onDelete(event.id);
      } catch (error) {
        console.error("Error deleting event:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get badge color based on event type
  const getBadgeVariant = () => {
    switch (event.type) {
      case "concert":
        return "default";
      case "rehearsal":
        return "secondary";
      case "sectional":
        return "outline";
      case "special":
        return "destructive";
      default:
        return "outline";
    }
  };

  const eventDate = event.date instanceof Date ? event.date : new Date(event.date);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">{event.title}</DialogTitle>
        <div className="flex items-center mt-2">
          <Badge variant={getBadgeVariant()} className="mr-2">
            {event.type}
          </Badge>
        </div>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(eventDate, isMobile ? "MMM d, yyyy" : "MMMM d, yyyy")}
            </span>
          </div>
          
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.description && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}
        
        {/* Show mobile fit check warning if needed */}
        <MobileFitCheck 
          title={event.title} 
          location={event.location || ""} 
          description={event.description} 
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        {userCanEdit && (
          <div className={`flex ${isMobile ? 'flex-col w-full gap-2' : 'gap-2'}`}>
            <Button
              type="button"
              onClick={handleDelete}
              variant="destructive"
              disabled={isLoading}
              className={isMobile ? "w-full" : ""}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button
              type="button"
              onClick={() => onUpdate(event)}
              disabled={isLoading}
              className={isMobile ? "w-full" : ""}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        )}
      </DialogFooter>
    </div>
  );
};
