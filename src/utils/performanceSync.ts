
import { supabase } from '@/integrations/supabase/client';

// Define the common interface to be used across components
export interface PerformanceEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description?: string;
  image?: string;
  type: string;
}

// Define the CalendarEvent interface
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  type: 'event' | 'rehearsal' | 'performance';
  allDay?: boolean;
  image_url?: string;
}

/**
 * Fetch upcoming performance events from Supabase calendar_events table
 */
export async function fetchUpcomingPerformances(limit: number = 3): Promise<PerformanceEvent[]> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('type', 'performance')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching performances:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    // Map database results to PerformanceEvent interface
    return data.map(item => ({
      id: item.id,
      title: item.title,
      date: item.date,
      time: item.time,
      location: item.location,
      description: item.description,
      image: item.image_url,
      type: item.type
    }));
  } catch (error) {
    console.error('Unexpected error fetching performances:', error);
    return [];
  }
}

/**
 * Convert database calendar events to format needed for the calendar component
 */
export function convertToCalendarEvents(events: any[]): CalendarEvent[] {
  return events.map(event => {
    // Parse date and time strings
    const eventDate = new Date(event.date);
    
    // Create start and end times (defaults to all-day if no time specified)
    let start = new Date(eventDate);
    let end = new Date(eventDate);
    let allDay = true;
    
    if (event.time) {
      const timeParts = event.time.split(' - ');
      if (timeParts.length > 0) {
        // Try to parse start time
        const startTime = parseTimeString(timeParts[0]);
        if (startTime) {
          start.setHours(startTime.hours, startTime.minutes);
          allDay = false;
        }
        
        // Try to parse end time if available
        if (timeParts.length > 1) {
          const endTime = parseTimeString(timeParts[1]);
          if (endTime) {
            end.setHours(endTime.hours, endTime.minutes);
            allDay = false;
          } else {
            // If no valid end time, set default duration of 1 hour
            end.setHours(start.getHours() + 1, start.getMinutes());
          }
        } else {
          // If no end time specified, default to 1 hour duration
          end.setHours(start.getHours() + 1, start.getMinutes());
        }
      }
    }
    
    // Ensure the event type matches the CalendarEvent type
    const eventType = (event.type === 'event' || event.type === 'rehearsal' || event.type === 'performance')
      ? event.type as 'event' | 'rehearsal' | 'performance'
      : 'event';
      
    return {
      id: event.id,
      title: event.title,
      start: start,
      end: end,
      description: event.description || '',
      location: event.location || '',
      type: eventType,
      allDay: allDay,
      image_url: event.image_url,
    };
  });
}

/**
 * Parse time strings in various formats
 */
function parseTimeString(timeStr: string): { hours: number, minutes: number } | null {
  // Remove any whitespace
  timeStr = timeStr.trim();
  
  // Try various time formats
  
  // Format: "HH:MM AM/PM"
  const standardMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/);
  if (standardMatch) {
    let hours = parseInt(standardMatch[1], 10);
    const minutes = parseInt(standardMatch[2], 10);
    const period = standardMatch[3].toLowerCase();
    
    if (period === 'pm' && hours < 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    
    return { hours, minutes };
  }
  
  // Format: "HH:MM" (24-hour)
  const militaryMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (militaryMatch) {
    const hours = parseInt(militaryMatch[1], 10);
    const minutes = parseInt(militaryMatch[2], 10);
    return { hours, minutes };
  }
  
  // Format: "HH AM/PM" (no minutes)
  const shortMatch = timeStr.match(/^(\d{1,2})\s*(AM|PM|am|pm)$/);
  if (shortMatch) {
    let hours = parseInt(shortMatch[1], 10);
    const period = shortMatch[2].toLowerCase();
    
    if (period === 'pm' && hours < 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }
    
    return { hours, minutes: 0 };
  }
  
  return null;
}
