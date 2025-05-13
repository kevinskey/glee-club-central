
import { useState, useCallback, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useCalendarStore() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch events from the database
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load calendar events");
        return;
      }
      
      // Transform the data into CalendarEvent format
      const transformedEvents: CalendarEvent[] = data.map((event: any) => {
        const startDate = new Date(`${event.date}T${event.time || '00:00:00'}`);
        
        // Default end time is 1 hour after start time
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);
        
        return {
          id: event.id,
          title: event.title,
          description: event.description || '',
          location: event.location || '',
          date: new Date(event.date),
          time: event.time || '00:00',
          start: startDate,
          end: event.end_time ? new Date(`${event.date}T${event.end_time}`) : endDate,
          type: event.type,
          created_by: event.user_id,
          allDay: event.allday || false,
          source: event.google_event_id ? 'google' : 'local'
        };
      });
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error in fetchEvents:", error);
      toast.error("An error occurred while loading events");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Add a new event
  const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) {
      toast.error("You must be logged in to add events");
      return false;
    }
    
    try {
      // Format date for database
      const formattedDate = eventData.date.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          date: formattedDate,
          time: eventData.time,
          type: eventData.type,
          user_id: user.id,
          allday: eventData.allDay || false
        })
        .select();
      
      if (error) {
        console.error("Error adding event:", error);
        toast.error("Failed to add event");
        return false;
      }
      
      // Add the new event to the local state
      const newEvent: CalendarEvent = {
        ...eventData,
        id: data[0].id,
        created_by: user.id,
        source: 'local'
      };
      
      setEvents(prevEvents => [...prevEvents, newEvent]);
      return true;
    } catch (error) {
      console.error("Error in addEvent:", error);
      toast.error("An error occurred while adding the event");
      return false;
    }
  }, [user]);
  
  // Update an existing event
  const updateEvent = useCallback(async (eventData: CalendarEvent) => {
    if (!user) {
      toast.error("You must be logged in to update events");
      return false;
    }
    
    try {
      // Format date for database
      const formattedDate = eventData.date.toISOString().split('T')[0];
      
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
      
      // Update the event in the local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventData.id ? eventData : event
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
        
        const eventData = {
          title: event.title || 'Imported Event',
          description: event.description || '',
          location: event.location || '',
          date: formattedDate,
          time: formattedTime,
          user_id: user.id,
          type: event.type || 'special',
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
  
  // Initialize events when component mounts
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);
  
  return {
    events,
    isLoading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    importEvents
  };
}
