
export type EventType = "concert" | "rehearsal" | "sectional" | "special" | "tour";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  description?: string;
  location?: string;
  type: EventType;
  image_url?: string | null;
  created_by?: string;
  source?: "local" | "google";
  date?: string | Date; // For backward compatibility
  time?: string;
  allDay?: boolean; // Added missing property
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string, timeZone?: string } | { date: string };
  end: { dateTime: string, timeZone?: string } | { date: string };
  description: string;
  location: string;
}

export interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  calendar_id: string;
  created_at?: string;
}
