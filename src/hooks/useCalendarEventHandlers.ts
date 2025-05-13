
import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CalendarEventHandlersProps {
  events: CalendarEvent[];
  updateEvent: (event: CalendarEvent) => Promise<boolean>;
  addEvent: (event: Partial<CalendarEvent>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
  setSelectedDate: (date: Date | null) => void;
  setIsCreateModalOpen: (isOpen: boolean) => void;
}

export const useCalendarEventHandlers = (props: CalendarEventHandlersProps) => {
  const {
    events,
    updateEvent,
    addEvent,
    deleteEvent,
    setSelectedEvent,
    setIsViewModalOpen,
    setSelectedDate,
    setIsCreateModalOpen
  } = props;

  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle date click - opens create modal
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsCreateModalOpen(true);
  };

  // Handle event click - opens view modal
  const handleEventClick = (info: any) => {
    const clickedEventId = info.event.id;
    const selectedEvent = events.find(e => e.id === clickedEventId);
    
    if (selectedEvent) {
      setSelectedEvent(selectedEvent);
      setIsViewModalOpen(true);
    }
  };

  // Handle event drop (move to different time/date)
  const handleEventDrop = async (info: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const movedEventId = info.event.id;
      const existingEvent = events.find(e => e.id === movedEventId);
      
      if (!existingEvent) {
        toast.error("Event not found");
        return;
      }
      
      const updatedEvent = {
        ...existingEvent,
        start: info.event.start,
        end: info.event.end || info.event.start,
        allDay: info.event.allDay
      };
      
      await updateEvent(updatedEvent);
      toast.success("Event moved successfully");
    } catch (error) {
      console.error("Error moving event:", error);
      toast.error("Failed to move event");
      info.revert();
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle event resize
  const handleEventResize = async (info: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const resizedEventId = info.event.id;
      const existingEvent = events.find(e => e.id === resizedEventId);
      
      if (!existingEvent) {
        toast.error("Event not found");
        return;
      }
      
      const updatedEvent = {
        ...existingEvent,
        start: info.event.start,
        end: info.event.end
      };
      
      await updateEvent(updatedEvent);
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Error resizing event:", error);
      toast.error("Failed to update event");
      info.revert();
    } finally {
      setIsProcessing(false);
    }
  };

  // Create event
  const handleCreateEvent = async (eventData: any): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to create events");
      return false;
    }
    
    try {
      const newEvent = {
        ...eventData,
        created_by: user.id
      };
      
      const success = await addEvent(newEvent);
      if (success) {
        toast.success("Event created successfully");
      }
      return success;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return false;
    }
  };

  // Update event
  const handleUpdateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      const success = await updateEvent(eventData);
      if (success) {
        toast.success("Event updated successfully");
      }
      return success;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const success = await deleteEvent(eventId);
      if (success) {
        toast.success("Event deleted successfully");
      }
      return success;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    }
  };

  return {
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  };
};
