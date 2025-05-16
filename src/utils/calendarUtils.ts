
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

/**
 * Formats a date for display
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Formats a time for display
 */
export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return time;
  }
};

/**
 * Gets badge style for event type
 */
export const getEventTypeBadgeStyle = (type: string): string => {
  switch (type) {
    case 'concert': 
      return 'bg-glee-purple/20 text-glee-purple';
    case 'rehearsal': 
      return 'bg-blue-500/20 text-blue-600';
    case 'sectional': 
      return 'bg-green-500/20 text-green-600';
    case 'special': 
      return 'bg-amber-500/20 text-amber-600';
    default: 
      return 'bg-gray-200 text-gray-700';
  }
};

/**
 * Gets background color for event type
 */
export const getEventTypeColor = (type: string): string => {
  switch (type) {
    case 'concert': return '#7c3aed';
    case 'rehearsal': return '#3b82f6';
    case 'sectional': return '#10b981';
    case 'special': return '#f59e0b';
    default: return '#6b7280';
  }
};

/**
 * Filters events by type
 */
export const filterEventsByType = (events: CalendarEvent[], type: string): CalendarEvent[] => {
  if (type === 'all') return events;
  return events.filter(event => event.type === type);
};

/**
 * Gets only upcoming events
 */
export const getUpcomingEvents = (events: CalendarEvent[], limit = 5): CalendarEvent[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return events
    .filter(event => new Date(event.start) >= today)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, limit);
};
