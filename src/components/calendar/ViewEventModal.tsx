import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { CalendarEvent } from "@/types/calendar";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { uploadEventImage } from "@/utils/supabase/eventImageUpload";

interface ViewEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => Promise<boolean>;
  onDelete: (eventId: string) => Promise<boolean>;
  userCanEdit: boolean;
}

export const ViewEventModal = ({
  event,
  onClose,
  onUpdate,
  onDelete,
  userCanEdit
}: ViewEventModalProps) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await onDelete(event.id);
    }
  };

  const getEventTypeBadge = () => {
    switch (event.type) {
      case "concert":
        return <Badge className="bg-glee-purple hover:bg-glee-purple/90">Concert</Badge>;
      case "rehearsal":
        return <Badge className="bg-blue-500 hover:bg-blue-500/90">Rehearsal</Badge>;
      case "sectional":
        return <Badge className="bg-green-500 hover:bg-green-500/90">Sectional</Badge>;
      case "meeting":
        return <Badge className="bg-amber-500 hover:bg-amber-500/90">Meeting</Badge>;
      case "tour":
        return <Badge className="bg-red-500 hover:bg-red-500/90">Tour</Badge>;
      case "special":
        return <Badge className="bg-pink-500 hover:bg-pink-500/90">Special</Badge>;
      default:
        return <Badge>Other</Badge>;
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{event.title}</DialogTitle>
        <DialogDescription>
          <div className="flex items-center mt-1">
            {getEventTypeBadge()}
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        {event.image_url && (
          <div className="w-full">
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-auto max-h-48 object-cover rounded-md"
            />
          </div>
        )}

        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {format(new Date(event.start), "EEE, MMM d, yyyy")}
            {event.end && event.end !== event.start && 
              ` - ${format(new Date(event.end), "EEE, MMM d, yyyy")}`}
          </span>
        </div>

        {!event.allDay && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {format(new Date(event.start), "h:mm a")}
              {event.end && event.end !== event.start && 
                ` - ${format(new Date(event.end), "h:mm a")}`}
            </span>
          </div>
        )}

        {event.location && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
        )}

        {event.description && (
          <>
            <Separator />
            <div>
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2" />
                <span className="font-medium">Description</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line pl-6">
                {event.description}
              </p>
            </div>
          </>
        )}
      </div>

      <DialogFooter className="mt-6">
        <div className="flex justify-end gap-2 w-full">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          
          {userCanEdit && (
            <>
              <Button 
                variant="outline" 
                onClick={() => onUpdate(event)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </DialogFooter>
    </>
  );
};
