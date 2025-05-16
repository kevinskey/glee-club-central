
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarContainer } from '@/components/calendar/CalendarContainer';
import { useCalendarStore } from '@/hooks/useCalendarStore'; 
import { ViewEventModal } from '@/components/calendar/ViewEventModal';
import { EventModal } from '@/components/calendar/EventModal';
import { toast } from 'sonner';

// Helper functions for event operations
const handleAddEvent = async (
  eventData: any, 
  storeAddEvent: Function, 
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

const handleUpdateEvent = async (
  eventData: CalendarEvent, 
  storeUpdateEvent: Function, 
  setIsViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

const handleDeleteEvent = async (
  eventId: string, 
  storeDeleteEvent: Function,
  setIsViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<CalendarEvent | null>>
) => {
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
        setEvents(calendarEvents || []);
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load calendar events');
      }
    };

    loadEvents();
  }, [fetchEvents]);

  // Handle event click
  const handleEventClick = async (event: CalendarEvent): Promise<boolean> => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
    return Promise.resolve(true);
  };

  // Add event wrapper
  const addEvent = async (eventData: any): Promise<boolean> => {
    return handleAddEvent(eventData, storeAddEvent, setIsCreateModalOpen)
      .then(() => {
        // Refresh events after adding
        return fetchEvents().then((updatedEvents) => {
          setEvents(updatedEvents || []);
          return true;
        });
      })
      .catch(() => false);
  };

  // Update event wrapper
  const updateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    return handleUpdateEvent(eventData, storeUpdateEvent, setIsViewModalOpen);
  };

  // Delete event wrapper
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    return handleDeleteEvent(eventId, storeDeleteEvent, setIsViewModalOpen, setSelectedEvent);
  };

  // Reset calendar
  const resetCalendar = useCallback(async (): Promise<boolean> => {
    try {
      await storeResetCalendar();
      toast.success("Calendar has been reset to defaults");
      
      // Refresh events after resetting
      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents || []);
      
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
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={addEvent}
        />
      )}

      {isViewModalOpen && selectedEvent && (
        <ViewEventModal
          isOpen={isViewModalOpen}
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
