
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
    
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', user.user.id)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    // Check if token is expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    return expiresAt > now;
  } catch (error) {
    console.error("Error checking Google Calendar connection status:", error);
    return false;
  }
};

/**
 * Start the OAuth flow to connect to Google Calendar
 */
export const connectToGoogleCalendar = async (): Promise<void> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      toast.error("You must be logged in to connect Google Calendar");
      return;
    }

    // Call the edge function to get the OAuth URL
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'get_auth_url' }
    });

    if (error) {
      throw error;
    }

    if (data?.authUrl) {
      // Open the OAuth URL in a new popup window
      const popup = window.open(
        data.authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for the popup to close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Check if connection was successful
          setTimeout(async () => {
            const connected = await isConnected();
            if (connected) {
              toast.success("Google Calendar connected successfully!");
            }
          }, 1000);
        }
      }, 1000);
    } else {
      toast.error("Failed to get OAuth URL");
    }
  } catch (error) {
    console.error("Error connecting to Google Calendar:", error);
    toast.error("Failed to connect to Google Calendar");
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
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      console.error("No authenticated user");
      return false;
    }
    
    // Call the edge function to disconnect
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'disconnect' }
    });
    
    if (error) {
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
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      toast.error("You must be logged in to sync with Google Calendar");
      return false;
    }
    
    // Call the sync function
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { 
        action: 'full_sync', 
        calendar_id: calendarId
      }
    });
    
    if (error) {
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
