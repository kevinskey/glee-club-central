
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarContainer } from '@/components/calendar/CalendarContainer';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { ViewEventModal } from '@/components/calendar/ViewEventModal';
import { EventModal } from '@/components/calendar/EventModal';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types/calendar';

function CalendarPage() {
  // State
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Access store
  const { 
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
        const calendarEvents = await fetchEvents();
        if (calendarEvents) {
          setEvents(calendarEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load calendar events');
      }
    };
    loadEvents();
  }, [fetchEvents]);
  
  // Handle event click
  const handleEventClick = async (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
    return true;
  };
  
  // Add event wrapper
  const addEvent = async (eventData: any): Promise<boolean> => {
    try {
      const result = await storeAddEvent(eventData);
      setIsCreateModalOpen(false);
      
      // Refresh events after adding
      const updatedEvents = await fetchEvents();
      if (updatedEvents) {
        setEvents(updatedEvents);
      }
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      return false;
    }
  };
  
  // Update event wrapper
  const updateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      const result = await storeUpdateEvent(eventData);
      setIsViewModalOpen(false);
      
      // Refresh events after updating
      const updatedEvents = await fetchEvents();
      if (updatedEvents) {
        setEvents(updatedEvents);
      }
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  };
  
  // Delete event wrapper
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const result = await storeDeleteEvent(eventId);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      
      // Refresh events after deleting
      const updatedEvents = await fetchEvents();
      if (updatedEvents) {
        setEvents(updatedEvents);
      }
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  };
  
  // Reset calendar
  const resetCalendar = useCallback(async () => {
    try {
      const result = await storeResetCalendar();
      toast.success("Calendar has been reset to defaults");
      
      // Refresh events after resetting
      const updatedEvents = await fetchEvents();
      if (updatedEvents) {
        setEvents(updatedEvents);
      }
      return true;
    } catch (error) {
      console.error("Error resetting calendar:", error);
      toast.error("Failed to reset calendar");
      return false;
    }
  }, [fetchEvents, storeResetCalendar]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <CalendarHeader 
        onAddEvent={() => setIsCreateModalOpen(true)}
        view={view}
        onViewChange={setView}
        onResetCalendar={resetCalendar}
      />
      
      <CalendarContainer 
        events={events}
        view={view}
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
          onOpenChange={setIsViewModalOpen}
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
