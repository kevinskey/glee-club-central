
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define the event type enum
export type EventType = "concert" | "rehearsal" | "sectional" | "special" | "tour";

// Define the CalendarEvent interface
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  start: Date;
  end: Date;
  type: EventType;
  created_by?: string;
  image_url?: string;
  source?: 'local' | 'google'; // Source of the event
  allDay?: boolean; // Added allDay property
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useGoogleCalendar, setUseGoogleCalendar] = useState<boolean>(false);
  const [googleCalendarError, setGoogleCalendarError] = useState<string | null>(null);
  const [daysAhead, setDaysAhead] = useState<number>(30);
  const { user } = useAuth();

  // Fetch events from Supabase database
  const fetchEvents = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      console.log("Fetching events from Supabase");
      
      // Get events from the database
      const { data: dbEvents, error } = await supabase
        .from("calendar_events")
        .select("*");
      
      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load calendar events");
        setLoading(false);
        return;
      }
      
      console.log(`Retrieved ${dbEvents.length} events from Supabase`);
      
      // Map the database events to CalendarEvent objects
      const mappedEvents: CalendarEvent[] = dbEvents.map(event => {
        const date = new Date(event.date);
        const [hour, minute] = event.time.split(':').map(Number);
        
        date.setHours(hour, minute, 0, 0);
        
        // Set end time to 1 hour after start by default
        const endDate = new Date(date);
        endDate.setHours(endDate.getHours() + 1);
        
        return {
          id: event.id,
          title: event.title,
          description: event.description || "",
          location: event.location,
          date: new Date(event.date), // Keep original date without time
          time: event.time,
          start: date, // Date with time
          end: endDate,
          type: event.type as EventType,
          created_by: event.user_id,
          image_url: event.image_url,
          source: 'local',
          // Handle allDay property with a fallback to false if undefined
          allDay: Boolean(event.allDay),
        };
      });
      
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error in fetchEvents:", error);
      toast.error("An error occurred while loading calendar events");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch of events
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  // Add a new event
  const addEvent = async (eventData: Omit<CalendarEvent, "id">): Promise<CalendarEvent | null> => {
    if (!user) {
      toast.error("You must be logged in to add events");
      return null;
    }
    
    try {
      console.log("Adding event:", eventData);
      
      // Format the date as ISO string for database
      const formattedDate = eventData.date.toISOString().split('T')[0];
      
      // Insert event into the database
      const { data, error } = await supabase
        .from("calendar_events")
        .insert({
          title: eventData.title,
          date: formattedDate,
          time: eventData.time,
          location: eventData.location,
          description: eventData.description,
          type: eventData.type,
          user_id: user.id,
          image_url: eventData.image_url,
          allDay: eventData.allDay // Add allDay to the database insert
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding event:", error);
        toast.error("Failed to add event");
        return null;
      }
      
      // Create a CalendarEvent from the inserted data
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        location: data.location,
        date: new Date(data.date),
        time: data.time,
        start: new Date(data.date + 'T' + data.time),
        end: new Date(new Date(data.date + 'T' + data.time).getTime() + 3600000), // Add 1 hour
        type: data.type as EventType,
        created_by: data.user_id,
        image_url: data.image_url,
        source: 'local',
        allDay: data.allDay,
      };
      
      // Add to local events array
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      return newEvent;
    } catch (error) {
      console.error("Error in addEvent:", error);
      toast.error("An error occurred while adding the event");
      return null;
    }
  };

  // Update an existing event
  const updateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to update events");
      return false;
    }
    
    try {
      console.log("Updating event:", eventData);
      
      // Format the date as ISO string for database
      const formattedDate = eventData.date.toISOString().split('T')[0];
      
      // Update event in the database
      const { error } = await supabase
        .from("calendar_events")
        .update({
          title: eventData.title,
          date: formattedDate,
          time: eventData.time,
          location: eventData.location,
          description: eventData.description,
          type: eventData.type,
          image_url: eventData.image_url,
          allDay: eventData.allDay // Add allDay to the update
        })
        .eq("id", eventData.id);
      
      if (error) {
        console.error("Error updating event:", error);
        toast.error("Failed to update event");
        return false;
      }
      
      // Update local events array
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventData.id 
            ? {
                ...event,
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
                date: new Date(formattedDate),
                time: eventData.time,
                start: new Date(formattedDate + 'T' + eventData.time),
                end: new Date(new Date(formattedDate + 'T' + eventData.time).getTime() + 3600000),
                type: eventData.type,
                image_url: eventData.image_url,
                allDay: eventData.allDay
              }
            : event
        )
      );
      
      toast.success("Event updated successfully");
      return true;
    } catch (error) {
      console.error("Error in updateEvent:", error);
      toast.error("An error occurred while updating the event");
      return false;
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to delete events");
      return false;
    }
    
    try {
      console.log("Deleting event:", eventId);
      
      // Delete event from the database
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", eventId);
      
      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event");
        return false;
      }
      
      // Remove from local events array
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      
      toast.success("Event deleted successfully");
      return true;
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      toast.error("An error occurred while deleting the event");
      return false;
    }
  };

  // Toggle Google Calendar integration
  const toggleGoogleCalendar = () => {
    setUseGoogleCalendar(!useGoogleCalendar);
  };

  // New function to reset all calendar events
  const resetCalendar = async (): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Resetting calendar...");
      
      // If you want to delete all events from database
      if (user && window.confirm("Are you sure you want to delete all calendar events? This action cannot be undone.")) {
        const { error } = await supabase
          .from("calendar_events")
          .delete()
          .neq("id", "dummy"); // This condition will match all records
          
        if (error) {
          console.error("Error resetting calendar:", error);
          toast.error("Failed to reset calendar");
          return false;
        }
        
        // Clear local events array
        setEvents([]);
        toast.success("Calendar has been reset successfully");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error in resetCalendar:", error);
      toast.error("An error occurred while resetting the calendar");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    useGoogleCalendar,
    toggleGoogleCalendar,
    googleCalendarError,
    daysAhead,
    setDaysAhead,
    resetCalendar
  };
}
