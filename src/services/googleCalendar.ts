
import { CalendarEvent, EventType } from "@/hooks/useCalendarEvents";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constants for Google Calendar API
const GOOGLE_API_BASE_URL = 'https://www.googleapis.com/calendar/v3';

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
 * Get user's Google Calendar token from Supabase
 */
export const getGoogleCalendarToken = async (): Promise<string | null> => {
  try {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("No session found. User must be logged in to access Google Calendar.");
      return null;
    }
    
    // Get Google Calendar token from user's metadata
    const { data: userTokenData, error } = await supabase.functions.invoke('get-google-token', {
      body: { userId: session.user.id }
    });
    
    if (error || !userTokenData?.token) {
      console.error("Error getting Google token:", error || "No token found");
      return null;
    }
    
    return userTokenData.token;
  } catch (error) {
    console.error("Error in getGoogleCalendarToken:", error);
    return null;
  }
};

/**
 * Start Google OAuth Flow
 */
export const startGoogleOAuth = async (): Promise<string | null> => {
  try {
    // Get the auth URL from our edge function
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'getAuthUrl' }
    });
    
    if (error || !data?.authUrl) {
      console.error("Error getting Google OAuth URL:", error || "No URL returned");
      return null;
    }
    
    return data.authUrl;
  } catch (error) {
    console.error("Error in startGoogleOAuth:", error);
    return null;
  }
};

/**
 * Handle OAuth callback
 */
export const handleOAuthCallback = async (code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'handleCallback', code }
    });
    
    if (error || !data?.success) {
      console.error("Error handling OAuth callback:", error || "Failed to complete OAuth flow");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in handleOAuthCallback:", error);
    return false;
  }
};

/**
 * Check if user has connected Google Calendar
 */
export const checkGoogleCalendarConnection = async (): Promise<boolean> => {
  const token = await getGoogleCalendarToken();
  return !!token;
};

/**
 * Fetches events from Google Calendar API using OAuth token
 */
export const fetchGoogleCalendarEvents = async (
  daysAhead: number = 90
): Promise<CalendarEvent[]> => {
  try {
    // Get OAuth token
    const token = await getGoogleCalendarToken();
    
    if (!token) {
      console.log("No Google Calendar token found. Using simulated events.");
      return simulateCalendarEvents(daysAhead);
    }
    
    // Calculate time range
    const timeMin = new Date().toISOString();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + daysAhead);
    
    // Fetch events from Google Calendar API
    const response = await fetch(
      `${GOOGLE_API_BASE_URL}/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax.toISOString())}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.error(`Google Calendar API error (${response.status}): ${response.statusText}`);
      
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshGoogleToken();
        if (refreshed) {
          // Try again with new token
          return fetchGoogleCalendarEvents(daysAhead);
        }
      }
      
      // Fallback to simulated data
      return simulateCalendarEvents(daysAhead);
    }
    
    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      console.error("Invalid response format from Google Calendar API:", data);
      return simulateCalendarEvents(daysAhead);
    }
    
    console.log(`Successfully fetched ${data.items.length} events from Google Calendar`);
    
    // Transform Google Calendar events to our app's format
    return data.items.map((event: GoogleCalendarEvent) => transformGoogleEvent(event));
    
  } catch (error) {
    console.error('Error in fetchGoogleCalendarEvents:', error);
    return simulateCalendarEvents(daysAhead);
  }
};

/**
 * Refresh Google token if expired
 */
export const refreshGoogleToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'refreshToken' }
    });
    
    if (error || !data?.success) {
      console.error("Error refreshing Google token:", error || "Failed to refresh token");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in refreshGoogleToken:", error);
    return false;
  }
};

/**
 * Disconnect Google Calendar
 */
export const disconnectGoogleCalendar = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'disconnect' }
    });
    
    if (error || !data?.success) {
      console.error("Error disconnecting Google Calendar:", error || "Failed to disconnect");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in disconnectGoogleCalendar:", error);
    return false;
  }
};

/**
 * Simulates Google Calendar events for testing purposes
 */
const simulateCalendarEvents = (daysAhead: number): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const today = new Date();
  
  // Generate some example events
  const eventTypes: EventType[] = ['rehearsal', 'concert', 'tour', 'special'];
  const locations = [
    'Sisters Chapel', 
    'Cosby Auditorium', 
    'Fine Arts Building', 
    'Giles Hall', 
    'Atlanta Symphony Hall'
  ];
  
  // Generate events for the next few weeks
  for (let i = 1; i <= 10; i++) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + Math.floor(Math.random() * daysAhead));
    
    // Randomize event details
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isAllDay = Math.random() > 0.7;
    const startHour = isAllDay ? 0 : 9 + Math.floor(Math.random() * 10); // Between 9am and 7pm
    
    // Set time 
    eventDate.setHours(startHour, Math.floor(Math.random() * 4) * 15, 0); // Hours, minutes (0, 15, 30, 45)
    
    // Create end date (1-3 hours after start)
    const endDate = new Date(eventDate);
    if (!isAllDay) {
      endDate.setHours(endDate.getHours() + 1 + Math.floor(Math.random() * 2));
    }
    
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate event title based on type
    let title = '';
    switch (type) {
      case 'rehearsal':
        title = `Glee Club ${isAllDay ? 'All-Day ' : ''}Rehearsal`;
        break;
      case 'concert':
        title = `${['Spring', 'Summer', 'Fall', 'Winter', 'Holiday'][Math.floor(Math.random() * 5)]} Concert`;
        break;
      case 'tour':
        title = `${['East Coast', 'West Coast', 'Southern', 'Midwest', 'International'][Math.floor(Math.random() * 5)]} Tour`;
        break;
      default:
        title = `Special Event: ${['Fundraiser', 'Workshop', 'Masterclass', 'Meeting'][Math.floor(Math.random() * 4)]}`;
    }
    
    events.push({
      id: `google_sim_${i}`,
      title,
      description: `This is a simulated ${type} event for testing purposes.`,
      date: eventDate, // For backward compatibility
      start: eventDate,
      end: endDate,
      time: isAllDay ? undefined : eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location,
      type,
      allDay: isAllDay,
      source: "google"
    });
  }
  
  return events;
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
