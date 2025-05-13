
export type EventType = "rehearsal" | "concert" | "sectional" | "special" | "tour";

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: string; // ISO date string
  end: string;   // ISO date string
  date?: Date;    // For UI display
  time?: string;  // For UI display
  location?: string;
  description?: string;
  created_by: string; // user ID
  allDay?: boolean;   // Added allDay property
  google_event_id?: string; // Added for Google Calendar integration
  source?: string;    // For tracking event source (google, supabase, etc.)
}
