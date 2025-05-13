
import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ViewEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  userCanEdit: boolean;
}

export function ViewEventModal({ 
  event, 
  onClose, 
  onUpdate, 
  onDelete,
  userCanEdit 
}: ViewEventModalProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const handleDelete = async () => {
    await onDelete(event.id);
  };

  const handleUpdate = async () => {
    await onUpdate(event);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  const getEventTypeLabel = (type: string) => {
    switch(type) {
      case 'rehearsal': return 'Rehearsal';
      case 'concert': return 'Concert';
      case 'sectional': return 'Sectional';
      case 'special': return 'Special Event';
      default: return type;
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{event.title}</DialogTitle>
      </DialogHeader>
      
      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Event Type</h4>
          <p>{getEventTypeLabel(event.type)}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h4>
          <p>{formatDate(event.start)}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</h4>
          <p>{formatTime(event.start)} - {formatTime(event.end)}</p>
        </div>
        
        {event.location && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
            <p>{event.location}</p>
          </div>
        )}
        
        {event.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        
        {userCanEdit && (
          <>
            <Button 
              variant="outline"
              onClick={handleUpdate}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
            
            <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the event "{event.title}".
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </>
  );
}
