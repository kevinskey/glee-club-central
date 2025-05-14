
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
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string, timeZone?: string } | { date: string };
  end: { dateTime: string, timeZone?: string } | { date: string };
  description: string;
  location: string;
}
