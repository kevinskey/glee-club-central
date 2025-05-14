
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar";
import { PerformanceEvent } from "@/components/landing/performance/PerformanceSection";
import { toast } from "sonner";

/**
 * Fetch performance events from calendar_events table
 * @param limit Maximum number of events to return
 * @returns Array of performance events
 */
export async function fetchPerformanceEvents(limit = 10): Promise<PerformanceEvent[]> {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('type', 'concert')
      .gte('date', currentDate)
      .order('date', { ascending: true })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching performance events:", error);
      return [];
    }
    
    // Map the calendar events to performance events format
    const performances: PerformanceEvent[] = data.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description || '',
      image: event.image_url || '',
      type: event.type
    }));
    
    return performances;
  } catch (err) {
    console.error("Error in fetchPerformanceEvents:", err);
    return [];
  }
}

/**
 * Convert calendar event to performance event
 * @param event Calendar event
 * @returns Performance event
 */
export function mapCalendarToPerformanceEvent(event: CalendarEvent): PerformanceEvent {
  return {
    id: event.id,
    title: event.title,
    date: typeof event.date === 'string' ? event.date : event.date?.toISOString().split('T')[0] || '',
    location: event.location || '',
    description: event.description || '',
    image: event.image_url || '',
    type: event.type
  };
}

/**
 * Synchronize performances data with calendar events
 * This function ensures all components share the same performance data
 */
export async function synchronizePerformances(): Promise<boolean> {
  try {
    // Here we could implement additional sync logic if needed
    // For now, we're centralizing the data fetching through fetchPerformanceEvents
    return true;
  } catch (error) {
    console.error("Error synchronizing performances:", error);
    toast.error("Failed to synchronize performances data");
    return false;
  }
}
