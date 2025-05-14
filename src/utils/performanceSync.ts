
import { supabase } from "@/integrations/supabase/client";
import { updateHeroImageWithEvents } from "./heroImageUtils";

export interface PerformanceEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  type: string;
  allday: boolean;
}

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
  
  // Map the data to include an image property
  return data.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description || '',
    date: event.date,
    time: event.time,
    location: event.location || '',
    image: event.image_url,
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
    
    // Update hero images with these events
    if (data && data.length > 0) {
      await updateHeroImageWithEvents(data);
    }
    
    return true;
  } catch (error) {
    console.error("Error synchronizing performances:", error);
    return false;
  }
};
