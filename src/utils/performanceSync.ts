
import { supabase } from "@/integrations/supabase/client";
import { PerformanceEvent } from "@/types/performance";
import { CalendarEvent } from "@/types/calendar";

/**
 * Fetches upcoming performance events
 * @param limit Maximum number of events to return (default: 4)
 * @returns Array of performance events
 */
export const fetchPerformanceEvents = async (limit: number = 4): Promise<PerformanceEvent[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('type', 'concert')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching performance events:", error);
      return [];
    }

    // Transform the calendar events into performance events
    const performanceEvents: PerformanceEvent[] = data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time || '',
      location: event.location || '',
      image: event.image_url, // Map image_url to image
      image_url: event.image_url,
      type: event.type,
      allday: event.allday || false
    }));
    
    return performanceEvents;
  } catch (error) {
    console.error("Failed to fetch performance events:", error);
    return [];
  }
};

/**
 * Gets performance events formatted as calendar events
 * @param limit Maximum number of events to return
 * @returns Array of calendar events
 */
export const getPerformanceEvents = async (limit: number = 10): Promise<CalendarEvent[]> => {
  try {
    const performanceEvents = await fetchPerformanceEvents(limit);
    
    // Convert to CalendarEvent format
    return performanceEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.date,
      end: event.date,
      description: event.description,
      location: event.location,
      type: 'concert',
      image_url: event.image_url,
      allDay: event.allday || false
    }));
  } catch (error) {
    console.error("Error converting performance events:", error);
    return [];
  }
};

/**
 * Converts a date string to a formatted date for display
 * @param dateString Date string in format YYYY-MM-DD
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export const formatEventDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};
