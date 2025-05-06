
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSampleEvents } from "./useSampleEvents";
import { useCalendarOperations } from "./useCalendarOperations";

export interface CalendarEvent {
  id: number | string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string | null;
  type: "concert" | "rehearsal" | "tour" | "special";
  image_url?: string | null;
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { getSampleEvents } = useSampleEvents();

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        // Use sample data if not authenticated
        setEvents(getSampleEvents());
        return;
      }

      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching calendar events:", error);
        toast.error("Failed to load calendar events");
        // Fall back to sample data
        setEvents(getSampleEvents());
        return;
      }

      if (data) {
        const formattedEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          time: event.time,
          location: event.location,
          description: event.description || "",
          type: event.type as "concert" | "rehearsal" | "tour" | "special",
          image_url: event.image_url
        }));
        
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Error in fetchEvents:", err);
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  }, [user, getSampleEvents]);

  // Initialize operations hooks with the fetchEvents callback
  const { 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    isProcessing 
  } = useCalendarOperations(fetchEvents);

  // Load events on component mount or when user changes
  useEffect(() => {
    fetchEvents();
  }, [user?.id, fetchEvents]);

  return {
    events,
    loading,
    isProcessing,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent
  };
}
