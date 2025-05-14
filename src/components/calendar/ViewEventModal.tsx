
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { EditEventForm } from "./EditEventForm";

interface ViewEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => Promise<boolean | void>;
  onDelete: (eventId: string) => Promise<boolean | void>;
  userCanEdit?: boolean;
}

export function ViewEventModal({ event, onClose, onUpdate, onDelete, userCanEdit = false }: ViewEventModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = async () => {
    await onDelete(event.id);
    onClose();
  };

  // If editing, show the edit form
  if (isEditing) {
    return (
      <EditEventForm
        event={event}
        onUpdateEvent={onUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Format dates for display
  const eventDate = event.date instanceof Date
    ? event.date.toLocaleDateString()
    : new Date(event.date).toLocaleDateString();

  // Determine event type color
  const getEventTypeColor = () => {
    switch (event.type) {
      case "concert":
        return "text-glee-purple";
      case "rehearsal":
        return "text-blue-500";
      case "sectional":
        return "text-green-500";
      case "special":
        return "text-amber-500";
      case "tour":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  // Get formatted event type display name
  const getEventTypeDisplay = () => {
    switch (event.type) {
      case "concert":
        return "Concert";
      case "rehearsal":
        return "Rehearsal";
      case "sectional":
        return "Sectional";
      case "special":
        return "Special Event";
      case "tour":
        return "Tour";
      default:
        return event.type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
        <div className="flex items-center gap-2">
          <span className={`font-medium ${getEventTypeColor()}`}>
            {getEventTypeDisplay()}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</h3>
          <p>{eventDate} {event.time}</p>
        </div>

        {event.location && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
            <p>{event.location}</p>
          </div>
        )}

        {event.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {event.image_url && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Image</h3>
            <div className="mt-1 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
              <img
                src={event.image_url}
                alt={event.title}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>
        
        {userCanEdit && (
          <>
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-glee-purple hover:bg-glee-purple/90"
            >
              Edit
            </Button>
            
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
