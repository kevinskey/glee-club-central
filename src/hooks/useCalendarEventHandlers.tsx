
import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { toast } from "sonner";

export const useCalendarEventHandlers = (
  events: CalendarEvent[],
  updateEvent: (event: CalendarEvent) => Promise<boolean>,
  addEvent: (event: any) => Promise<boolean>,
  deleteEvent: (id: string) => Promise<boolean>,
  setSelectedEvent: (event: CalendarEvent | null) => void,
  setIsViewModalOpen: (open: boolean) => void,
  setSelectedDate: (date: Date | null) => void,
  setIsCreateModalOpen: (open: boolean) => void
) => {

  const handleDateClick = (info: any) => {
    const date = info.date;
    setSelectedDate(date);
    setIsCreateModalOpen(true);
  };

  const handleEventClick = (info: any) => {
    const clickedEvent = events.find(
      (event) => event.id === info.event.id
    );
    
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setIsViewModalOpen(true);
    }
  };

  const handleEventDrop = async (info: any) => {
    try {
      const eventId = info.event.id;
      const newStart = info.event.start;
      
      const eventToUpdate = events.find(event => event.id === eventId);
      
      if (eventToUpdate) {
        const updatedEvent = {
          ...eventToUpdate,
          start: newStart,
          end: info.event.end || newStart,
          date: newStart
        };
        
        await updateEvent(updatedEvent);
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      info.revert();
    }
  };

  const handleEventResize = async (info: any) => {
    try {
      const eventId = info.event.id;
      const newEnd = info.event.end;
      
      const eventToUpdate = events.find(event => event.id === eventId);
      
      if (eventToUpdate) {
        const updatedEvent = {
          ...eventToUpdate,
          end: newEnd
        };
        
        await updateEvent(updatedEvent);
        toast.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      info.revert();
    }
  };

  // Modified to return Promise<boolean> instead of Promise<void>
  const handleCreateEvent = async (eventData: any): Promise<boolean> => {
    try {
      const success = await addEvent(eventData);
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

  // Modified to return Promise<boolean> instead of Promise<void>
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

  // Modified to return Promise<boolean> instead of Promise<void>
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
