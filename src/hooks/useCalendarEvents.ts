
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Export CalendarEvent type to be used across components
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;          // For backward compatibility
  start: Date;         // New standardized field
  end: Date;           // New standardized field
  time?: string;       // Keep for backward compatibility
  location: string;
  type: string;
  image_url?: string;
  allDay?: boolean;
  source?: string;     // Used to identify events from external sources like Google Calendar
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  // Fetch events from the database
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    console.info('Fetching calendar events updates');

    try {
      if (isAuthenticated && user) {
        console.info(`Attempting to fetch calendar events from Supabase for user: ${user.id}`);
        
        // Fetch from Supabase
        const { data: dbEvents, error } = await supabase
          .from("calendar_events")
          .select("*")
          .order("date", { ascending: true });
          
        if (error) {
          console.error('Error fetching events from database:', error);
          toast.error('Failed to load calendar events');
          return;
        }

        // Transform database events to CalendarEvent type
        const transformedEvents: CalendarEvent[] = dbEvents.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),      // Convert string to Date
          start: new Date(event.date),     // Set start date
          end: new Date(event.date),       // Set end date to same day by default
          time: event.time,
          location: event.location,
          description: event.description || "",
          type: event.type,
          image_url: event.image_url,
          allDay: !event.time  // If no time specified, treat as all-day event
        }));

        console.info(`Successfully fetched ${transformedEvents.length} calendar events from Supabase`);
        
        // In a real app, you'd also fetch Google Calendar events here
        console.info('Using mock events for now');
        
        setEvents(transformedEvents);
      }
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Add a new event
  const addEvent = async (event: Omit<CalendarEvent, "id">): Promise<CalendarEvent | null> => {
    try {
      if (!user) {
        toast.error("You must be logged in to save events");
        return null;
      }

      // Prepare event data for database
      const newEvent = {
        title: event.title,
        date: event.start.toISOString().split('T')[0],  // Convert Date to YYYY-MM-DD
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type,
        image_url: event.image_url,
        user_id: user.id
      };

      // Insert into database
      const { data, error } = await supabase
        .from("calendar_events")
        .insert([newEvent])
        .select();

      if (error) {
        console.error("Error adding event:", error);
        toast.error("Failed to save event");
        return null;
      }

      // Create CalendarEvent object from response
      if (data && data[0]) {
        const newCalendarEvent: CalendarEvent = {
          id: data[0].id,
          title: data[0].title,
          date: new Date(data[0].date),
          start: new Date(data[0].date),
          end: new Date(data[0].date),
          time: data[0].time,
          location: data[0].location,
          description: data[0].description || "",
          type: data[0].type,
          image_url: data[0].image_url
        };
        
        // Refresh events list
        await fetchEvents();
        
        return newCalendarEvent;
      }
      return null;
    } catch (err) {
      console.error("Error in addEvent:", err);
      toast.error("Failed to save event");
      return null;
    }
  };

  // Update an existing event
  const updateEvent = async (event: CalendarEvent): Promise<boolean> => {
    try {
      // Check if this is a Google Calendar event
      if (event.source === "google") {
        toast.info("Google Calendar events can only be edited in Google Calendar");
        return false;
      }
      
      if (!user) {
        toast.error("You must be logged in to update events");
        return false;
      }

      // Update in database
      const { error } = await supabase
        .from("calendar_events")
        .update({
          title: event.title,
          date: event.start.toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          description: event.description,
          type: event.type,
          image_url: event.image_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", event.id);

      if (error) {
        console.error("Error updating event:", error);
        toast.error("Failed to update event");
        return false;
      }

      // Refresh events list
      await fetchEvents();
      return true;
    } catch (err) {
      console.error("Error in updateEvent:", err);
      toast.error("Failed to update event");
      return false;
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      // Check if this is a Google Calendar event
      if (eventId.includes('_')) {
        toast.info("Google Calendar events can only be deleted in Google Calendar");
        return false;
      }
      
      if (!user) {
        toast.error("You must be logged in to delete events");
        return false;
      }

      // Delete from database
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
        return false;
      }

      // Refresh events list
      await fetchEvents();
      return true;
    } catch (err) {
      console.error("Error in deleteEvent:", err);
      toast.error("Failed to delete event");
      return false;
    }
  };

  // Initial fetch of events
  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
    
    // Set up polling for new events
    console.info('Setting up events polling with interval: 60000ms');
    const intervalId = setInterval(fetchEvents, 60000);
    
    return () => {
      console.info('Clearing events polling interval');
      clearInterval(intervalId);
    };
  }, [isAuthenticated, fetchEvents]);

  return { 
    events, 
    loading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
}
