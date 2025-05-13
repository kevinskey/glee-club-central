
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types/calendar';

// Check if the user has connected their Google Calendar
export async function checkGoogleCalendarConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .limit(1)
      .single();
    
    return !!data && !error;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
}

// Connect Google Calendar (initiates OAuth flow)
export async function connectGoogleCalendar(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('connect-google-calendar');
    
    if (error) {
      throw error;
    }
    
    // Redirect to Google OAuth URL
    if (data?.url) {
      window.location.href = data.url;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error connecting to Google Calendar:', error);
    return false;
  }
}

// Disconnect Google Calendar
export async function disconnectGoogleCalendar(): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('disconnect-google-calendar');
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error disconnecting from Google Calendar:', error);
    return false;
  }
}

// Sync with Google Calendar
export async function syncWithGoogleCalendar(): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('sync-google-calendar');
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    return false;
  }
}

// Create a Google Calendar event
export async function createGoogleCalendarEvent(event: CalendarEvent): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('create-google-calendar-event', {
      body: { event }
    });
    
    if (error) {
      throw error;
    }
    
    return data?.eventId || null;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
}

// Update a Google Calendar event
export async function updateGoogleCalendarEvent(event: CalendarEvent): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('update-google-calendar-event', {
      body: { event }
    });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    return false;
  }
}

// Delete a Google Calendar event
export async function deleteGoogleCalendarEvent(eventId: string, googleEventId: string): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('delete-google-calendar-event', {
      body: { eventId, googleEventId }
    });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return false;
  }
}
