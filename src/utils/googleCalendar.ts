
// Utility functions for Google Calendar integration
import { CalendarEvent } from "@/hooks/useCalendarEvents";

export function getAddToGoogleCalendarUrl(event?: CalendarEvent): string {
  // If no event provided, return Google Calendar home page
  if (!event) return "https://calendar.google.com/";
  
  // Format date for Google Calendar URL
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  // Build Google Calendar URL
  const startDate = formatDate(event.start);
  const endDate = formatDate(event.end);
  
  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE`;
  url += `&text=${encodeURIComponent(event.title)}`;
  url += `&dates=${startDate}/${endDate}`;
  
  if (event.location) {
    url += `&location=${encodeURIComponent(event.location)}`;
  }
  
  if (event.description) {
    url += `&details=${encodeURIComponent(event.description)}`;
  }
  
  return url;
}

export function getViewGoogleCalendarUrl(): string {
  return "https://calendar.google.com/";
}
