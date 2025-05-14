
import { CalendarEvent } from "@/types/calendar";

export const useCalendarEventHandlers = (
  events: CalendarEvent[],
  updateEvent: (event: CalendarEvent) => Promise<boolean>,
  addEvent: (event: Omit<CalendarEvent, "id">) => Promise<boolean>,
  deleteEvent: (id: string) => Promise<boolean>,
  setSelectedEvent: (event: CalendarEvent | null) => void,
  setIsViewModalOpen: (isOpen: boolean) => void,
  setSelectedDate: (date: Date | null) => void,
  setIsCreateModalOpen: (isOpen: boolean) => void
) => {
  // Handle date click - open create event modal with selected date
  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsCreateModalOpen(true);
  };
  
  // Handle event click - open view/edit modal for the selected event
  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const clickedEvent = events.find(event => event.id === eventId);
    
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setIsViewModalOpen(true);
    }
  };
  
  // Handle event drag and drop - update event with new dates
  const handleEventDrop = (info: any) => {
    const eventId = info.event.id;
    const updatedEvent = events.find(event => event.id === eventId);
    
    if (updatedEvent) {
      const newEvent = {
        ...updatedEvent,
        start: info.event.start,
        end: info.event.end || info.event.start
      };
      
      updateEvent(newEvent);
    }
  };
  
  // Handle event resize - update event with new end time
  const handleEventResize = (info: any) => {
    const eventId = info.event.id;
    const updatedEvent = events.find(event => event.id === eventId);
    
    if (updatedEvent) {
      const newEvent = {
        ...updatedEvent,
        start: info.event.start,
        end: info.event.end
      };
      
      updateEvent(newEvent);
    }
  };
  
  // Handle create event - add new event to database
  const handleCreateEvent = async (eventData: any) => {
    return await addEvent(eventData);
  };
  
  // Handle update event - update existing event in database
  const handleUpdateEvent = async (eventData: CalendarEvent) => {
    return await updateEvent(eventData);
  };
  
  // Handle delete event - delete event from database
  const handleDeleteEvent = async (eventId: string) => {
    return await deleteEvent(eventId);
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
