import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarEvent, EventType } from "@/types/calendar";

// Constants
const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar";
const SUPABASE_PROJECT_URL = "https://dzzptovqfqausipsgabw.supabase.co";

// Type definitions for Google Calendar
interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GoogleEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
}

/**
 * Begins OAuth2 flow with Google Calendar
 */
export const startGoogleOAuth = async (): Promise<string | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    toast.error("You need to be logged in to connect Google Calendar");
    return null;
  }
  
  try {
    // Get redirect URL from the edge function
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'get_auth_url' }
    });
    
    if (error) throw error;
    if (!data || !data.authUrl) throw new Error('No auth URL returned');
    
    return data.authUrl;
  } catch (error) {
    console.error("Error starting Google OAuth flow:", error);
    toast.error("Failed to start Google authentication");
    return null;
  }
};

/**
 * Check if the user has a valid Google Calendar connection
 */
export const checkGoogleCalendarConnection = async (): Promise<boolean> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) return false;
  
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'check_connection' }
    });
    
    if (error) throw error;
    return data?.connected || false;
  } catch (error) {
    console.error("Error checking Google Calendar connection:", error);
    return false;
  }
};

/**
 * Get access token for Google Calendar API
 */
export const getGoogleCalendarToken = async (): Promise<string | null> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) return null;
  
  try {
    const { data, error } = await supabase.functions.invoke('get-google-token', {
      body: { userId: user.user.id }
    });
    
    if (error) throw error;
    return data?.token || null;
  } catch (error) {
    console.error("Error getting Google Calendar token:", error);
    return null;
  }
};

/**
 * Disconnect Google Calendar
 */
export const disconnectGoogleCalendar = async (): Promise<boolean> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    toast.error("You need to be logged in to disconnect Google Calendar");
    return false;
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'disconnect' }
    });
    
    if (error) throw error;
    
    if (data?.success) {
      toast.success("Google Calendar disconnected successfully");
      return true;
    } else {
      toast.error("Failed to disconnect Google Calendar");
      return false;
    }
  } catch (error) {
    console.error("Error disconnecting from Google Calendar:", error);
    toast.error("Failed to disconnect Google Calendar");
    return false;
  }
};

/**
 * Fetch events from Google Calendar
 */
export const fetchGoogleCalendarEvents = async (
  calendarId = 'primary',
  timeMin = new Date().toISOString(),
  timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
): Promise<CalendarEvent[]> => {
  const token = await getGoogleCalendarToken();
  if (!token) {
    return [];
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-fetch', {
      body: { 
        calendarId,
        timeMin,
        timeMax,
        accessToken: token
      }
    });
    
    if (error) throw error;
    
    if (!data?.events) return [];
    
    // Make sure to convert dates to strings when needed
    return data.events.map((event: any): CalendarEvent => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      location: event.location || '',
      // Fix: Convert string dates to Date objects
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
      type: determineEventType(event),
      created_by: 'google',
      source: 'google',
      allDay: !event.start.dateTime
    }));
  } catch (error) {
    console.error("Error fetching events from Google Calendar:", error);
    toast.error("Failed to fetch events from Google Calendar");
    return [];
  }
};

/**
 * Create an event in Google Calendar
 */
export const createGoogleCalendarEvent = async (event: Partial<CalendarEvent>): Promise<string | null> => {
  const token = await getGoogleCalendarToken();
  if (!token) return null;
  
  try {
    // Convert our event format to Google Calendar format
    const googleEvent = convertToGoogleEvent(event);
    
    const { data, error } = await supabase.functions.invoke('google-calendar-events', {
      body: { 
        action: 'create',
        calendarId: 'primary',
        event: googleEvent,
        accessToken: token
      }
    });
    
    if (error) throw error;
    
    if (data?.id) {
      // Update local database with Google event ID
      await supabase
        .from('calendar_events')
        .update({ google_event_id: data.id })
        .match({ id: event.id });
        
      return data.id;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating event in Google Calendar:", error);
    toast.error("Failed to create event in Google Calendar");
    return null;
  }
};

/**
 * Update an event in Google Calendar
 */
export const updateGoogleCalendarEvent = async (event: Partial<CalendarEvent>): Promise<boolean> => {
  const token = await getGoogleCalendarToken();
  if (!token) return false;
  
  // We need the Google event ID to update it
  if (!event.id) return false;
  
  try {
    // Get the Google event ID from our database if available
    let googleEventId = event.id;
    if (!googleEventId.startsWith('google_')) {
      const { data } = await supabase
        .from('calendar_events')
        .select('google_event_id')
        .eq('id', event.id)
        .single();
        
      googleEventId = data?.google_event_id || event.id;
    }
    
    // Convert our event format to Google Calendar format
    const googleEvent = convertToGoogleEvent(event);
    
    const { data, error } = await supabase.functions.invoke('google-calendar-events', {
      body: { 
        action: 'update',
        calendarId: 'primary',
        eventId: googleEventId,
        event: googleEvent,
        accessToken: token
      }
    });
    
    if (error) throw error;
    
    return data?.success || false;
  } catch (error) {
    console.error("Error updating event in Google Calendar:", error);
    toast.error("Failed to update event in Google Calendar");
    return false;
  }
};

/**
 * Delete an event from Google Calendar
 */
export const deleteGoogleCalendarEvent = async (eventId: string): Promise<boolean> => {
  const token = await getGoogleCalendarToken();
  if (!token) return false;
  
  try {
    // Get the Google event ID from our database if available
    let googleEventId = eventId;
    if (!googleEventId.startsWith('google_')) {
      const { data } = await supabase
        .from('calendar_events')
        .select('google_event_id')
        .eq('id', eventId)
        .single();
        
      googleEventId = data?.google_event_id || eventId;
    }
    
    const { data, error } = await supabase.functions.invoke('google-calendar-events', {
      body: { 
        action: 'delete',
        calendarId: 'primary',
        eventId: googleEventId,
        accessToken: token
      }
    });
    
    if (error) throw error;
    
    return data?.success || false;
  } catch (error) {
    console.error("Error deleting event from Google Calendar:", error);
    toast.error("Failed to delete event from Google Calendar");
    return false;
  }
};

/**
 * Sync all local events with Google Calendar
 */
export const syncEventsWithGoogleCalendar = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { action: 'full_sync' }
    });
    
    if (error) throw error;
    
    if (data?.success) {
      toast.success("Calendar synced successfully");
      return true;
    } else {
      toast.error("Calendar sync failed");
      return false;
    }
  } catch (error) {
    console.error("Error syncing with Google Calendar:", error);
    toast.error("Failed to sync with Google Calendar");
    return false;
  }
};

// Helper function to convert app event format to Google Calendar format
const convertToGoogleEvent = (event: Partial<CalendarEvent>): GoogleEvent => {
  // Fix: Ensure dates are properly handled
  let startDate: Date;
  let endDate: Date;
  
  // Handle the start date (convert string to Date if needed)
  if (typeof event.start === 'string') {
    startDate = new Date(event.start);
  } else {
    startDate = event.start || new Date();
  }
  
  // Handle the end date (convert string to Date if needed)
  if (typeof event.end === 'string') {
    endDate = new Date(event.end);
  } else if (event.end) {
    endDate = event.end;
  } else {
    // Default to 1 hour later if not provided
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  }
  
  return {
    summary: event.title || 'Untitled Event',
    description: event.description,
    location: event.location,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'America/New_York'
    }
  };
};

// Helper function to determine event type based on Google Calendar event
const determineEventType = (googleEvent: any): EventType => {
  const title = googleEvent.summary?.toLowerCase() || '';
  const description = googleEvent.description?.toLowerCase() || '';
  
  if (title.includes('rehearsal') || description.includes('rehearsal')) {
    return 'rehearsal';
  } else if (title.includes('concert') || description.includes('concert')) {
    return 'concert';
  } else if (title.includes('sectional') || description.includes('sectional')) {
    return 'sectional';
  } else if (title.includes('tour') || description.includes('tour')) {
    return 'tour';
  } else {
    return 'special';
  }
};
