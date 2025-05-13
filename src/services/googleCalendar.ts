
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Re-export the calendar utilities for backward compatibility
export * from "@/utils/supabase/calendar";

// Check if user is connected to Google Calendar
export const checkGoogleCalendarConnection = async (): Promise<boolean> => {
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
    
    return true;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
};

// Get Google Calendar Auth URL
export const getGoogleCalendarAuthUrl = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/google-auth/start', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to start Google auth flow');
    }
    
    const data = await response.json();
    
    if (data.url) {
      return data.url;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Google Calendar auth URL:', error);
    toast.error('Failed to start Google Calendar authorization');
    return null;
  }
};

// Start Google OAuth flow
export const startGoogleAuth = async (): Promise<boolean> => {
  try {
    const authUrl = await getGoogleCalendarAuthUrl();
    if (authUrl) {
      // Open Google auth URL in a new window
      window.open(authUrl, '_blank', 'width=800,height=600');
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
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      toast.error('User not authenticated');
      return false;
    }
    
    const { error } = await supabase
      .from('user_google_tokens')
      .delete()
      .eq('user_id', userData.user.id);
    
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

// Export calendar data in different formats (including iCal)
export const exportCalendarData = async (events: any[], format: 'ical' | 'json' = 'ical'): Promise<void> => {
  // Re-use the existing function from utils
  if (format === 'ical') {
    const { exportCalendarToIcal } = await import('@/utils/supabase/calendar');
    exportCalendarToIcal(events);
  } else {
    // Export as JSON
    const jsonString = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spelman-glee-club-calendar.json';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Calendar exported successfully as JSON');
  }
};

// Import calendar data from different formats
export const importCalendarData = async (file: File): Promise<any[]> => {
  // Check file type
  if (file.name.endsWith('.ics')) {
    const { importCalendarFromIcal } = await import('@/utils/supabase/calendar');
    return importCalendarFromIcal(file);
  } else if (file.name.endsWith('.json')) {
    // Import from JSON
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const events = JSON.parse(content);
          resolve(events);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  } else {
    throw new Error('Unsupported file format. Please upload an .ics or .json file.');
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
