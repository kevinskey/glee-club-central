
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
  date?: string; // Added missing property
  time?: string; // Added missing property
  type?: EventType; // Added missing property
  created_by?: string; // Added missing property
}

export enum EventType {
  REHEARSAL = "rehearsal",
  PERFORMANCE = "performance",
  MEETING = "meeting",
  OTHER = "other"
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
