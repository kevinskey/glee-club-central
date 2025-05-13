
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface EventDetailsProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}

export function EventDetails({ event, onEdit, onDelete, isAdmin }: EventDetailsProps) {
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "concert":
        return <Badge className="bg-glee-purple hover:bg-glee-purple/90">Concert</Badge>;
      case "rehearsal":
        return <Badge className="bg-blue-500 hover:bg-blue-500/90">Rehearsal</Badge>;
      case "sectional":
        return <Badge className="bg-green-500 hover:bg-green-500/90">Sectional</Badge>;
      case "special":
        return <Badge className="bg-amber-500 hover:bg-amber-500/90">Special Event</Badge>;
      case "tour":
        return <Badge className="bg-red-500 hover:bg-red-500/90">Tour</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <div className="flex items-center mt-1">
            {getEventTypeBadge(event.type)}
          </div>
        </div>
        {isAdmin && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this event? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {event.image_url && (
        <div className="w-full overflow-hidden rounded-md">
          <AspectRatio ratio={16 / 9}>
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 opacity-70" />
          <span className="text-sm">
            {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
            {event.time && ` at ${event.time}`}
          </span>
        </div>

        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 opacity-70" />
          <span className="text-sm">{event.location}</span>
        </div>
      </div>

      {event.description && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
