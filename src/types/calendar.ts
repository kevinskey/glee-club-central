
export type EventType = "rehearsal" | "concert" | "sectional" | "special" | "tour";

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: string; // ISO date
  end: string;   // ISO date
  location?: string;
  description?: string;
  created_by: string; // user ID
  allDay?: boolean;   // Added allDay property
}
