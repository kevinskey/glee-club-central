
import React from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, EventType } from '@/types/calendar';

// Handler for adding event - Fixed to correctly handle asynchronous operations
const handleAddEvent = async (eventData: any, addEvent: Function, setIsCreateModalOpen: Function): Promise<void> => {
  try {
    // Format the data to match what the store expects and ensure id is present
    const newEvent: CalendarEvent = {
      id: eventData.id || uuidv4(),
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      type: eventData.type as EventType,
      start: new Date(eventData.date),
      end: new Date(eventData.date),
      image_url: eventData.image_url || null
    };
    
    await addEvent(newEvent);
    toast.success("Event created successfully");
    setIsCreateModalOpen(false);
    return Promise.resolve();
  } catch (error) {
    console.error("Error adding event:", error);
    toast.error("Failed to create event");
    return Promise.reject(error);
  }
};

// Handle updating event - Fixed to correctly handle asynchronous operations
const handleUpdateEvent = async (eventData: CalendarEvent, updateEvent: Function, setIsViewModalOpen: Function): Promise<boolean> => {
  try {
    await updateEvent(eventData);
    toast.success("Event updated successfully");
    setIsViewModalOpen(false);
    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    toast.error("Failed to update event");
    return false;
  }
};

// Handle deleting event - Fixed to correctly handle asynchronous operations
const handleDeleteEvent = async (eventId: string, deleteEvent: Function, setIsViewModalOpen: Function, setSelectedEvent: Function): Promise<boolean> => {
  try {
    await deleteEvent(eventId);
    toast.success("Event deleted successfully");
    setIsViewModalOpen(false);
    setSelectedEvent(null);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    toast.error("Failed to delete event");
    return false;
  }
};

export { handleAddEvent, handleUpdateEvent, handleDeleteEvent };
