
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  location?: string;
  url?: string;
  classNames?: string[];
  editable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  resourceEditable?: boolean;
  display?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: Record<string, any>;
  source?: any;
  date?: Date | string; // Updated to accept both Date and string
  time?: string;
  type?: string; // Changed to string to accept all event types
  created_by?: string;
  image_url?: string | null;
}

// Updated enum to include all event types used in the application
export enum EventType {
  REHEARSAL = "rehearsal",
  PERFORMANCE = "performance",
  MEETING = "meeting",
  OTHER = "other",
  CONCERT = "concert",
  SECTIONAL = "sectional",
  SPECIAL = "special",
  TOUR = "tour"
}

export interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  isModalOpen: boolean;
  isViewModalOpen: boolean;
  editMode: boolean;
  filterTypes: Record<string, boolean>;
}

export interface FilterState {
  rehearsals: boolean;
  performances: boolean;
  meetings: boolean;
  other: boolean;
}

export interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  created_at: string;
}
