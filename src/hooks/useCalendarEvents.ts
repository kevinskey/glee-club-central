
import { useState, useEffect, useCallback, useRef } from "react";
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
  const fetchingRef = useRef(false);
  const [fetchError, setFetchError] = useState(false);

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    // Prevent multiple simultaneous fetch attempts
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    setLoading(true);
    try {
      // Use sample data if not authenticated
      if (!user) {
        console.log("No user authenticated, using sample events");
        setEvents(getSampleEvents());
        setFetchError(false);
        return;
      }

      console.log("Attempting to fetch calendar events from Supabase");
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching calendar events:", error);
        // Only show toast on first error, not on every loop iteration
        if (!fetchError) {
          toast.error("Failed to load calendar events");
          setFetchError(true);
        }
        // Fall back to sample data
        setEvents(getSampleEvents());
        return;
      }

      setFetchError(false);
      if (data) {
        console.log("Successfully fetched calendar events:", data.length);
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
      // Only show toast on first error
      if (!fetchError) {
        toast.error("Failed to load calendar events");
        setFetchError(true);
      }
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [user, getSampleEvents, fetchError]);

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
    // Set a longer retry interval if there was a previous error
    const intervalTime = fetchError ? 30000 : 5000;
    
    // Only set up polling if authenticated
    if (user) {
      console.log(`Setting up events polling with interval: ${intervalTime}ms`);
      const interval = setInterval(() => {
        console.log("Polling for calendar events updates");
        fetchEvents();
      }, intervalTime);
      
      return () => clearInterval(interval);
    }
  }, [user?.id, fetchEvents, fetchError]);

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
