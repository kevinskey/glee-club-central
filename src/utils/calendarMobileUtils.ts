
import { CalendarEvent } from "@/types/calendar";
import { isSameDay } from "date-fns";

/**
 * Gets events for a specific date from the events array
 */
export function getEventsForDate(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = event.start instanceof Date ? event.start : new Date(event.start);
    return isSameDay(eventDate, date);
  });
}

/**
 * Formats time text for mobile display
 */
export function formatTimeForMobile(timeStr: string): string {
  if (!timeStr) return "";
  
  // Try to parse time if it's in HH:MM format
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  }
  
  return timeStr;
}

/**
 * Calculate event display specifics based on device size
 */
export function getCalendarDisplaySettings(isMobile: boolean) {
  return {
    eventLimit: isMobile ? 2 : 3,
    headerFormat: isMobile ? { month: 'short', year: 'numeric' } : { month: 'long', year: 'numeric' },
    dayViewFormat: isMobile ? { month: 'short', day: 'numeric' } : { month: 'long', day: 'numeric', year: 'numeric' },
    columnWidth: isMobile ? '3rem' : '6rem',
    minHeight: isMobile ? '450px' : '600px',
    maxEventsVisible: isMobile ? 2 : 4
  };
}

/**
 * Determine if a calendar view is suitable for the current screen size
 */
export function getSuitableCalendarView(isMobile: boolean, desktopView: string): string {
  if (!isMobile) return desktopView;
  
  // Suggest better views for mobile
  switch (desktopView) {
    case 'dayGridMonth':
      return 'listWeek'; // List view is better on small screens
    case 'timeGridWeek':
      return 'timeGridDay'; // Day view is better than week on mobile
    default:
      return desktopView;
  }
}

/**
 * Creates compressed event title suitable for mobile display
 */
export function getCompressedEventTitle(title: string): string {
  if (!title) return "";
  if (title.length <= 20) return title;
  
  // Try to find logical break points
  const breakPoint = title.indexOf(' ', 15);
  if (breakPoint > 0) {
    return title.substring(0, breakPoint) + '...';
  }
  
  return title.substring(0, 17) + '...';
}
