
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, EventType } from "@/types/calendar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkGoogleCalendarConnection,
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent
} from "@/services/googleCalendar";

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth(); // Get current user to use for user_id

  // Check if Google Calendar is connected
  const checkGoogleConnection = useCallback(async () => {
    const isConnected = await checkGoogleCalendarConnection();
    setGoogleCalendarConnected(isConnected);
    return isConnected;
  }, []);

  // Fetch events from the database
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        throw error;
      }

      // Transform database records to CalendarEvent type
      const transformedEvents: CalendarEvent[] = data.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description || "",
        start: new Date(`${event.date}T${event.time || "00:00"}`).toISOString(),
        end: new Date(`${event.date}T${event.time || "00:00"}`).toISOString(),
        location: event.location || "",
        type: event.type as EventType,
        allDay: event.allday || false,
        image_url: event.image_url,
        created_by: event.user_id,
        google_event_id: event.google_event_id
      }));

      setEvents(transformedEvents);
      await checkGoogleConnection();
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [checkGoogleConnection]);

  // Add a new event
  const addEvent = async (eventData: Partial<CalendarEvent>): Promise<boolean> => {
    try {
      if (!user) {
        toast.error("You must be logged in to add events");
        return false;
      }

      // Format date and time for database
      const eventDate = new Date(eventData.start || "");
      const formattedDate = eventDate.toISOString().split("T")[0];
      const formattedTime = eventDate.toISOString().split("T")[1].substring(0, 8);
      
      let googleEventId = null;
      
      // If Google Calendar is connected, create the event there first
      if (googleCalendarConnected && eventData.type !== "sectional") {
        googleEventId = await createGoogleCalendarEvent(eventData as CalendarEvent);
      }
      
      // Prepare event data for Supabase
      const newEvent = {
        title: eventData.title,
        description: eventData.description,
        date: formattedDate,
        time: formattedTime,
        location: eventData.location || "",
        type: eventData.type,
        allday: eventData.allDay || false,
        image_url: eventData.image_url,
        google_event_id: googleEventId,
        user_id: user.id // Add the user_id field here
      };

      // Insert the event into the database
      const { data, error } = await supabase
        .from("calendar_events")
        .insert(newEvent)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      // Transform and add to local state
      const transformedEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        start: new Date(`${data.date}T${data.time || "00:00"}`).toISOString(),
        end: new Date(`${data.date}T${data.time || "00:00"}`).toISOString(),
        location: data.location || "",
        type: data.type as EventType,
        allDay: data.allday || false,
        image_url: data.image_url,
        created_by: data.user_id,
        google_event_id: data.google_event_id
      };

      setEvents((prevEvents) => [...prevEvents, transformedEvent]);
      toast.success("Event added successfully");
      return true;
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
      return false;
    }
  };

  // Update an existing event
  const updateEvent = async (eventData: CalendarEvent): Promise<boolean> => {
    try {
      // Format date and time for database
      const eventDate = new Date(eventData.start);
      const formattedDate = eventDate.toISOString().split("T")[0];
      const formattedTime = eventDate.toISOString().split("T")[1].substring(0, 8);
      
      // If Google Calendar is connected and the event has a Google Event ID, update it there
      if (googleCalendarConnected && eventData.google_event_id && eventData.type !== "sectional") {
        await updateGoogleCalendarEvent(eventData);
      }
      
      // Prepare update data
      const updateData = {
        title: eventData.title,
        description: eventData.description,
        date: formattedDate,
        time: formattedTime,
        location: eventData.location || "",
        type: eventData.type,
        allday: eventData.allDay || false,
        image_url: eventData.image_url,
        updated_at: new Date().toISOString()
      };

      // Update the event in the database
      const { error } = await supabase
        .from("calendar_events")
        .update(updateData)
        .eq("id", eventData.id);

      if (error) {
        throw error;
      }

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventData.id ? { ...event, ...eventData } : event
        )
      );
      
      toast.success("Event updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      // Find the event
      const eventToDelete = events.find((event) => event.id === eventId);
      
      if (!eventToDelete) {
        throw new Error("Event not found");
      }
      
      // If Google Calendar is connected and the event has a Google Event ID, delete it there
      if (googleCalendarConnected && eventToDelete.google_event_id && eventToDelete.type !== "sectional") {
        await deleteGoogleCalendarEvent(eventId, eventToDelete.google_event_id);
      }
      
      // Delete the event from the database
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", eventId);

      if (error) {
        throw error;
      }

      // Update local state
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      
      toast.success("Event deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    }
  };

  // Reset all calendar events (admin function)
  const resetCalendar = async (): Promise<boolean> => {
    try {
      // Delete all events from the database
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .neq("id", "placeholder"); // Dummy condition to delete all

      if (error) {
        throw error;
      }

      // Clear local state
      setEvents([]);
      
      toast.success("Calendar has been reset");
      return true;
    } catch (error) {
      console.error("Error resetting calendar:", error);
      toast.error("Failed to reset calendar");
      return false;
    }
  };

  // Load events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    googleCalendarConnected,
    syncing,
    checkGoogleConnection,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    resetCalendar
  };
};
