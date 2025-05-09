
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSampleEvents } from "./useSampleEvents";
import { useCalendarOperations } from "./useCalendarOperations";
import { fetchGoogleCalendarEvents, GoogleCalendarEvent } from "@/utils/googleCalendar";

export interface CalendarEvent {
  id: number | string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string | null;
  type: "concert" | "rehearsal" | "tour" | "special";
  image_url?: string | null;
  source?: "local" | "google";
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
      // Use sample data if not authenticated
      if (!user) {
        if (!initialFetchDoneRef.current || userChanged) {
          console.log("No user authenticated, using sample events");
          setEvents(getSampleEvents());
          setFetchError(false);
          initialFetchDoneRef.current = true;
          setLoading(false);
        }
        return;
      }

      if (!initialFetchDoneRef.current || userChanged) {
        setLoading(true);
      }

      // Now fetch events from Supabase
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
        
        // If this is the first fetch, use sample data as fallback
        if (!initialFetchDoneRef.current || userChanged) {
          setEvents(getSampleEvents());
        }
      } else {
        setFetchError(false);
        let supabaseEvents: CalendarEvent[] = [];
        
        if (data) {
          console.log("Successfully fetched calendar events from Supabase:", data.length);
          supabaseEvents = data.map(event => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date),
            time: event.time,
            location: event.location,
            description: event.description || "",
            type: event.type as "concert" | "rehearsal" | "tour" | "special",
            image_url: event.image_url,
            source: "local"
          }));
        }
        
        // Try to fetch Google Calendar events
        try {
          console.log("Attempting to fetch Google Calendar events");
          const googleEvents = await fetchGoogleCalendarEvents(undefined, undefined, 90);
          
          // Mark events as coming from Google Calendar
          const formattedGoogleEvents = googleEvents.map(event => ({
            ...event,
            source: "google" as const
          }));
          
          // Merge events, avoiding duplicates by using the id as a key
          const combinedEvents = [...supabaseEvents];
          
          // Only add Google events that don't have the same title and date as local events
          formattedGoogleEvents.forEach(googleEvent => {
            const sameEvent = supabaseEvents.find(event => 
              event.title === googleEvent.title && 
              event.date.toDateString() === googleEvent.date.toDateString()
            );
            
            if (!sameEvent) {
              combinedEvents.push(googleEvent);
            }
          });
          
          setEvents(combinedEvents);
          console.log("Combined events count:", combinedEvents.length);
          
        } catch (googleErr) {
          console.error("Error fetching Google Calendar events:", googleErr);
          // If Google Calendar fetch fails, still use Supabase events
          setEvents(supabaseEvents.length > 0 ? supabaseEvents : getSampleEvents());
        }
      }
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
    deleteEvent
  };
}
