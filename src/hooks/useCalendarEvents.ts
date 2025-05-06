
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
  const initialFetchDoneRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Fetch events from Supabase
  const fetchEvents = useCallback(async () => {
    // Skip if already fetching
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    try {
      // Check if the user has changed since the last fetch
      const currentUserId = user?.id || null;
      const userChanged = currentUserId !== lastUserIdRef.current;
      
      // Update the last user ID reference
      lastUserIdRef.current = currentUserId;
      
      // Use sample data if not authenticated
      if (!user) {
        if (!initialFetchDoneRef.current || userChanged) {
          console.log("No user authenticated, using sample events");
          const sampleEvents = getSampleEvents();
          setEvents(sampleEvents);
          setFetchError(false);
          initialFetchDoneRef.current = true;
          setLoading(false);
        }
        return;
      }

      if (!initialFetchDoneRef.current || userChanged) {
        setLoading(true);
      }

      console.log("Attempting to fetch calendar events from Supabase for user:", user.id);
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
        if (!initialFetchDoneRef.current || userChanged) {
          setEvents(getSampleEvents());
        }
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
    const intervalTime = fetchError ? 120000 : 30000; // 30 seconds normally, 2 minutes if error
    
    // Only set up polling if authenticated
    if (user) {
      console.log(`Setting up events polling with interval: ${intervalTime}ms for user: ${user.id}`);
      const interval = setInterval(() => {
        console.log("Polling for calendar events updates");
        fetchEvents();
      }, intervalTime);
      
      return () => {
        console.log("Clearing events polling interval");
        clearInterval(interval);
      };
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
