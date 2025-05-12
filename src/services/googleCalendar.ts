
import { CalendarEvent, EventType } from "@/hooks/useCalendarEvents";

// User-provided Google Calendar API key
const API_KEY = 'AIzaSyBjWOPNeIScJJtvWGs19IfnD_zGnNyY9hU'; 
const CALENDAR_ID = 'primary'; // Default to user's primary calendar

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  colorId?: string;
}

/**
 * Fetches events from Google Calendar API
 */
export const fetchGoogleCalendarEvents = async (
  daysAhead: number = 90
): Promise<CalendarEvent[]> => {
  try {
    // Calculate time range
    const timeMin = new Date().toISOString();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + daysAhead);
    
    // Build Google Calendar API URL with query parameters
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('timeMin', timeMin);
    url.searchParams.append('timeMax', timeMax.toISOString());
    url.searchParams.append('singleEvents', 'true');
    url.searchParams.append('orderBy', 'startTime');
    
    console.log('Fetching Google Calendar events from:', url.toString());
    
    try {
      // Attempt actual API call with the provided key
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        // Enhanced error handling with more details
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
          console.error("Google Calendar API error details:", errorData);
        } catch {
          errorDetails = response.statusText;
        }
        
        console.error(`Google Calendar API error (${response.status}): ${errorDetails}`);
        
        // If API call fails, fall back to simulated data
        console.log("Falling back to simulated data due to API error");
        return simulateCalendarEvents(daysAhead);
      }
      
      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        console.error("Invalid response format from Google Calendar API:", data);
        return simulateCalendarEvents(daysAhead);
      }
      
      console.log(`Successfully fetched ${data.items.length} events from Google Calendar`);
      
      // Transform Google Calendar events to our app's format
      return data.items.map((event: GoogleCalendarEvent) => transformGoogleEvent(event));
    } catch (error) {
      console.error("Error making Google Calendar API call:", error);
      // Fall back to simulated data if actual API call fails
      return simulateCalendarEvents(daysAhead);
    }
  } catch (error) {
    console.error('Error in fetchGoogleCalendarEvents:', error);
    throw error;
  }
};

/**
 * Simulates Google Calendar events for testing purposes
 * Remove this in production
 */
const simulateCalendarEvents = (daysAhead: number): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const today = new Date();
  
  // Generate some example events
  const eventTypes: EventType[] = ['rehearsal', 'concert', 'tour', 'special'];
  const locations = [
    'Sisters Chapel', 
    'Cosby Auditorium', 
    'Fine Arts Building', 
    'Giles Hall', 
    'Atlanta Symphony Hall'
  ];
  
  // Generate events for the next few weeks
  for (let i = 1; i <= 10; i++) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + Math.floor(Math.random() * daysAhead));
    
    // Randomize event details
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isAllDay = Math.random() > 0.7;
    const startHour = isAllDay ? 0 : 9 + Math.floor(Math.random() * 10); // Between 9am and 7pm
    
    // Set time 
    eventDate.setHours(startHour, Math.floor(Math.random() * 4) * 15, 0); // Hours, minutes (0, 15, 30, 45)
    
    // Create end date (1-3 hours after start)
    const endDate = new Date(eventDate);
    if (!isAllDay) {
      endDate.setHours(endDate.getHours() + 1 + Math.floor(Math.random() * 2));
    }
    
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate event title based on type
    let title = '';
    switch (type) {
      case 'rehearsal':
        title = `Glee Club ${isAllDay ? 'All-Day ' : ''}Rehearsal`;
        break;
      case 'concert':
        title = `${['Spring', 'Summer', 'Fall', 'Winter', 'Holiday'][Math.floor(Math.random() * 5)]} Concert`;
        break;
      case 'tour':
        title = `${['East Coast', 'West Coast', 'Southern', 'Midwest', 'International'][Math.floor(Math.random() * 5)]} Tour`;
        break;
      default:
        title = `Special Event: ${['Fundraiser', 'Workshop', 'Masterclass', 'Meeting'][Math.floor(Math.random() * 4)]}`;
    }
    
    events.push({
      id: `google_sim_${i}`,
      title,
      description: `This is a simulated ${type} event for testing purposes.`,
      date: eventDate, // For backward compatibility
      start: eventDate,
      end: endDate,
      time: isAllDay ? undefined : eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location,
      type,
      allDay: isAllDay,
      source: "google"
    });
  }
  
  return events;
};

/**
 * Transform Google Calendar event to our app's format
 */
const transformGoogleEvent = (event: GoogleCalendarEvent): CalendarEvent => {
  // Determine if it's an all-day event
  const isAllDay = !event.start.dateTime;
  
  // Parse dates from Google's format
  const startDate = isAllDay 
    ? new Date(event.start.date!) 
    : new Date(event.start.dateTime!);
  
  const endDate = isAllDay 
    ? new Date(event.end.date!) 
    : new Date(event.end.dateTime!);
  
  // If it's an all-day event, Google sets the end date to the day after
  // Adjust for display purposes
  if (isAllDay) {
    endDate.setDate(endDate.getDate() - 1);
  }
  
  // Determine event type based on summary or colorId
  let eventType: EventType = "special";
  if (event.summary?.toLowerCase().includes('rehearsal')) {
    eventType = "rehearsal";
  } else if (event.summary?.toLowerCase().includes('concert')) {
    eventType = "concert";
  } else if (event.summary?.toLowerCase().includes('tour')) {
    eventType = "tour";
  }

  return {
    id: `google_${event.id}`,
    title: event.summary,
    description: event.description || "",
    date: startDate, // For backward compatibility
    start: startDate,
    end: endDate,
    time: isAllDay ? undefined : startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    location: event.location || "",
    type: eventType,
    allDay: isAllDay,
    source: "google"
  };
};

/**
 * Get URL to add event to Google Calendar
 */
export function getAddToGoogleCalendarUrl(event?: CalendarEvent): string {
  // If no event provided, return Google Calendar home page
  if (!event) return "https://calendar.google.com/";
  
  // Format date for Google Calendar URL
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  // Build Google Calendar URL
  const startDate = formatDate(event.start);
  const endDate = formatDate(event.end);
  
  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE`;
  url += `&text=${encodeURIComponent(event.title)}`;
  url += `&dates=${startDate}/${endDate}`;
  
  if (event.location) {
    url += `&location=${encodeURIComponent(event.location)}`;
  }
  
  if (event.description) {
    url += `&details=${encodeURIComponent(event.description)}`;
  }
  
  return url;
}

/**
 * Get URL to view Google Calendar
 */
export function getViewGoogleCalendarUrl(): string {
  return "https://calendar.google.com/";
}
