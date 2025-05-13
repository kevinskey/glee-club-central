
import { supabase } from "@/integrations/supabase/client";
import { GoogleCalendarToken } from "@/types/calendar"; 

// Function to check if user has connected Google Calendar
export const isConnected = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      return false;
    }

    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error checking Google Calendar connection:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
};

// Function to connect to Google Calendar
export const connect = async (): Promise<void> => {
  // Implementation will depend on your authorization flow
  console.log("Connecting to Google Calendar...");
  const authUrl = "/api/google-calendar/auth-url";
  window.location.href = authUrl;
};

// For backward compatibility
export const connectToGoogleCalendar = connect;

// Function to disconnect Google Calendar
export const disconnect = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      return false;
    }

    const userId = session.session.user.id;
    
    const { error } = await supabase
      .from('user_google_tokens')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    return false;
  }
};

// Function to sync calendar events
export const syncCalendar = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/google-calendar/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync with Google Calendar');
    }

    return true;
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    return false;
  }
};

// For backward compatibility with existing code
export const connectGoogleCalendar = async (code: string, userId: string) => {
  try {
    // Exchange authorization code for tokens
    const response = await fetch('/api/google-calendar/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to connect to Google Calendar');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error connecting to Google Calendar:', error);
    throw new Error(error.message || 'Failed to connect to Google Calendar');
  }
};

// Function to check if user has connected Google Calendar (older version)
export const checkGoogleCalendarConnection = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      return { connected: false, token: null };
    }
    
    return { 
      connected: !!data, 
      token: data as unknown as GoogleCalendarToken
    };
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return { connected: false, token: null };
  }
};

// Function to disconnect Google Calendar (older version)
export const disconnectGoogleCalendar = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_google_tokens')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error disconnecting Google Calendar:', error);
    throw new Error(error.message || 'Failed to disconnect Google Calendar');
  }
};

// Function to fetch events from Google Calendar
export const fetchGoogleCalendarEvents = async (userId: string) => {
  try {
    const response = await fetch(`/api/google-calendar/events?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch Google Calendar events');
    }

    const data = await response.json();
    return data.events;
  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error);
    throw new Error(error.message || 'Failed to fetch Google Calendar events');
  }
};

// Function to sync events to Google Calendar
export const syncEventsToGoogle = async (userId: string, events: any[]) => {
  try {
    const response = await fetch('/api/google-calendar/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, events }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sync events to Google Calendar');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error syncing events to Google Calendar:', error);
    throw new Error(error.message || 'Failed to sync events to Google Calendar');
  }
};
