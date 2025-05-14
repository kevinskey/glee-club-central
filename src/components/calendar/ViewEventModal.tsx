
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarEvent } from "@/types/calendar";
import { CalendarIcon, Clock, MapPin, Edit, Trash2 } from "lucide-react";

interface ViewEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => Promise<void>;
  onDelete: () => Promise<void>;
  userCanEdit: boolean;
}

export const ViewEventModal: React.FC<ViewEventModalProps> = ({
  event,
  onClose,
  onUpdate,
  onDelete,
  userCanEdit
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  if (isEditing) {
    const editableEvent = { ...event };
    const handleSave = async (updatedData: any) => {
      await onUpdate({
        ...event,
        ...updatedData
      });
    };
    
    // We would render the edit form here, but to avoid duplication,
    // we'll just close the view modal and rely on the parent component
    // to open an edit modal
    return (
      <div className="flex flex-col space-y-4">
        <p>Loading editor...</p>
      </div>
    );
  }

  // Helper function to get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "concert":
        return "bg-glee-purple";
      case "rehearsal":
        return "bg-blue-500";
      case "sectional":
        return "bg-green-500";
      default:
        return "bg-amber-500";
    }
  };

  // Format the event date 
  const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getEventTypeColor(event.type)}`}>
        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      </div>
      
      <h3 className="text-xl font-semibold">{event.title}</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
        </div>
        
        {event.time && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
      
      {event.description && (
        <div className="border-t pt-3 mt-3">
          <p className="text-sm whitespace-pre-wrap">{event.description}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 border-t pt-4 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        
        {userCanEdit && (
          <>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
