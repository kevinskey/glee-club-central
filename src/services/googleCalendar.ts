
// Service for handling Google Calendar integration and synchronization

import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, GoogleCalendarEvent, GoogleCalendarToken } from "@/types/calendar";
import { toast } from "sonner";

// Constants for Google OAuth
const GOOGLE_OAUTH_REDIRECT_URI = window.location.origin + "/calendar-callback";
const GOOGLE_OAUTH_CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID"; // Replace with env variable when available

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
 * Connect to Google Calendar using OAuth
 * Alias for backward compatibility
 */
export const connect = (): string => {
  return connectToGoogleCalendar();
};

/**
 * Start the OAuth flow to connect to Google Calendar
 */
export const connectToGoogleCalendar = (): string => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', GOOGLE_OAUTH_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', GOOGLE_OAUTH_REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  
  // Return the URL string that the frontend can use to redirect
  return authUrl.toString();
};

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
    
    const { error } = await supabase
      .from('user_google_tokens')
      .delete()
      .eq('user_id', user.user.id);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error disconnecting from Google Calendar:", error);
    return false;
  }
};

/**
 * Handle the callback from Google OAuth flow
 */
export const handleGoogleCalendarCallback = async (code: string): Promise<boolean> => {
  try {
    // Exchange code for tokens using Supabase Edge Function
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      throw new Error("No authenticated user");
    }
    
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { code, redirect_uri: GOOGLE_OAUTH_REDIRECT_URI }
    });
    
    if (error) {
      throw error;
    }
    
    // Store tokens in Supabase
    const { access_token, refresh_token, expires_in } = data;
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
    
    // Store in Supabase
    const { error: insertError } = await supabase
      .from('user_google_tokens')
      .upsert({
        user_id: user.user.id,
        access_token,
        refresh_token,
        expires_at: expiresAt.toISOString()
      });
      
    if (insertError) {
      throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error("Error handling Google Calendar callback:", error);
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
    
    return data as GoogleCalendarToken;
  } catch (error) {
    console.error("Error fetching Google Calendar token:", error);
    return null;
  }
};

/**
 * Sync calendar with Google Calendar
 * Alias for backward compatibility
 */
export const syncCalendar = async (): Promise<boolean> => {
  return await syncWithGoogleCalendar();
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
    
    // Either use provided token or fetch from database
    let token = accessToken;
    if (!token) {
      const tokenData = await fetchGoogleCalendarToken(user.user.id);
      if (!tokenData) {
        toast.error("Google Calendar not connected");
        return false;
      }
      token = tokenData.access_token;
    }
    
    // Call the sync function
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { 
        action: 'full_sync', 
        calendar_id: calendarId,
        access_token: token 
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
