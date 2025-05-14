
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, EventType } from '@/types/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

/**
 * Custom hook for managing calendar events
 * @returns Calendar events and operations
 */
export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch all calendar events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform database records to CalendarEvent format with proper type casting
      const formattedEvents: CalendarEvent[] = data.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.date,
        end: event.date,
        date: event.date,
        time: event.time,
        location: event.location,
        type: event.type as EventType, // Cast string to EventType
        image_url: event.image_url,
        created_by: event.user_id
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Add a new event
  const addEvent = async (eventData: any): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add events');
      return false;
    }
    
    try {
      // Format the event data for database insertion
      let formattedDate: string;
      if (typeof eventData.date === 'string') {
        formattedDate = eventData.date;
      } else if (eventData.date instanceof Date) {
        formattedDate = eventData.date.toISOString().split('T')[0];
      } else {
        // Default to today if date is missing
        formattedDate = new Date().toISOString().split('T')[0];
      }
      
      const eventType = eventData.type as EventType || 'special';
      
      const event = {
        user_id: user.id,
        title: eventData.title,
        date: formattedDate,
        time: eventData.time || '00:00:00',
        location: eventData.location || '',
        description: eventData.description || '',
        type: eventType,
        image_url: eventData.image_url || null
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(event)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add the new event to the state
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        start: data.date,
        end: data.date,
        date: data.date,
        time: data.time,
        location: data.location,
        type: data.type as EventType,
        image_url: data.image_url,
        created_by: data.user_id
      };
      
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event added successfully');
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
      return false;
    }
  };
  
  // Update an existing event
  const updateEvent = useCallback(async (eventData: CalendarEvent) => {
    if (!user) {
      toast.error("You must be logged in to update events");
      return false;
    }
    
    try {
      // Format date for database
      let formattedDate: string;
      if (typeof eventData.date === 'string') {
        formattedDate = eventData.date;
      } else if (eventData.date instanceof Date) {
        formattedDate = eventData.date.toISOString().split('T')[0];
      } else {
        // Use start date if date field is missing
        formattedDate = new Date(eventData.start).toISOString().split('T')[0];
      }
      
      const { error } = await supabase
        .from('calendar_events')
        .update({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          date: formattedDate,
          time: eventData.time,
          type: eventData.type,
          allday: eventData.allDay || false
        })
        .eq('id', eventData.id);
      
      if (error) {
        console.error("Error updating event:", error);
        toast.error("Failed to update event");
        return false;
      }
      
      // Convert start and end dates to their appropriate types
      const updatedEvent = {
        ...eventData,
        start: typeof eventData.start === 'string' ? new Date(eventData.start) : eventData.start,
        end: typeof eventData.end === 'string' ? new Date(eventData.end) : eventData.end
      };
      
      // Update the event in the local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventData.id ? updatedEvent : event
        )
      );
      
      return true;
    } catch (error) {
      console.error("Error in updateEvent:", error);
      toast.error("An error occurred while updating the event");
      return false;
    }
  }, [user]);
  
  // Delete an event
  const deleteEvent = useCallback(async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete events");
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
        return false;
      }
      
      // Remove the event from the local state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      
      return true;
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      toast.error("An error occurred while deleting the event");
      return false;
    }
  }, [user]);
  
  // Import multiple events (from iCal or Google Calendar)
  const importEvents = useCallback(async (importedEvents: any[]) => {
    if (!user) {
      toast.error("You must be logged in to import events");
      return;
    }
    
    try {
      const eventsToAdd = [];
      
      for (const event of importedEvents) {
        // Format the event for the database
        const formattedDate = new Date(event.start).toISOString().split('T')[0];
        const formattedTime = new Date(event.start).toTimeString().slice(0, 5);
        const eventType = (event.type || 'special') as EventType;
        
        const eventData = {
          title: event.title || 'Imported Event',
          description: event.description || '',
          location: event.location || '',
          date: formattedDate,
          time: formattedTime,
          user_id: user.id,
          type: eventType,
          allday: event.allDay || false,
          external_id: event.external_id || null
        };
        
        eventsToAdd.push(eventData);
      }
      
      if (eventsToAdd.length > 0) {
        const { data, error } = await supabase
          .from('calendar_events')
          .insert(eventsToAdd)
          .select();
        
        if (error) {
          console.error("Error importing events:", error);
          toast.error("Failed to import events");
          return;
        }
        
        // Add the imported events to the local state
        await fetchEvents();
        
        toast.success(`Imported ${eventsToAdd.length} events successfully`);
      }
    } catch (error) {
      console.error("Error in importEvents:", error);
      toast.error("An error occurred while importing events");
    }
  }, [user, fetchEvents]);
  
  // Reset all calendar events (admin function)
  const resetCalendar = async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all events
        
      if (error) {
        throw error;
      }
      
      // Clear events from state
      setEvents([]);
      toast.success('Calendar has been reset');
      return true;
    } catch (error) {
      console.error('Error resetting calendar:', error);
      toast.error('Failed to reset calendar');
      return false;
    }
  };
  
  // Initialize events
  useState(() => {
    if (user) {
      fetchEvents();
    }
  });
  
  return {
    events,
    loading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    importEvents,
    resetCalendar
  };
}
