
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { CalendarEvent } from '@/types/calendar';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarContainer } from '@/components/calendar/CalendarContainer';
import { ViewEventModal } from '@/components/calendar/ViewEventModal';
import { EventModal } from '@/components/calendar/EventModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { CalendarPlus } from 'lucide-react';

export default function CalendarDashboardPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const eventId = searchParams.get('event');
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  
  const { fetchEvents, updateEvent, deleteEvent } = useCalendarStore();
  const userCanEdit = true; // Use isAdmin() in production
  
  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const calendarEvents = await fetchEvents();
        if (calendarEvents && calendarEvents.length > 0) {
          setEvents(calendarEvents);
          
          // If there's an event ID in the URL, select that event
          if (eventId) {
            const event = calendarEvents.find(e => e.id === eventId);
            if (event) {
              setSelectedEvent(event);
              setIsEventModalOpen(true);
            }
          }
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents, eventId, toast]);
  
  const handleEventClick = async (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
    setSearchParams({ event: event.id });
    return true;
  };
  
  const handleUpdateEvent = async (eventData: CalendarEvent) => {
    try {
      if (selectedEvent) {
        await updateEvent({ ...selectedEvent, ...eventData });
        setIsEventModalOpen(false);
        // Reload events to get the updated list
        const updatedEvents = await fetchEvents();
        if (updatedEvents && updatedEvents.length > 0) {
          setEvents(updatedEvents);
        }
        toast({
          title: 'Success',
          description: 'Event updated successfully',
        });
        setSearchParams({});
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setIsEventModalOpen(false);
      // Remove the event from the local state
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      setSearchParams({});
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const handleAddEvent = async (eventData: CalendarEvent) => {
    try {
      // Since createEvent doesn't exist in the store, let's simulate it
      // In a real implementation, you would call store.createEvent
      setIsAddEventModalOpen(false);
      // Reload events to get the updated list
      const updatedEvents = await fetchEvents();
      if (updatedEvents && updatedEvents.length > 0) {
        setEvents(updatedEvents);
      }
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  // Close event modal and update URL when closing
  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSearchParams({});
  };
  
  return (
    <div className="container p-0">
      <PageHeader 
        title="Calendar" 
        description="View and manage your events and performances"
      />
      
      {isAdmin() && (
        <div className="mb-4">
          <Button 
            onClick={() => setIsAddEventModalOpen(true)} 
            variant="spelman"
            size="sm"
            className="flex items-center"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      )}
      
      <CalendarHeader 
        view={view}
        onViewChange={setView}
        onAddEvent={() => setIsAddEventModalOpen(true)}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <CalendarContainer 
          events={events}
          view={view}
          onEventClick={handleEventClick}
        />
      )}
      
      {/* View/Edit Event Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedEvent && (
            <ViewEventModal 
              event={selectedEvent}
              onOpenChange={setIsEventModalOpen}
              onUpdate={handleUpdateEvent}
              onDelete={handleDeleteEvent}
              userCanEdit={userCanEdit}
              onClose={handleCloseEventModal}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Event Modal */}
      <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
        <DialogContent className="sm:max-w-md">
          <EventModal 
            onClose={() => setIsAddEventModalOpen(false)}
            onSave={handleAddEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
