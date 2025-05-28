
// Service for handling Google Calendar integration and synchronization

import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, GoogleCalendarToken } from "@/types/calendar";
import { toast } from "sonner";

/**
 * Check if the user has already connected their Google Calendar
 */
export const isConnected = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      return false;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return false;
    }
    
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'check_connection' },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
      
    if (error || !data) {
      console.error("Error checking connection:", error);
      return false;
    }
    
    return data.connected === true;
  } catch (error) {
    console.error("Error checking Google Calendar connection status:", error);
    return false;
  }
};

/**
 * Start the OAuth flow to connect to Google Calendar
 */
export const connectToGoogleCalendar = async (): Promise<string> => {
  try {
    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      toast.error("You must be logged in to connect Google Calendar");
      throw new Error("User not authenticated");
    }

    // Check if session is valid
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("No valid session:", sessionError);
      toast.error("Please log in again to continue");
      throw new Error("No valid session");
    }

    console.log("User authenticated, requesting Google Calendar auth URL...");

    // Call the edge function with the correct action name
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'generate_oauth_url' },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      console.error("Error calling edge function:", error);
      
      // Handle specific error cases
      if (error.message?.includes('401') || error.message?.includes('authorization')) {
        toast.error("Authentication expired. Please refresh the page and try again.");
        // Try to refresh the session
        await supabase.auth.refreshSession();
        throw new Error("Authentication expired");
      } else {
        toast.error("Failed to connect to Google Calendar service");
        throw error;
      }
    }

    console.log("Received auth URL response:", data);

    if (data?.authUrl) {
      console.log("Opening OAuth URL");
      return data.authUrl;
    } else {
      toast.error("Failed to get OAuth URL");
      throw new Error("No auth URL returned");
    }
  } catch (error) {
    console.error("Error connecting to Google Calendar:", error);
    
    // Don't show duplicate toast messages
    if (!error.message?.includes("Authentication expired") && 
        !error.message?.includes("You must be logged in")) {
      toast.error("Failed to connect to Google Calendar");
    }
    throw error;
  }
};

/**
 * Fetch Google Calendar events
 */
export const fetchGoogleCalendarEvents = async (calendarId = 'primary'): Promise<CalendarEvent[]> => {
  try {
    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return [];
    }

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("No valid session:", sessionError);
      return [];
    }
    
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { 
        action: 'fetch_events',
        calendar_id: calendarId
      },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch Google Calendar events");
      return [];
    }
    
    return data?.events || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    toast.error("Failed to fetch Google Calendar events");
    return [];
  }
};

/**
 * Alias for backward compatibility
 */
export const connect = connectToGoogleCalendar;

/**
 * Disconnect from Google Calendar
 */
export const disconnect = async (): Promise<boolean> => {
  try {
    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return false;
    }

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("No valid session:", sessionError);
      toast.error("Please log in again to continue");
      return false;
    }
    
    // Call the edge function to disconnect
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'disconnect' },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error disconnecting:", error);
      throw error;
    }
    
    if (data?.success) {
      toast.success("Google Calendar disconnected successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error disconnecting from Google Calendar:", error);
    toast.error("Failed to disconnect from Google Calendar");
    return false;
  }
};

/**
 * Fetch available Google Calendars for the user
 */
export const fetchGoogleCalendars = async (): Promise<Array<{id: string, name: string, primary?: boolean}> | null> => {
  try {
    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return null;
    }

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("No valid session:", sessionError);
      return null;
    }
    
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'list_calendars' },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error fetching calendars:", error);
      throw error;
    }
    
    return data?.calendars || [];
  } catch (error) {
    console.error("Error fetching Google Calendars:", error);
    toast.error("Failed to fetch calendars");
    return null;
  }
};

/**
 * Fetch Google Calendar token for a user
 */
export const fetchGoogleCalendarToken = async (userId: string): Promise<GoogleCalendarToken | null> => {
  try {
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    const token: GoogleCalendarToken = {
      id: data.id,
      user_id: data.user_id,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      calendar_id: 'primary',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return token;
  } catch (error) {
    console.error("Error fetching Google Calendar token:", error);
    return null;
  }
};

/**
 * Sync with Google Calendar
 */
export const syncWithGoogleCalendar = async (calendarId = 'primary', accessToken?: string): Promise<boolean> => {
  try {
    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      toast.error("You must be logged in to sync with Google Calendar");
      return false;
    }

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("No valid session:", sessionError);
      toast.error("Please log in again to continue");
      return false;
    }
    
    // Call the sync function
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { 
        action: 'full_sync', 
        calendar_id: calendarId
      },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error syncing:", error);
      throw error;
    }
    
    if (data?.success) {
      toast.success("Calendar synced successfully");
      return true;
    } else {
      toast.error(data?.message || "Failed to sync calendar");
      return false;
    }
  } catch (error) {
    console.error("Error syncing with Google Calendar:", error);
    toast.error("Error syncing with Google Calendar");
    return false;
  }
};

/**
 * Alias for backward compatibility
 */
export const syncCalendar = syncWithGoogleCalendar;

/**
 * Handle the callback from Google OAuth flow
 */
export const handleGoogleCalendarCallback = async (code: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      throw new Error("No authenticated user");
    }
    
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { code }
    });
    
    if (error) {
      throw error;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error("Error handling Google Calendar callback:", error);
    return false;
  }
};
