
import { supabase } from "@/integrations/supabase/client";
import { updateHeroImageWithEvents } from "./heroImageUtils";
import { PerformanceEvent } from "@/types/performance";
import { CalendarEvent } from "@/types/calendar";

/**
 * Fetches performance events from the calendar_events table
 */
export const fetchPerformanceEvents = async (limit = 3): Promise<PerformanceEvent[]> => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('type', 'concert')
    .gte('date', currentDate)
    .order('date', { ascending: true })
    .limit(limit);
    
  if (error) {
    console.error("Error fetching upcoming performance events:", error);
    return [];
  }
  
  // Map the data to include both image and image_url properties for compatibility
  return data.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description || '',
    date: event.date,
    time: event.time,
    location: event.location || '',
    image: event.image_url, // Map image_url to image for backwards compatibility
    image_url: event.image_url,
    type: event.type,
    allday: event.allday || false
  }));
};

/**
 * Synchronizes the performances with calendar events and updates hero images
 */
export const synchronizePerformances = async (): Promise<boolean> => {
  try {
    // Get all calendar events first
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('date', { ascending: true });
      
    if (error) {
      console.error("Error fetching calendar events for sync:", error);
      return false;
    }
    
    // Convert calendar events to the format expected by updateHeroImageWithEvents
    if (data && data.length > 0) {
      const calendarEvents: CalendarEvent[] = data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.date),
        end: new Date(event.date),
        description: event.description,
        location: event.location,
        type: event.type,
        image_url: event.image_url,
        allDay: event.allday
      }));
      
      await updateHeroImageWithEvents(calendarEvents);
    }
    
    return true;
  } catch (error) {
    console.error("Error synchronizing performances:", error);
    return false;
  }
};
