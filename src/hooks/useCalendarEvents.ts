import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchGoogleCalendarEvents } from "@/services/googleCalendar";

// Define acceptable event types to enforce type safety
export type EventType = "concert" | "rehearsal" | "tour" | "special";

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
  type: EventType;
  image_url?: string;
  allDay?: boolean;
  source?: string;     // Used to identify events from external sources like Google Calendar
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [useGoogleCalendar, setUseGoogleCalendar] = useState(false);
  const [googleCalendarError, setGoogleCalendarError] = useState<string | null>(null);
  const [daysAhead, setDaysAhead] = useState(90); // Default to 90 days ahead
  const { isAuthenticated, user } = useAuth();
  
  // Toggle between Google Calendar and local calendar
  const toggleGoogleCalendar = useCallback(() => {
    setUseGoogleCalendar(prev => !prev);
  }, []);
  
  // Fetch events from the database
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    console.info('Fetching calendar events updates');

    try {
      let calendarEvents: CalendarEvent[] = [];
      
      if (isAuthenticated && user) {
        // Always fetch local events from Supabase
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

        // Transform database events to CalendarEvent type with explicit typing
        calendarEvents = dbEvents.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),      // Convert string to Date
          start: new Date(event.date),     // Set start date
          end: new Date(event.date),       // Set end date to same day by default
          time: event.time,
          location: event.location,
          description: event.description || "",
          // Ensure type is cast to one of the allowed values
          type: validateEventType(event.type),
          image_url: event.image_url,
          allDay: !event.time,  // If no time specified, treat as all-day event
          source: "local"
        }));

        console.info(`Successfully fetched ${calendarEvents.length} calendar events from Supabase`);
        
        // If Google Calendar is enabled, fetch Google events
        if (useGoogleCalendar) {
          try {
            console.info(`Fetching Google Calendar events for the next ${daysAhead} days`);
            setGoogleCalendarError(null);
            
            const googleEvents = await fetchGoogleCalendarEvents(daysAhead);
            console.info(`Successfully fetched ${googleEvents.length} events from Google Calendar`);
            
            // Combine with local events
            calendarEvents = [...calendarEvents, ...googleEvents];
            
            // Sort events by start date
            calendarEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
            
          } catch (googleError) {
            console.error('Error fetching Google Calendar events:', googleError);
            setGoogleCalendarError(String(googleError));
            toast.error('Failed to load Google Calendar events');
          }
        }
      }
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, useGoogleCalendar, daysAhead]);

  // Helper function to validate and cast event types
  const validateEventType = (type: string): EventType => {
    const validTypes: EventType[] = ["concert", "rehearsal", "tour", "special"];
    return validTypes.includes(type as EventType) 
      ? (type as EventType) 
      : "special"; // Default to special if invalid
  };

  // Add a new event
  const addEvent = async (event: Omit<CalendarEvent, "id">): Promise<CalendarEvent | null> => {
    try {
      if (!user) {
        toast.error("You must be logged in to save events");
        return null;
      }

      // Ensure event type is valid before saving
      const validatedType = validateEventType(event.type);

      // Prepare event data for database
      const newEvent = {
        title: event.title,
        date: event.start.toISOString().split('T')[0],  // Convert Date to YYYY-MM-DD
        time: event.time,
        location: event.location,
        description: event.description,
        type: validatedType,
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
          type: validateEventType(data[0].type),
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

      // Ensure event type is valid before updating
      const validatedType = validateEventType(event.type);

      // Update in database
      const { error } = await supabase
        .from("calendar_events")
        .update({
          title: event.title,
          date: event.start.toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          description: event.description,
          type: validatedType,
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
  }, [isAuthenticated, fetchEvents, useGoogleCalendar, daysAhead]);

  return { 
    events, 
    loading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    useGoogleCalendar,
    toggleGoogleCalendar,
    googleCalendarError,
    daysAhead,
    setDaysAhead
  };
}
