
import { supabase } from "@/integrations/supabase/client";
import { GoogleCalendarToken } from "@/types/calendar"; 

// Function to connect Google Calendar
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

// Function to check if user has connected Google Calendar
export const checkGoogleCalendarConnection = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      return { connected: false, token: null };
    }
    
    return { 
      connected: !!data, 
      token: data as GoogleCalendarToken
    };
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return { connected: false, token: null };
  }
};

// Function to disconnect Google Calendar
export const disconnectGoogleCalendar = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('google_calendar_tokens')
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
