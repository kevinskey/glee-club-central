import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Start Google OAuth flow
export const startGoogleAuth = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/google-auth/start', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to start Google auth flow');
    }
    
    const data = await response.json();
    
    if (data.url) {
      // Open Google auth URL in a new window
      window.open(data.url, '_blank', 'width=800,height=600');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error starting Google auth flow:', error);
    toast.error('Failed to connect to Google Calendar');
    return false;
  }
};

// Disconnect from Google Calendar
export const disconnectGoogleCalendar = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_google_tokens')
      .delete()
      .eq('user_id', supabase.auth.getUser()?.id);
    
    if (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast.error('Failed to disconnect from Google Calendar');
      return false;
    }
    
    toast.success('Successfully disconnected from Google Calendar');
    return true;
  } catch (error) {
    console.error('Error in disconnectGoogleCalendar:', error);
    toast.error('An error occurred while disconnecting from Google Calendar');
    return false;
  }
};

// Check if user is connected to Google Calendar
export const isConnectedToGoogle = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_google_tokens')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
};

// Sync events with Google Calendar
export const syncWithGoogleCalendar = async (): Promise<boolean> => {
  try {
    toast.info('Syncing with Google Calendar...');
    
    // Call your backend function to sync events
    const response = await fetch('/api/google-calendar/sync', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync with Google Calendar');
    }
    
    const data = await response.json();
    
    if (data.success) {
      toast.success('Successfully synced with Google Calendar');
      return true;
    }
    
    toast.error(data.message || 'Failed to sync with Google Calendar');
    return false;
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    toast.error('An error occurred while syncing with Google Calendar');
    return false;
  }
};

export const importGoogleEvents = async (): Promise<any[]> => {
  try {
    // This is a placeholder for the actual implementation
    // In a real implementation, you would fetch events from Google Calendar
    toast.info('Importing events from Google Calendar...');
    
    const response = await fetch('/api/google-calendar/import', {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Failed to import events from Google Calendar');
    }
    
    const data = await response.json();
    
    if (data.success) {
      toast.success(`Imported ${data.events.length} events from Google Calendar`);
      return data.events;
    }
    
    toast.error(data.message || 'Failed to import events from Google Calendar');
    return [];
  } catch (error) {
    console.error('Error importing Google Calendar events:', error);
    toast.error('An error occurred while importing events from Google Calendar');
    return [];
  }
};

// Re-exporting from utils for backward compatibility
export * from "@/utils/supabase/calendar";
