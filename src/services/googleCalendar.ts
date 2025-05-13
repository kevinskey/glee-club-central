
import { supabase } from "@/integrations/supabase/client";

// Function to check if user has connected Google Calendar
export const checkGoogleCalendarConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'check_connection' }
    });
    
    if (error) throw error;
    return data.connected;
  } catch (error) {
    console.error('Error checking Google Calendar connection:', error);
    return false;
  }
};

// Function to get Google Calendar authentication URL
export const getGoogleCalendarAuthUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'get_auth_url' }
    });
    
    if (error) throw error;
    return data.authUrl;
  } catch (error) {
    console.error('Error getting Google Calendar auth URL:', error);
    return null;
  }
};

// Function to disconnect from Google Calendar
export const disconnectGoogleCalendar = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
      body: { action: 'disconnect' }
    });
    
    if (error) throw error;
    return data.success;
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    return false;
  }
};

// Function to sync with Google Calendar
export const syncWithGoogleCalendar = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
      body: { action: 'full_sync' }
    });
    
    if (error) throw error;
    return data.success;
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    return false;
  }
};

// Function to export calendar to iCal format
export const exportCalendarToIcal = (events: any[]): string => {
  // iCal format specification: https://icalendar.org/
  let iCalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Spelman Glee Club//GleeWorld//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  
  events.forEach(event => {
    const startDate = new Date(event.start);
    const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour duration
    
    // Format dates for iCal: YYYYMMDDTHHmmssZ
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
    };
    
    iCalContent = [
      ...iCalContent,
      'BEGIN:VEVENT',
      `UID:${event.id}@glee-world-calendar`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title || 'Untitled Event'}`,
      `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location || ''}`,
      'END:VEVENT'
    ];
  });
  
  iCalContent.push('END:VCALENDAR');
  return iCalContent.join('\r\n');
};

// Function to import calendar from iCal format
export const importCalendarFromIcal = (iCalData: string): any[] => {
  const events: any[] = [];
  const lines = iCalData.split(/\r\n|\n|\r/);
  
  let currentEvent: any = null;
  let inEvent = false;
  
  const parseICalDate = (dateStr: string): Date => {
    // Handle basic ISO format
    if (dateStr.includes('T')) {
      const year = parseInt(dateStr.substr(0, 4));
      const month = parseInt(dateStr.substr(4, 2)) - 1;
      const day = parseInt(dateStr.substr(6, 2));
      const hour = parseInt(dateStr.substr(9, 2));
      const minute = parseInt(dateStr.substr(11, 2));
      const second = parseInt(dateStr.substr(13, 2));
      
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    } else {
      // All day event
      const year = parseInt(dateStr.substr(0, 4));
      const month = parseInt(dateStr.substr(4, 2)) - 1;
      const day = parseInt(dateStr.substr(6, 2));
      
      return new Date(Date.UTC(year, month, day));
    }
  };
  
  lines.forEach(line => {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT' && currentEvent) {
      inEvent = false;
      if (currentEvent.start) {
        // Format the date in ISO format
        const startDate = new Date(currentEvent.start);
        currentEvent.date = startDate.toISOString().split('T')[0];
        currentEvent.time = startDate.toISOString().split('T')[1].substr(0, 5);
        
        // Determine event type based on summary/description if needed
        const title = (currentEvent.title || '').toLowerCase();
        const desc = (currentEvent.description || '').toLowerCase();
        
        if (title.includes('concert') || desc.includes('concert')) {
          currentEvent.type = 'concert';
        } else if (title.includes('rehearsal') || desc.includes('rehearsal')) {
          currentEvent.type = 'rehearsal';
        } else if (title.includes('tour') || desc.includes('tour')) {
          currentEvent.type = 'tour';
        } else {
          currentEvent.type = 'special';
        }
        
        events.push(currentEvent);
      }
      currentEvent = null;
    } else if (inEvent && currentEvent) {
      if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring(8).trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.substring(12).trim().replace(/\\n/g, '\n');
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring(9).trim();
      } else if (line.startsWith('DTSTART:')) {
        currentEvent.start = parseICalDate(line.substring(8).trim());
      } else if (line.startsWith('DTEND:')) {
        currentEvent.end = parseICalDate(line.substring(6).trim());
      } else if (line.startsWith('UID:')) {
        currentEvent.external_id = line.substring(4).trim();
      }
    }
  });
  
  return events;
};

// Function to share calendar (generate a shareable link)
export const shareCalendar = (calendarId?: string): string => {
  // For now, we'll just generate a URL to the calendar page with a share token
  // In a real implementation, this could create a special shared view with limited permissions
  const shareToken = btoa(`share-${Date.now()}`);
  const baseUrl = window.location.origin;
  return `${baseUrl}/calendar?share=${shareToken}${calendarId ? `&calendar=${calendarId}` : ''}`;
};
