
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent } from "@/types/calendar";
import { toast } from "sonner";

/**
 * Function to export calendar events to iCal format (.ics file)
 */
export const exportCalendarToIcal = (events: CalendarEvent[]): void => {
  try {
    // Create iCal content
    let icalContent = "BEGIN:VCALENDAR\r\n";
    icalContent += "VERSION:2.0\r\n";
    icalContent += "PRODID:-//Spelman Glee Club//Calendar//EN\r\n";
    icalContent += "CALSCALE:GREGORIAN\r\n";
    icalContent += "METHOD:PUBLISH\r\n";
    
    // Add each event to the iCal content
    events.forEach(event => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      // Format dates for iCal (YYYYMMDDTHHmmssZ)
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+/g, '');
      };
      
      icalContent += "BEGIN:VEVENT\r\n";
      icalContent += `SUMMARY:${event.title}\r\n`;
      icalContent += `DTSTART:${formatDate(startDate)}\r\n`;
      icalContent += `DTEND:${formatDate(endDate)}\r\n`;
      icalContent += `UID:${event.id}\r\n`;
      
      if (event.description) {
        icalContent += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\r\n`;
      }
      
      if (event.location) {
        icalContent += `LOCATION:${event.location}\r\n`;
      }
      
      icalContent += "END:VEVENT\r\n";
    });
    
    icalContent += "END:VCALENDAR\r\n";
    
    // Create a Blob with the iCal content
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spelman-glee-club-calendar.ics';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Calendar exported successfully');
  } catch (error) {
    console.error('Error exporting calendar:', error);
    toast.error('Failed to export calendar');
  }
};

/**
 * Function to import calendar events from an iCal file
 */
export const importCalendarFromIcal = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        const events: any[] = [];
        const eventBlocks = content.split('BEGIN:VEVENT');
        
        // Skip the first element as it's the header
        eventBlocks.slice(1).forEach(block => {
          const endIndex = block.indexOf('END:VEVENT');
          if (endIndex > -1) {
            const eventData = block.substring(0, endIndex);
            
            // Parse event data
            const summary = extractIcalProperty(eventData, 'SUMMARY');
            const dtstart = extractIcalProperty(eventData, 'DTSTART');
            const dtend = extractIcalProperty(eventData, 'DTEND');
            const description = extractIcalProperty(eventData, 'DESCRIPTION');
            const location = extractIcalProperty(eventData, 'LOCATION');
            const uid = extractIcalProperty(eventData, 'UID');
            
            if (summary && dtstart) {
              // Parse dates
              const startDate = parseIcalDate(dtstart);
              const endDate = dtend ? parseIcalDate(dtend) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour
              
              events.push({
                title: summary,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                description: description?.replace(/\\n/g, '\n') || '',
                location: location || '',
                type: 'special', // Default type
                id: uid || crypto.randomUUID(), // Use UID if available, or generate new ID
                allDay: false,
              });
            }
          }
        });
        
        toast.success(`Imported ${events.length} events`);
        resolve(events);
      } catch (error) {
        console.error('Error parsing iCal file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Helper function to extract properties from iCal data
 */
const extractIcalProperty = (data: string, property: string): string | undefined => {
  const regex = new RegExp(`${property}[;:]([^\\r\\n]+)`, 'i');
  const match = data.match(regex);
  return match ? match[1].trim() : undefined;
};

/**
 * Helper function to parse iCal date strings
 */
const parseIcalDate = (dateStr: string): Date => {
  // Handle dates with timezone info
  if (dateStr.includes('T')) {
    // Format: YYYYMMDDTHHmmssZ
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // 0-based month
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(9, 11));
    const minute = parseInt(dateStr.substring(11, 13));
    const second = parseInt(dateStr.substring(13, 15));
    
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  } else {
    // Format: YYYYMMDD (all-day event)
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // 0-based month
    const day = parseInt(dateStr.substring(6, 8));
    
    return new Date(Date.UTC(year, month, day));
  }
};

// Fetch upcoming performances for the PerformanceSection component
export const fetchUpcomingPerformances = async () => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('type', 'concert')
      .gte('start', new Date().toISOString())
      .order('start', { ascending: true })
      .limit(3);
    
    if (error) {
      console.error('Error fetching upcoming performances:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchUpcomingPerformances:', error);
    return [];
  }
};
