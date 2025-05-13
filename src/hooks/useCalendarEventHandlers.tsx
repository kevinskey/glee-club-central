
import { useCallback, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useCalendarEventHandlers = (
  events: CalendarEvent[],
  updateEvent: (event: CalendarEvent) => Promise<boolean>,
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<boolean>,
  deleteEvent: (id: string) => Promise<boolean>,
  setSelectedEvent: (event: CalendarEvent | null) => void,
  setIsViewModalOpen: (isOpen: boolean) => void,
  setSelectedDate: (date: Date | null) => void,
  setIsCreateModalOpen: (isOpen: boolean) => void
) => {
  const { isAdmin, profile } = useAuth();
  const userCanCreate = profile?.is_super_admin || (isAdmin && isAdmin());

  useEffect(() => {
    console.log("useCalendarEventHandlers initialized with events:", events.length);
    return () => {
      console.log("useCalendarEventHandlers cleanup");
    };
  }, [events.length]);

  const handleDateClick = useCallback((info: any) => {
    console.log("Date clicked:", info.date);
    if (userCanCreate) {
      setSelectedDate(info.date);
      setIsCreateModalOpen(true);
    }
  }, [userCanCreate, setSelectedDate, setIsCreateModalOpen]);

  const handleEventClick = useCallback((info: any) => {
    try {
      console.log("Event clicked:", info.event.id);
      const eventId = info.event.id;
      const event = events.find(e => e.id === eventId);
      if (event) {
        console.log("Found clicked event:", event);
        setSelectedEvent(event);
        setIsViewModalOpen(true);
      } else {
        console.warn("Could not find clicked event in events array");
      }
    } catch (error) {
      console.error("Error handling event click:", error);
    }
  }, [events, setSelectedEvent, setIsViewModalOpen]);

  const handleEventDrop = useCallback(async (info: any) => {
    console.log("Event dropped:", info.event.id);
    if (!userCanCreate) {
      toast.error("You don't have permission to move events");
      info.revert();
      return;
    }
    
    try {
      const eventId = info.event.id;
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        const updatedEvent = {
          ...event,
          start: info.event.start.toISOString(),
          end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
        };
        
        await updateEvent(updatedEvent);
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      info.revert();
    }
  }, [events, updateEvent, userCanCreate]);

  const handleEventResize = useCallback(async (info: any) => {
    console.log("Event resized:", info.event.id);
    if (!userCanCreate) {
      toast.error("You don't have permission to resize events");
      info.revert();
      return;
    }
    
    try {
      const eventId = info.event.id;
      const event = events.find(e => e.id === eventId);
      
      if (event) {
        const updatedEvent = {
          ...event,
          end: info.event.end.toISOString()
        };
        
        await updateEvent(updatedEvent);
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      info.revert();
    }
  }, [events, updateEvent, userCanCreate]);

  const handleCreateEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_by'>) => {
    if (!profile) {
      toast.error("You must be logged in to create events");
      return false;
    }
    
    console.log("Creating event:", eventData);
    
    try {
      const newEvent = {
        ...eventData,
        created_by: profile.id
      };
      
      return await addEvent(newEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return false;
    }
  };

  const handleUpdateEvent = async (eventData: CalendarEvent) => {
    console.log("Updating event:", eventData);
    try {
      return await updateEvent(eventData);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    console.log("Deleting event:", eventId);
    try {
      return await deleteEvent(eventId);
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
    handleDeleteEvent,
    userCanCreate
  };
};
