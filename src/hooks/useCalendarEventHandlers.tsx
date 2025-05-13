
import { useState } from "react";
import { toast } from "sonner";
import { CalendarEvent, EventType } from "@/types/calendar";

export const useCalendarEventHandlers = (
  events: CalendarEvent[],
  updateEvent: (event: CalendarEvent) => Promise<boolean>,
  addEvent: (event: Omit<CalendarEvent, "id">) => Promise<boolean>,
  deleteEvent: (id: string) => Promise<boolean>,
  setSelectedEvent: (event: CalendarEvent | null) => void,
  setIsViewModalOpen: (open: boolean) => void,
  setSelectedDate: (date: Date | null) => void,
  setIsCreateModalOpen: (open: boolean) => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle clicking on a date
  const handleDateClick = (date: Date) => {
    if (date) {
      setSelectedDate(date);
      setIsCreateModalOpen(true);
    }
  };

  // Handle clicking on an event
  const handleEventClick = (eventInfo: any) => {
    const eventId = eventInfo.event.id;
    const eventObj = events.find(e => e.id === eventId);
    
    if (eventObj) {
      setSelectedEvent(eventObj);
      setIsViewModalOpen(true);
    } else {
      toast.error("Event details could not be found");
    }
  };

  // Handle dragging and dropping events
  const handleEventDrop = async (info: any) => {
    setIsProcessing(true);
    try {
      const eventId = info.event.id;
      const eventObj = events.find(e => e.id === eventId);
      
      if (!eventObj) {
        toast.error("Event not found");
        info.revert();
        return;
      }
      
      // Create a copy of the event with updated dates
      const updatedEvent: CalendarEvent = {
        ...eventObj,
        start: info.event.start.toISOString(),
        end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
      };
      
      const success = await updateEvent(updatedEvent);
      
      if (!success) {
        toast.error("Failed to update event");
        info.revert();
      } else {
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error in handleEventDrop:", error);
      toast.error("An error occurred while updating the event");
      info.revert();
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle resizing events
  const handleEventResize = async (info: any) => {
    setIsProcessing(true);
    try {
      const eventId = info.event.id;
      const eventObj = events.find(e => e.id === eventId);
      
      if (!eventObj) {
        toast.error("Event not found");
        info.revert();
        return;
      }
      
      // Create a copy of the event with updated end time
      const updatedEvent: CalendarEvent = {
        ...eventObj,
        end: info.event.end.toISOString()
      };
      
      const success = await updateEvent(updatedEvent);
      
      if (!success) {
        toast.error("Failed to update event");
        info.revert();
      } else {
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error in handleEventResize:", error);
      toast.error("An error occurred while updating the event");
      info.revert();
    } finally {
      setIsProcessing(false);
    }
  };

  // Create event
  const handleCreateEvent = async (eventData: any): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Ensure we have the necessary type safety
      const newEvent: Omit<CalendarEvent, "id"> = {
        title: eventData.title,
        description: eventData.description || "",
        start: eventData.start, 
        end: eventData.end,
        location: eventData.location || "",
        type: eventData.type as EventType,
        created_by: eventData.created_by
      };
      
      return await addEvent(newEvent);
    } catch (error) {
      console.error("Error in handleCreateEvent:", error);
      toast.error("Failed to create event");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Update event
  const handleUpdateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Ensure event has necessary fields
      const updatedEvent: CalendarEvent = {
        ...eventData,
        description: eventData.description || ""
      };
      
      return await updateEvent(updatedEvent);
    } catch (error) {
      console.error("Error in handleUpdateEvent:", error);
      toast.error("Failed to update event");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      return await deleteEvent(eventId);
    } catch (error) {
      console.error("Error in handleDeleteEvent:", error);
      toast.error("Failed to delete event");
      return false;
    } finally {
      setIsProcessing(false);
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
    isProcessing
  };
};

export default useCalendarEventHandlers;
