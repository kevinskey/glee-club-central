
import { CalendarEvent } from '@/types/calendar';

/**
 * Finds the next upcoming event from a list of calendar events
 * @param events Array of calendar events
 * @param includePrivate Whether to include private events (default: true for members)
 * @returns The next upcoming event or null if none found
 */
export const findNextEvent = (events: CalendarEvent[], includePrivate: boolean = true): CalendarEvent | null => {
  const now = new Date();
  
  // Filter events that haven't started yet
  const upcomingEvents = events.filter(event => {
    const eventStart = new Date(event.start_time);
    const shouldInclude = includePrivate || !event.is_private;
    return eventStart > now && shouldInclude;
  });
  
  // Sort by start time and return the earliest
  if (upcomingEvents.length === 0) return null;
  
  return upcomingEvents.sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )[0];
};

/**
 * Formats a date for display in dashboard components
 */
export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Formats a time for display in dashboard components
 */
export const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};
