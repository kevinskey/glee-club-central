
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export interface EventDetailsProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}

export function EventDetails({ event, onEdit, onDelete, isAdmin }: EventDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{event.title}</h3>
        <div className="mt-1 text-sm text-muted-foreground">
          {format(new Date(event.start), "EEEE, MMMM d, yyyy")}
          {event.time && <span> at {event.time}</span>}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium">Location</h4>
        <p className="text-sm">{event.location}</p>
      </div>
      
      {event.description && (
        <div>
          <h4 className="text-sm font-medium">Description</h4>
          <p className="text-sm whitespace-pre-wrap">{event.description}</p>
        </div>
      )}
      
      {event.image_url && (
        <div>
          <h4 className="text-sm font-medium">Event Image</h4>
          <div className="mt-1 rounded-lg overflow-hidden">
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}
      
      {isAdmin && (
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="flex items-center gap-1"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this event? This action cannot be undone.
              </AlertDialogDescription>
              <div className="flex justify-end gap-2 mt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
