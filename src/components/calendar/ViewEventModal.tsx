
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon, Clock, MapPin, User, Trash2, Edit, FileText } from "lucide-react";
import { CalendarEvent } from '@/types/calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EventModal } from "./EventModal";

interface ViewEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => Promise<boolean | void>;
  onDelete: (eventId: string) => Promise<boolean | void>;
  userCanEdit: boolean;
}

export function ViewEventModal({ 
  event, 
  onClose, 
  onUpdate, 
  onDelete, 
  userCanEdit 
}: ViewEventModalProps) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await onDelete(event.id);
    }
  };

  // If in edit mode, show the EventModal component instead
  if (isEditing) {
    return (
      <EventModal
        onClose={() => setIsEditing(false)}
        onSave={async (updatedEvent) => {
          const success = await onUpdate({ ...event, ...updatedEvent });
          if (success) {
            setIsEditing(false);
          }
          return success;
        }}
        initialData={event}
      />
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">{event.title}</DialogTitle>
      </DialogHeader>

      {/* Event Image (if available) */}
      {event.image_url && (
        <div className="mt-4 rounded-md overflow-hidden border">
          <AspectRatio ratio={16/9}>
            <img 
              src={event.image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        </div>
      )}
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{formatDate(event.start)}</span>
        </div>
        
        {event.time && (
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatTime(event.time)}</span>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded-full text-xs ${getEventTypeBadgeStyle(event.type)}`}>
            {capitalizeFirstLetter(event.type)}
          </div>
        </div>
        
        {event.created_by && (
          <div className="flex items-center pt-2">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Created by: {truncateId(event.created_by)}</span>
          </div>
        )}
      </div>
      
      <DialogFooter className="flex gap-2 mt-4">
        {userCanEdit && (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        )}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
}

// Helper functions
const formatDate = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    return String(date);
  }
};

const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return time;
  }
};

const getEventTypeBadgeStyle = (type: string): string => {
  switch (type) {
    case 'concert': 
      return 'bg-glee-purple/20 text-glee-purple';
    case 'rehearsal': 
      return 'bg-blue-500/20 text-blue-600';
    case 'sectional': 
      return 'bg-green-500/20 text-green-600';
    case 'special': 
      return 'bg-amber-500/20 text-amber-600';
    case 'tour': 
      return 'bg-purple-500/20 text-purple-600';
    default: 
      return 'bg-gray-200 text-gray-700';
  }
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const truncateId = (id: string): string => {
  if (id.length <= 8) return id;
  return `${id.substring(0, 6)}...`;
};
