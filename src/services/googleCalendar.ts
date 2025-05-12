import { CalendarEvent, EventType } from "@/hooks/useCalendarEvents";

const API_KEY = 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs'; // Demo key for placeholder - would be replaced with a real key
const CALENDAR_ID = 'primary'; // Default to user's primary calendar

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  colorId?: string;
}

/**
 * Fetches events from Google Calendar API
 */
export const fetchGoogleCalendarEvents = async (
  daysAhead: number = 90
): Promise<CalendarEvent[]> => {
  try {
    // Calculate time range
    const timeMin = new Date().toISOString();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + daysAhead);
    
    // Build Google Calendar API URL with query parameters
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('timeMin', timeMin);
    url.searchParams.append('timeMax', timeMax.toISOString());
    url.searchParams.append('singleEvents', 'true');
    url.searchParams.append('orderBy', 'startTime');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Google Calendar events to our app's format
    return data.items.map((event: GoogleCalendarEvent) => transformGoogleEvent(event));
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw error;
  }
};

/**
 * Transform Google Calendar event to our app's format
 */
const transformGoogleEvent = (event: GoogleCalendarEvent): CalendarEvent => {
  // Determine if it's an all-day event
  const isAllDay = !event.start.dateTime;
  
  // Parse dates from Google's format
  const startDate = isAllDay 
    ? new Date(event.start.date!) 
    : new Date(event.start.dateTime!);
  
  const endDate = isAllDay 
    ? new Date(event.end.date!) 
    : new Date(event.end.dateTime!);
  
  // If it's an all-day event, Google sets the end date to the day after
  // Adjust for display purposes
  if (isAllDay) {
    endDate.setDate(endDate.getDate() - 1);
  }
  
  // Determine event type based on summary or colorId
  let eventType: EventType = "special";
  if (event.summary?.toLowerCase().includes('rehearsal')) {
    eventType = "rehearsal";
  } else if (event.summary?.toLowerCase().includes('concert')) {
    eventType = "concert";
  } else if (event.summary?.toLowerCase().includes('tour')) {
    eventType = "tour";
  }

  return {
    id: `google_${event.id}`,
    title: event.summary,
    description: event.description || "",
    date: startDate, // For backward compatibility
    start: startDate,
    end: endDate,
    time: isAllDay ? undefined : startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: event.location || "",
    type: eventType,
    allDay: isAllDay,
    source: "google"
  };
};

/**
 * Get URL to add event to Google Calendar
 */
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

/**
 * Get URL to view Google Calendar
 */
export function getViewGoogleCalendarUrl(): string {
  return "https://calendar.google.com/";
}
