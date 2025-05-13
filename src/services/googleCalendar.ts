
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for Google Calendar Events
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  location: string;
  start: { dateTime: string; timeZone: string } | { date: string };
  end: { dateTime: string; timeZone: string } | { date: string };
  colorId?: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
}

/**
 * Checks if the current user has connected their Google Calendar
 */
export async function checkGoogleCalendarConnection(): Promise<boolean> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError || !authData.session) {
      console.error("Authentication error:", authError);
      return false;
    }
    
    const { data, error } = await supabase.functions.invoke("google-calendar-auth", {
      body: { 
        action: "check_connection"
      }
    });
    
    if (error) {
      console.error("Error checking Google Calendar connection:", error);
      return false;
    }
    
    return data?.connected || false;
  } catch (error) {
    console.error("Error in checkGoogleCalendarConnection:", error);
    return false;
  }
}

/**
 * Gets the Google Calendar authentication URL for connecting a user's calendar
 */
export async function getGoogleCalendarAuthUrl(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("google-calendar-auth", {
      body: { 
        action: "get_auth_url"
      }
    });
    
    if (error) {
      console.error("Error getting Google Calendar auth URL:", error);
      return null;
    }
    
    return data?.authUrl || null;
  } catch (error) {
    console.error("Error in getGoogleCalendarAuthUrl:", error);
    return null;
  }
}

/**
 * Disconnects the current user's Google Calendar
 */
export async function disconnectGoogleCalendar(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("google-calendar-auth", {
      body: { 
        action: "disconnect"
      }
    });
    
    if (error) {
      console.error("Error disconnecting Google Calendar:", error);
      toast.error("Failed to disconnect Google Calendar");
      return false;
    }
    
    toast.success("Google Calendar disconnected successfully");
    return true;
  } catch (error) {
    console.error("Error in disconnectGoogleCalendar:", error);
    toast.error("An error occurred while disconnecting Google Calendar");
    return false;
  }
}

/**
 * Syncs events between Google Calendar and local calendar
 */
export async function syncWithGoogleCalendar(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("google-calendar-sync", {
      body: { 
        action: "full_sync"
      }
    });
    
    if (error) {
      console.error("Error syncing with Google Calendar:", error);
      toast.error("Failed to sync with Google Calendar");
      return false;
    }
    
    if (data?.stats) {
      toast.success(`Sync completed: ${data.stats.eventsCreatedLocally} events imported, ${data.stats.localEventsSyncedToGoogle} events exported`);
    } else {
      toast.success("Calendar synchronized successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error in syncWithGoogleCalendar:", error);
    toast.error("An error occurred while syncing with Google Calendar");
    return false;
  }
}

/**
 * Exports local calendar events to iCal format
 */
export function exportCalendarToIcal(events: any[]): void {
  try {
    // Basic iCal format
    let icalContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Spelman Glee Club//Calendar//EN"
    ];
    
    // Add each event
    events.forEach(event => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end || startDate);
      
      // Format dates for iCal
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/g, "");
      };
      
      icalContent = [
        ...icalContent,
        "BEGIN:VEVENT",
        `UID:${event.id}`,
        `SUMMARY:${event.title || "Unnamed Event"}`,
        `DESCRIPTION:${event.description || ""}`,
        `LOCATION:${event.location || ""}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        "END:VEVENT"
      ];
    });
    
    // Close the calendar
    icalContent.push("END:VCALENDAR");
    
    // Create blob and download
    const blob = new Blob([icalContent.join("\r\n")], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glee-club-calendar.ics";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Calendar exported successfully");
  } catch (error) {
    console.error("Error exporting calendar:", error);
    toast.error("Failed to export calendar");
  }
}

/**
 * Handles import of iCal format calendar files
 */
export async function importCalendarFromIcal(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content) {
          toast.error("Could not read file");
          reject("Could not read file");
          return;
        }
        
        // Very basic iCal parsing
        const events: any[] = [];
        const lines = content.split(/\r\n|\n|\r/);
        
        let currentEvent: any = null;
        
        lines.forEach(line => {
          if (line === "BEGIN:VEVENT") {
            currentEvent = {};
          } else if (line === "END:VEVENT" && currentEvent) {
            events.push(currentEvent);
            currentEvent = null;
          } else if (currentEvent) {
            const [key, ...valueParts] = line.split(":");
            const value = valueParts.join(":");
            
            if (key === "SUMMARY") {
              currentEvent.title = value;
            } else if (key === "DESCRIPTION") {
              currentEvent.description = value;
            } else if (key === "LOCATION") {
              currentEvent.location = value;
            } else if (key === "DTSTART") {
              currentEvent.start = parseIcalDate(value);
            } else if (key === "DTEND") {
              currentEvent.end = parseIcalDate(value);
            } else if (key === "UID") {
              currentEvent.external_id = value;
            }
          }
        });
        
        // Standardize event format
        const processedEvents = events.map(event => ({
          ...event,
          type: determineEventType(event.title, event.description),
          // Add more fields as needed
        }));
        
        toast.success(`Imported ${processedEvents.length} events`);
        resolve(processedEvents);
      } catch (error) {
        console.error("Error parsing calendar import:", error);
        toast.error("Failed to parse calendar file");
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Error reading file");
      reject(error);
    };
    
    reader.readAsText(file);
  });
}

// Helper function to parse iCal date format
function parseIcalDate(value: string): string {
  // Basic implementation - would need enhancement for production
  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const day = value.slice(6, 8);
  const hour = value.slice(9, 11) || "00";
  const minute = value.slice(11, 13) || "00";
  
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

// Helper function to determine event type based on title/description
function determineEventType(title: string, description: string): string {
  const text = (title + " " + (description || "")).toLowerCase();
  
  if (text.includes("concert") || text.includes("performance")) {
    return "concert";
  } else if (text.includes("rehearsal")) {
    return "rehearsal";
  } else if (text.includes("sectional")) {
    return "sectional";
  } else if (text.includes("tour")) {
    return "tour";
  } else {
    return "special";
  }
}
