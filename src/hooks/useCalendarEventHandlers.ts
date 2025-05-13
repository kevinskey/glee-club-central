
import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { toast } from "sonner";

interface EventHandlersProps {
  events: CalendarEvent[];
  updateEvent: (event: CalendarEvent) => Promise<boolean>;
  addEvent: (event: Partial<CalendarEvent>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
  setSelectedDate: (date: Date | null) => void;
  setIsCreateModalOpen: (isOpen: boolean) => void;
}

export const useCalendarEventHandlers = ({
  events,
  updateEvent,
  addEvent,
  deleteEvent,
  setSelectedEvent,
  setIsViewModalOpen,
  setSelectedDate,
  setIsCreateModalOpen
}: EventHandlersProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle date click - open create event modal
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsCreateModalOpen(true);
  };

  // Handle event click - open view event modal
  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const event = events.find(e => e.id === eventId);
    
    if (event) {
      setSelectedEvent(event);
      setIsViewModalOpen(true);
    }
  };

  // Handle event drag and drop - update event dates
  const handleEventDrop = async (info: any) => {
    const eventId = info.event.id;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const updatedEvent: CalendarEvent = {
        ...event,
        start: info.event.start.toISOString(),
        end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString(),
        allDay: info.event.allDay
      };
      
      const success = await updateEvent(updatedEvent);
      
      if (!success) {
        info.revert();
      }
    } catch (error) {
      console.error("Error updating event after drop:", error);
      toast.error("Failed to update event");
      info.revert();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle event resize - update event duration
  const handleEventResize = async (info: any) => {
    const eventId = info.event.id;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const updatedEvent: CalendarEvent = {
        ...event,
        start: info.event.start.toISOString(),
        end: info.event.end.toISOString(),
        allDay: info.event.allDay
      };
      
      const success = await updateEvent(updatedEvent);
      
      if (!success) {
        info.revert();
      }
    } catch (error) {
      console.error("Error updating event after resize:", error);
      toast.error("Failed to update event");
      info.revert();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle create event form submission
  const handleCreateEvent = async (eventData: any): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Add required fields if not provided
      const enhancedData: Partial<CalendarEvent> = {
        ...eventData,
        allDay: eventData.allDay || false,
        end: eventData.end || eventData.start
      };
      
      return await addEvent(enhancedData);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update event form submission
  const handleUpdateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      return await updateEvent(eventData);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      return await deleteEvent(eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent
  };
};
