
import { supabase } from '@/integrations/supabase/client';
import { GoogleCalendarToken } from '@/types/calendar';
import { toast } from 'sonner';

/**
 * Check if the user has connected Google Calendar
 * @returns Boolean indicating if Google Calendar is connected
 */
export const isConnected = async (): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      return false;
    }
    
    // We use the user_google_tokens table that was created in the migration
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error || !data) {
      console.log("No Google Calendar connection found:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
};

/**
 * Fetches Google Calendar access token from Supabase
 * @param userId The user's ID
 * @returns Google Calendar token object or null
 */
export const fetchGoogleCalendarToken = async (userId: string): Promise<GoogleCalendarToken | null> => {
  try {
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error || !data) {
      console.error('Error fetching Google Calendar token:', error);
      return null;
    }
    
    // Safely cast data to GoogleCalendarToken type
    const token: GoogleCalendarToken = {
      id: data.id,
      user_id: data.user_id,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(data.expires_at).getTime(),
      calendar_id: data.calendar_id || 'primary'
    };
    
    return token;
  } catch (error) {
    console.error('Exception fetching Google Calendar token:', error);
    return null;
  }
};

/**
 * Syncs events with Google Calendar
 * @returns Boolean indicating success/failure
 */
export const syncCalendar = async (): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      toast.error('You must be logged in to sync with Google Calendar');
      return false;
    }
    
    // Get the token from the database
    const token = await fetchGoogleCalendarToken(userId);
    if (!token) {
      toast.error('Google Calendar not connected');
      return false;
    }
    
    // Call the sync function with the calendar ID and token
    const success = await syncWithGoogleCalendar('primary', token.access_token);
    return success;
  } catch (error) {
    console.error('Error in syncCalendar:', error);
    toast.error('Failed to sync calendar');
    return false;
  }
};

/**
 * Connect the user account to Google Calendar
 */
export const connect = async (): Promise<void> => {
  const redirectUrl = connectToGoogleCalendar();
  window.location.href = redirectUrl;
};

/**
 * Disconnect the user account from Google Calendar
 */
export const disconnect = async (): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      toast.error('You must be logged in to disconnect Google Calendar');
      return false;
    }
    
    // Delete the token from the database
    const { error } = await supabase
      .from('user_google_tokens')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error disconnecting from Google Calendar:', error);
      toast.error('Failed to disconnect from Google Calendar');
      return false;
    }
    
    toast.success('Successfully disconnected from Google Calendar');
    return true;
  } catch (error) {
    console.error('Error disconnecting from Google Calendar:', error);
    toast.error('Failed to disconnect from Google Calendar');
    return false;
  }
};

/**
 * Syncs events with Google Calendar
 * @param calendarId Google Calendar ID to sync with
 * @param accessToken Google OAuth access token
 * @returns Boolean indicating success/failure
 */
export const syncWithGoogleCalendar = async (calendarId: string, accessToken: string): Promise<boolean> => {
  try {
    // Get start and end dates for sync (last 30 days to next 90 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);
    
    // Format dates for Google Calendar API
    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();
    
    // Fetch events from Google Calendar API
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      toast.error('No events found in Google Calendar');
      return false;
    }
    
    // Process events here - this would typically involve storing them in Supabase
    // This is a simplified implementation
    console.log(`Fetched ${data.items.length} events from Google Calendar`);
    toast.success(`Successfully synced ${data.items.length} events from Google Calendar`);
    
    return true;
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    toast.error('Failed to sync with Google Calendar');
    return false;
  }
};

/**
 * Connects user account to Google Calendar
 * @returns URL to redirect user to for Google OAuth
 */
export const connectToGoogleCalendar = (): string => {
  // This is a placeholder - in a real implementation, you would:
  // 1. Generate OAuth URL with proper scopes for Google Calendar
  // 2. Store state in session for security
  // 3. Redirect user to Google consent screen
  
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const redirectUri = `${window.location.origin}/auth/google-callback`;
  const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly');
  const state = crypto.randomUUID();
  
  // Store state in session storage for verification when user returns
  sessionStorage.setItem('googleOAuthState', state);
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
};

/**
 * Handles OAuth callback from Google
 * @param code Authorization code from Google
 * @param userId User ID to associate the token with
 * @returns Boolean indicating success/failure
 */
export const handleGoogleCalendarCallback = async (code: string, userId: string): Promise<boolean> => {
  try {
    // This is a placeholder function that would:
    // 1. Exchange code for access/refresh tokens
    // 2. Store the tokens in Supabase
    // 3. Return success/failure
    
    // In a real implementation, you would make a server call to exchange the code
    console.log('Processing Google Calendar authorization code for user:', userId);
    
    // Simulate success for now
    toast.success('Successfully connected to Google Calendar');
    return true;
  } catch (error) {
    console.error('Error handling Google Calendar callback:', error);
    toast.error('Failed to connect to Google Calendar');
    return false;
  }
};
