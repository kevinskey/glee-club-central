
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, EventType } from "@/types/calendar";
import { toast } from "sonner";

// Interface for Google Calendar events
interface GoogleEvent {
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
 * Check if a user has connected their Google Calendar
 */
export const checkGoogleCalendarConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'check_connection' },
    });
    
    if (error) {
      console.error('Error checking Google Calendar connection:', error);
      return false;
    }
    
    return data?.connected || false;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
};

/**
 * Get the Google Calendar authorization URL
 */
export const getGoogleCalendarAuthUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'get_auth_url' },
    });
    
    if (error) {
      console.error('Error getting Google Calendar auth URL:', error);
      return null;
    }
    
    return data?.authUrl || null;
  } catch (error) {
    console.error('Error getting Google Calendar auth URL:', error);
    return null;
  }
};

/**
 * Connect to Google Calendar
 */
export const connectGoogleCalendar = async (): Promise<boolean> => {
  try {
    const authUrl = await getGoogleCalendarAuthUrl();
    
    if (!authUrl) {
      toast.error('Failed to generate Google Calendar authentication URL');
      return false;
    }
    
    // Open the Google authentication page in a new window
    const authWindow = window.open(authUrl, 'Google Calendar Authentication', 'width=600,height=700');
    
    // Check if the window was blocked by a popup blocker
    if (!authWindow) {
      toast.error('Popup blocked. Please allow popups for this site and try again.');
      return false;
    }
    
    // Show a toast message to guide the user
    toast.info('Please complete the Google authentication in the popup window.');
    
    return true;
  } catch (error) {
    console.error('Error connecting to Google Calendar:', error);
    toast.error('Failed to connect to Google Calendar');
    return false;
  }
};

/**
 * Disconnect from Google Calendar
 */
export const disconnectGoogleCalendar = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'disconnect' },
    });
    
    if (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast.error('Failed to disconnect Google Calendar');
      return false;
    }
    
    toast.success('Google Calendar disconnected successfully');
    return true;
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    toast.error('Failed to disconnect Google Calendar');
    return false;
  }
};

/**
 * Sync events with Google Calendar
 */
export const syncWithGoogleCalendar = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { action: 'sync_events' },
    });
    
    if (error) {
      console.error('Error syncing with Google Calendar:', error);
      toast.error('Failed to sync with Google Calendar');
      return false;
    }
    
    if (data?.success) {
      const syncStats = data.stats || { added: 0, updated: 0, deleted: 0 };
      toast.success(`Calendar synced successfully! Added: ${syncStats.added}, Updated: ${syncStats.updated}`);
      return true;
    } else {
      toast.error(data?.message || 'Failed to sync with Google Calendar');
      return false;
    }
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    toast.error('Failed to sync with Google Calendar');
    return false;
  }
};

/**
 * Create an event in Google Calendar
 */
export const createGoogleCalendarEvent = async (event: CalendarEvent): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { 
        action: 'create_event',
        event
      },
    });
    
    if (error) {
      console.error('Error creating Google Calendar event:', error);
      return null;
    }
    
    return data?.googleEventId || null;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
};

/**
 * Update an event in Google Calendar
 */
export const updateGoogleCalendarEvent = async (event: CalendarEvent): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { 
        action: 'update_event',
        event
      },
    });
    
    if (error) {
      console.error('Error updating Google Calendar event:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    return false;
  }
};

/**
 * Delete an event from Google Calendar
 */
export const deleteGoogleCalendarEvent = async (eventId: string, googleEventId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { 
        action: 'delete_event',
        eventId,
        googleEventId
      },
    });
    
    if (error) {
      console.error('Error deleting Google Calendar event:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return false;
  }
};

/**
 * Convert Glee Club event to Google Calendar event format
 */
export const convertToGoogleEvent = (event: CalendarEvent): Partial<GoogleEvent> => {
  // Process the start and end times
  const start: { dateTime?: string; date?: string } = {};
  const end: { dateTime?: string; date?: string } = {};
  
  if (event.allDay) {
    // All-day events use the date field
    start.date = new Date(event.start).toISOString().split('T')[0];
    end.date = new Date(event.end || event.start).toISOString().split('T')[0];
  } else {
    // Timed events use the dateTime field
    start.dateTime = new Date(event.start).toISOString();
    end.dateTime = new Date(event.end || new Date(new Date(event.start).getTime() + 3600000)).toISOString();
  }
  
  // Create event colorId based on event type
  let colorId = '1'; // Default blue
  
  switch (event.type) {
    case EventType.PERFORMANCE:
    case EventType.CONCERT:
      colorId = '4'; // Purple
      break;
    case EventType.REHEARSAL:
      colorId = '9'; // Green
      break;
    case EventType.SECTIONAL:
      colorId = '2'; // Light green
      break;
    case EventType.MEETING:
      colorId = '6'; // Orange
      break;
    case EventType.TOUR:
      colorId = '11'; // Red
      break;
    case EventType.SPECIAL:
      colorId = '7'; // Light orange
      break;
    default:
      colorId = '1'; // Blue
  }
  
  return {
    summary: event.title,
    location: event.location,
    description: event.description,
    start,
    end,
    colorId
  };
};

/**
 * Convert Google Calendar event to Glee Club event format
 */
export const convertFromGoogleEvent = (googleEvent: GoogleEvent): Partial<CalendarEvent> => {
  // Determine if it's an all-day event
  const isAllDay = !!googleEvent.start.date;
  
  // Process the start and end times
  let start: Date, end: Date;
  
  if (isAllDay) {
    // All-day events use the date field
    start = new Date(googleEvent.start.date || '');
    end = new Date(googleEvent.end.date || '');
  } else {
    // Timed events use the dateTime field
    start = new Date(googleEvent.start.dateTime || '');
    end = new Date(googleEvent.end.dateTime || '');
  }
  
  // Determine event type based on colorId or default to 'other'
  let type = EventType.OTHER;
  
  if (googleEvent.colorId) {
    switch (googleEvent.colorId) {
      case '4': // Purple
        type = EventType.CONCERT;
        break;
      case '9': // Green
        type = EventType.REHEARSAL;
        break;
      case '2': // Light green
        type = EventType.SECTIONAL;
        break;
      case '6': // Orange
        type = EventType.MEETING;
        break;
      case '11': // Red
        type = EventType.TOUR;
        break;
      case '7': // Light orange
        type = EventType.SPECIAL;
        break;
      default:
        type = EventType.OTHER;
    }
  }
  
  return {
    title: googleEvent.summary,
    description: googleEvent.description,
    location: googleEvent.location,
    start: start.toISOString(),
    end: end.toISOString(),
    allDay: isAllDay,
    type
  };
};
