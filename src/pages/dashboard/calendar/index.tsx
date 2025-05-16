
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarContainer } from '@/components/calendar/CalendarContainer';
import { useCalendarStore } from '@/hooks/useCalendarStore'; // Fixed import path
import { ViewEventModal } from '@/components/calendar/ViewEventModal';
import { EventModal } from '@/components/calendar/EventModal'; // Using named import
import { toast } from 'sonner';

function CalendarPage() {
  // State
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Access store
  const { 
    events: storeEvents,
    fetchEvents, 
    addEvent: storeAddEvent,
    updateEvent: storeUpdateEvent,
    deleteEvent: storeDeleteEvent,
    resetCalendar: storeResetCalendar
  } = useCalendarStore();

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
        setEvents(storeEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load calendar events');
      }
    };

    loadEvents();
  }, [fetchEvents, storeEvents]);

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  // Add event wrapper
  const addEvent = async (eventData: any): Promise<boolean> => {
    try {
      await storeAddEvent(eventData);
      setIsCreateModalOpen(false);
      toast.success("Event created successfully");
      return true;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return false;
    }
  };

  // Update event wrapper
  const updateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      await storeUpdateEvent(eventData);
      setIsViewModalOpen(false);
      toast.success("Event updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };

  // Delete event wrapper
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      await storeDeleteEvent(eventId);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    }
  };

  // Reset calendar
  const resetCalendar = useCallback(async (): Promise<boolean> => {
    try {
      await storeResetCalendar();
      toast.success("Calendar has been reset to defaults");
      return true;
    } catch (error) {
      console.error("Error resetting calendar:", error);
      toast.error("Failed to reset calendar");
      return false;
    }
  }, [storeResetCalendar]);

  return (
    <div className="container mx-auto px-4 py-8">
      <CalendarHeader 
        onAddEvent={() => setIsCreateModalOpen(true)} // Fixed prop name
        view={view}
        onViewChange={setView}
        onResetCalendar={resetCalendar}
      />

      <CalendarContainer 
        events={events}
        onEventClick={handleEventClick}
      />

      {isCreateModalOpen && (
        <EventModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSave={addEvent}
        />
      )}

      {isViewModalOpen && selectedEvent && (
        <ViewEventModal
          onClose={() => setIsViewModalOpen(false)}
          event={selectedEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
          userCanEdit={true}
        />
      )}
    </div>
  );
}

export default CalendarPage;
