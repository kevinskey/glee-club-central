
export type EventType = "concert" | "rehearsal" | "sectional" | "special" | "tour";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date | string; // Date object or ISO string
  time?: string; // Optional time in "HH:MM" format
  location?: string;
  description?: string;
  type: EventType;
  start: Date | string; // Date object or ISO string for FullCalendar
  end: Date | string; // Date object or ISO string for FullCalendar
  allDay?: boolean;
  created_by?: string;
  image_url?: string | null;
  source?: "google" | "local"; // Source of the event (google calendar or local)
}

// Add missing GoogleCalendarToken interface
export interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  created_at: string;
}
