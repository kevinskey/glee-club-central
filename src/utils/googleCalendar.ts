
import { format, parseISO, addDays } from 'date-fns';
import { CalendarEvent } from '@/hooks/useCalendarEvents';

// This is the public Google Calendar ID for Spelman College Glee Club
// Make sure this is the correct calendar ID for your Google Calendar
const GOOGLE_CALENDAR_ID = "00f2c84ca319b84d9b2adafc6434d2ddd7c3aa3da4dfc458cc5d633926a2e437@group.calendar.google.com";

// Your Google Calendar API key
// This should be a valid API key from Google Cloud Console with Google Calendar API enabled
const GOOGLE_CALENDAR_API_KEY = "AIzaSyCd8BS6BiOBgn89dCvGAsa5qTXT0j0S3Vc"; 

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

// Fetch events from Google Calendar
export async function fetchGoogleCalendarEvents(
  timeMin: string = new Date().toISOString(),
  timeMax: string = new Date(addDays(new Date(), 90)).toISOString(),  // Default to 90 days ahead
  daysAhead?: number, // New parameter for days ahead
): Promise<CalendarEvent[]> {
  try {
    // Check if API key is available
    if (!GOOGLE_CALENDAR_API_KEY || GOOGLE_CALENDAR_API_KEY.length === 0) {
      console.error('Google Calendar API key is missing');
      throw new Error('Google Calendar API key is missing');
    }

    // If daysAhead is specified, override the timeMax
    if (daysAhead !== undefined && daysAhead > 0) {
      timeMax = new Date(addDays(new Date(), daysAhead)).toISOString();
      console.log(`Fetching Google Calendar events for the next ${daysAhead} days`);
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?key=${encodeURIComponent(GOOGLE_CALENDAR_API_KEY)}&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`;
    
    console.log("Fetching Google Calendar events...");
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch Google Calendar events:', errorData);
      
      // Get a more specific error message if available
      const errorMessage = errorData.error?.message || `HTTP error ${response.status}`;
      throw new Error(`Google Calendar API error: ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log("Successfully fetched Google Calendar events:", data.items?.length || 0);
    
    // Transform Google Calendar events to our app's format
    return data.items?.map((event: GoogleCalendarEvent) => transformGoogleEvent(event)) || [];
    
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw error;
  }
}

// Helper function to transform Google Calendar event to app format
function transformGoogleEvent(event: GoogleCalendarEvent): CalendarEvent {
  // Get start date and time
  const startDateTime = event.start.dateTime || event.start.date;
  const startDate = startDateTime ? parseISO(startDateTime) : new Date();
  
  // Format time string
  const hasTime = !!event.start.dateTime;
  const timeString = hasTime 
    ? `${format(startDate, 'h:mm a')} - ${format(parseISO(event.end.dateTime!), 'h:mm a')}`
    : 'All day';
  
  // Determine event type based on summary or description
  const summary = event.summary?.toLowerCase() || '';
  let eventType: "concert" | "rehearsal" | "tour" | "special" = "special";
  
  if (summary.includes('concert') || summary.includes('performance')) {
    eventType = "concert";
  } else if (summary.includes('rehearsal') || summary.includes('practice')) {
    eventType = "rehearsal";
  } else if (summary.includes('tour')) {
    eventType = "tour";
  }
  
  return {
    id: event.id,
    title: event.summary || "Untitled Event",
    date: startDate,
    time: timeString,
    location: event.location || "No location specified",
    description: event.description || "",
    type: eventType
  };
}

// Create URL to add an event to Google Calendar
export function getAddToGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${format(event.date, 'yyyyMMdd')}/${format(event.date, 'yyyyMMdd')}`,
    details: event.description || '',
    location: event.location || '',
    trp: 'true', // Show as busy
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Create URL to view the Google Calendar
export function getViewGoogleCalendarUrl(): string {
  return `https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`;
}
