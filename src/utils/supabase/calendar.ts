
// This file is kept for backward compatibility
import { supabase } from "@/integrations/supabase/client";

// Define the PerformanceEvent type to match what's used in components
export interface PerformanceEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string; // This will store the image URL
  image_url?: string; // To maintain compatibility with the calendar_events table
  type: string;
  allday: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  google_event_id?: string;
  last_synced_at?: string;
}

// Function to fetch upcoming performances - made limit optional with a high default
export const fetchUpcomingPerformances = async (limit = 100) => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('type', 'concert')
    .gte('date', currentDate)
    .order('date', { ascending: true })
    .limit(limit);
    
  if (error) {
    console.error("Error fetching upcoming performances:", error);
    return [];
  }
  
  // Map the data to include an image property for compatibility
  const events = data.map(event => ({
    ...event,
    image: event.image_url // Add image property that points to image_url for compatibility
  }));
  
  return events;
};

// Function to convert calendar events to performance events
export const mapCalendarToPerformanceEvents = (events: any[]): PerformanceEvent[] => {
  return events.map(event => ({
    ...event,
    image: event.image_url // Map image_url to image for compatibility
  }));
};
