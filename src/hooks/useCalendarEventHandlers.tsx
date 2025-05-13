
import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { toast } from "sonner";

interface CalendarEventHandlersProps {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  updateEvent: (event: CalendarEvent) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
  setSelectedDate: (date: Date | null) => void;
  setIsCreateModalOpen: (open: boolean) => void;
}

export function useCalendarEventHandlers({
  events,
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  setIsViewModalOpen,
  setSelectedDate,
  setIsCreateModalOpen
}: CalendarEventHandlersProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle date click - open the create event dialog with the selected date
  const handleDateClick = useCallback((info: any) => {
    console.log("Date clicked:", info.date);
    setSelectedDate(info.date);
    setIsCreateModalOpen(true);
  }, [setSelectedDate, setIsCreateModalOpen]);

  // Handle event click - open the view/edit dialog
  const handleEventClick = useCallback((info: any) => {
    console.log("Event clicked:", info.event);
    const eventData = info.event;
    
    // Convert to our internal event structure
    const event: CalendarEvent = {
      id: eventData.id,
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      date: eventData.extendedProps.date || eventData.startStr.split('T')[0],
      time: eventData.extendedProps.time || eventData.startStr.split('T')[1],
      allDay: eventData.allDay,
      description: eventData.extendedProps.description || '',
      location: eventData.extendedProps.location || '',
      type: eventData.extendedProps.type || 'other',
      image_url: eventData.extendedProps.image_url,
      created_by: eventData.extendedProps.created_by,
    };
    
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  }, [setSelectedEvent, setIsViewModalOpen]);

  // Handle event drop (drag-and-drop)
  const handleEventDrop = useCallback(async (info: any) => {
    console.log("Event dropped:", info);
    
    // Get the event being moved
    const eventId = info.event.id;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      console.error("Event not found:", eventId);
      return;
    }
    
    // Update the dates
    const updatedEvent = { 
      ...event,
      start: info.event.start,
      end: info.event.end || info.event.start,
      date: info.event.startStr.split('T')[0],
      allDay: info.event.allDay
    };
    
    try {
      setIsProcessing(true);
      const success = await updateEvent(updatedEvent);
      
      if (!success) {
        info.revert();
        toast.error("Failed to update event");
      } else {
        toast.success("Event updated");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      info.revert();
      toast.error("Error updating event");
    } finally {
      setIsProcessing(false);
    }
  }, [events, updateEvent]);

  // Handle event resize
  const handleEventResize = useCallback(async (info: any) => {
    console.log("Event resized:", info);
    
    // Get the event being resized
    const eventId = info.event.id;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      console.error("Event not found:", eventId);
      return;
    }
    
    // Update the dates
    const updatedEvent = { 
      ...event,
      start: info.event.start,
      end: info.event.end,
      allDay: info.event.allDay
    };
    
    try {
      setIsProcessing(true);
      const success = await updateEvent(updatedEvent);
      
      if (!success) {
        info.revert();
        toast.error("Failed to update event");
      } else {
        toast.success("Event updated");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      info.revert();
      toast.error("Error updating event");
    } finally {
      setIsProcessing(false);
    }
  }, [events, updateEvent]);

  // Handle create event
  const handleCreateEvent = useCallback(async (eventData: any): Promise<boolean> => {
    console.log("Creating event:", eventData);
    setIsProcessing(true);
    
    try {
      // Ensure time field is always set
      if (!eventData.time && eventData.start) {
        if (eventData.start instanceof Date) {
          eventData.time = eventData.start.toISOString().split('T')[1].substring(0, 8);
        } else if (typeof eventData.start === 'string' && eventData.start.includes('T')) {
          eventData.time = eventData.start.split('T')[1].substring(0, 8);
        } else {
          eventData.time = "12:00:00"; // Default time
        }
      }
      
      // Ensure we have a valid event data object
      const newEvent = {
        title: eventData.title,
        start: eventData.start,
        end: eventData.end || eventData.start,
        date: eventData.date || (eventData.start instanceof Date ? 
          eventData.start.toISOString().split('T')[0] : 
          typeof eventData.start === 'string' ? 
            eventData.start.split('T')[0] : 
            new Date().toISOString().split('T')[0]),
        time: eventData.time || "12:00:00",
        location: eventData.location || "TBD",
        type: eventData.type || "other",
        description: eventData.description || "",
        image_url: eventData.image_url,
        allDay: eventData.allDay || false
      };
      
      console.log("Adding new event with data:", newEvent);
      const success = await addEvent(newEvent);
      
      if (success) {
        toast.success("Event created successfully");
        return true;
      } else {
        toast.error("Failed to create event");
        return false;
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [addEvent]);

  // Handle update event
  const handleUpdateEvent = useCallback(async (eventData: CalendarEvent): Promise<boolean> => {
    console.log("Updating event:", eventData);
    setIsProcessing(true);
    
    try {
      // Ensure time field is always set
      if (!eventData.time) {
        eventData.time = "12:00:00"; // Default time
      }
      
      const success = await updateEvent(eventData);
      
      if (success) {
        toast.success("Event updated successfully");
        return true;
      } else {
        toast.error("Failed to update event");
        return false;
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Error updating event");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [updateEvent]);

  // Handle delete event
  const handleDeleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    console.log("Deleting event:", eventId);
    setIsProcessing(true);
    
    try {
      const success = await deleteEvent(eventId);
      
      if (success) {
        toast.success("Event deleted successfully");
        return true;
      } else {
        toast.error("Failed to delete event");
        return false;
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [deleteEvent]);

  return {
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    isProcessing
  };
}
