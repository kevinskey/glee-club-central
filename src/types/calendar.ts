
export type EventType = "concert" | "rehearsal" | "sectional" | "special";

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
