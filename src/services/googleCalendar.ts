
import { supabase } from '@/integrations/supabase/client';

// Create a type for the calendar token
interface CalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  created_at: string;
}

// Get the Google Calendar token for the current user
const getToken = async (): Promise<CalendarToken | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return null;

    // Check if the google_calendar_tokens table exists
    try {
      // Use a simpler, more type-safe approach
      const { data, error } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (error) {
        console.error('Error fetching Google Calendar token:', error);
        return null;
      }

      return data as unknown as CalendarToken;
    } catch (error) {
      console.error('Error in database operation:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in getToken:', error);
    return null;
  }
};

// Check if the user is connected to Google Calendar
export const isConnected = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

// Connect the user to Google Calendar
export const connect = async (): Promise<void> => {
  // This would typically redirect to Google OAuth flow
  console.log("Connecting to Google Calendar");
  // Implementation would depend on your OAuth setup
};

// Fetch calendar events from Google Calendar
export const fetchEvents = async (startDate: Date, endDate: Date): Promise<any[]> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No Google Calendar connection found');
    }

    // This would make an API call to Google Calendar API
    console.log("Fetching events from:", startDate, "to:", endDate);
    
    // Returning mock data for now
    return [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Add an event to Google Calendar
export const addEvent = async (eventData: any): Promise<string> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No Google Calendar connection found');
    }

    // This would make an API call to Google Calendar API
    console.log("Adding event:", eventData);
    
    // Return a mock event ID
    return "mock-event-id";
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

// Update an event in Google Calendar
export const updateEvent = async (eventId: string, eventData: any): Promise<void> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No Google Calendar connection found');
    }

    // This would make an API call to Google Calendar API
    console.log("Updating event:", eventId, eventData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event from Google Calendar
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No Google Calendar connection found');
    }

    // This would make an API call to Google Calendar API
    console.log("Deleting event:", eventId);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Connect to Google Calendar
export const connectToGoogleCalendar = async (): Promise<void> => {
  console.log("Connecting to Google Calendar");
};

// Disconnect from Google Calendar
export const disconnect = async (): Promise<void> => {
  console.log("Disconnecting from Google Calendar");
};

// Sync calendar
export const syncCalendar = async (): Promise<void> => {
  console.log("Syncing calendar");
};

// Simplified hook return type for use with Google Calendar Connect component
export const useGoogleCalendar = () => {
  return {
    isConnected: false,    // Would be replaced with actual state
    isLoading: false,      // Would be replaced with actual state
    error: '',            // Would be replaced with actual state
    isSyncing: false,     // Added for GoogleCalendarConnect
    connect,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    connectToGoogleCalendar, // Added for GoogleCalendarConnect
    disconnect,            // Added for GoogleCalendarConnect
    syncCalendar           // Added for GoogleCalendarConnect
  };
};
