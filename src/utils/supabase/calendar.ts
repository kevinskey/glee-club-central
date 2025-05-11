
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { supabase } from "@/integrations/supabase/client";

export interface PerformanceEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  type?: string;
}

/**
 * Fetches upcoming performance events from the calendar_events table
 * @param limit Maximum number of events to return
 * @returns Array of performance events
 */
export async function fetchUpcomingPerformances(limit = 3): Promise<PerformanceEvent[]> {
  try {
    // Get current date in YYYY-MM-DD format for the query
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch upcoming concert events from Supabase
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .gte("date", today)
      .eq("type", "concert")
      .order("date", { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching upcoming performances:", error);
      throw error;
    }
    
    // Transform the data format
    if (data) {
      return data.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        location: event.location,
        description: event.description || "Join us for this special performance.",
        image: event.image_url || "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png",
        type: event.type
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error in fetchUpcomingPerformances:", error);
    return [];
  }
}

/**
 * Converts a CalendarEvent to a PerformanceEvent
 */
export function calendarEventToPerformanceEvent(event: CalendarEvent): PerformanceEvent {
  return {
    id: event.id,
    title: event.title,
    date: new Date(event.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    location: event.location,
    description: event.description || "",
    image: event.image_url || "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png",
    type: event.type
  };
}
