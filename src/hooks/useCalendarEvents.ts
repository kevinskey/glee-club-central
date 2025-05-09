
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSampleEvents } from "./useSampleEvents";
import { useCalendarOperations } from "./useCalendarOperations";
import { fetchGoogleCalendarEvents } from "@/utils/googleCalendar";

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
  const initialFetchDoneRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const [useGoogleCalendar, setUseGoogleCalendar] = useState(true);
  const googleFetchAttemptedRef = useRef(false);
  const [googleCalendarError, setGoogleCalendarError] = useState<string | null>(null);

  // Fetch events from Google Calendar
  const fetchGoogleEvents = useCallback(async () => {
    if (!useGoogleCalendar) return [];
    
    try {
      console.log("Fetching events from Google Calendar");
      googleFetchAttemptedRef.current = true;
      setGoogleCalendarError(null);
      const googleEvents = await fetchGoogleCalendarEvents();
      console.log("Google Calendar events:", googleEvents.length);
      return googleEvents;
    } catch (err) {
      console.error("Error fetching Google Calendar events:", err);
      const message = err instanceof Error ? err.message : "Failed to load events from Google Calendar";
      setGoogleCalendarError(message);
      toast.error("Failed to load events from Google Calendar. Check API key configuration.");
      return [];
    }
  }, [useGoogleCalendar]);

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    // Skip if already fetching
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    // Check if the user has changed since the last fetch
    const currentUserId = user?.id || null;
    const userChanged = currentUserId !== lastUserIdRef.current;
    
    // Update the last user ID reference
    lastUserIdRef.current = currentUserId;
    
    try {
      // First, try to fetch Google Calendar events
      let combinedEvents: CalendarEvent[] = [];
      
      if (useGoogleCalendar) {
        const googleEvents = await fetchGoogleEvents();
        
        // Add Google Calendar events
        if (googleEvents.length > 0) {
          combinedEvents = [...googleEvents];
        }
      }
      
      // Use sample data if not authenticated
      if (!user) {
        if (!initialFetchDoneRef.current || userChanged) {
          console.log("No user authenticated, using Google Calendar events or sample events");
          if (combinedEvents.length === 0) {
            combinedEvents = getSampleEvents();
          }
          setEvents(combinedEvents);
          setFetchError(false);
          initialFetchDoneRef.current = true;
          setLoading(false);
        }
        return;
      }

      if (!initialFetchDoneRef.current || userChanged) {
        setLoading(true);
      }

      // Now fetch events from Supabase to combine with Google events
      console.log("Attempting to fetch calendar events from Supabase for user:", user.id);
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching calendar events from Supabase:", error);
        // Only show toast on first error, not on every loop iteration
        if (!fetchError) {
          toast.error("Failed to load calendar events from database");
          setFetchError(true);
        }
      } else {
        setFetchError(false);
        if (data) {
          console.log("Successfully fetched calendar events from Supabase:", data.length);
          const supabaseEvents = data.map(event => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date),
            time: event.time,
            location: event.location,
            description: event.description || "",
            type: event.type as "concert" | "rehearsal" | "tour" | "special",
            image_url: event.image_url
          }));
          
          // Combine Google Calendar events with Supabase events
          combinedEvents = [...combinedEvents, ...supabaseEvents];
        }
      }
      
      // If we have no events at all, fall back to sample events
      if (combinedEvents.length === 0 && (!initialFetchDoneRef.current || userChanged)) {
        combinedEvents = getSampleEvents();
      }
      
      // Sort combined events by date
      combinedEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      setEvents(combinedEvents);
    } catch (err) {
      console.error("Error in fetchEvents:", err);
      // Only show toast on first error
      if (!fetchError) {
        toast.error("Failed to load calendar events");
        setFetchError(true);
      }
      if (!initialFetchDoneRef.current || userChanged) {
        setEvents(getSampleEvents());
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
      initialFetchDoneRef.current = true;
    }
  }, [user, getSampleEvents, fetchError, fetchGoogleEvents, useGoogleCalendar]);

  // Initialize operations hooks with the fetchEvents callback
  const { 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    isProcessing 
  } = useCalendarOperations(fetchEvents);

  // Toggle between Google Calendar and local calendar
  const toggleGoogleCalendar = useCallback(() => {
    setUseGoogleCalendar(prev => {
      const newValue = !prev;
      if (newValue) {
        toast.info("Switching to Google Calendar");
        fetchEvents(); // Refresh events when switching to Google Calendar
      } else {
        setGoogleCalendarError(null); // Clear errors when switching to local
        toast.info("Switching to local calendar");
        fetchEvents(); // Refresh events when switching to local calendar
      }
      return newValue;
    });
  }, [fetchEvents]);

  // Load events on component mount or when user changes
  useEffect(() => {
    // Reset state when user changes
    const currentUserId = user?.id || null;
    const previousUserId = lastUserIdRef.current;
    
    if (currentUserId !== previousUserId) {
      console.log("User changed, resetting events state");
      initialFetchDoneRef.current = false;
      fetchEvents();
    } else if (!initialFetchDoneRef.current) {
      fetchEvents();
    }
    
    // Increase the polling interval to reduce frequency of updates
    const intervalTime = fetchError ? 120000 : 60000; // 60 seconds normally, 2 minutes if error
    
    console.log(`Setting up events polling with interval: ${intervalTime}ms`);
    const interval = setInterval(() => {
      console.log("Polling for calendar events updates");
      fetchEvents();
    }, intervalTime);
    
    return () => {
      console.log("Clearing events polling interval");
      clearInterval(interval);
    };
  }, [user?.id, fetchEvents, fetchError]);

  return {
    events,
    loading,
    isProcessing,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    useGoogleCalendar,
    toggleGoogleCalendar,
    googleCalendarError
  };
}
