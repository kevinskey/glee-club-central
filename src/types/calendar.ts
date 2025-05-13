
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  description?: string;
  location?: string;
  url?: string;
  classNames?: string[];
  extendedProps?: Record<string, any>;
}

export interface CalendarSettings {
  defaultView: string;
  firstDay: number;
  businessHours: {
    start: string;
    end: string;
    daysOfWeek: number[];
  };
  showWeekends: boolean;
  showEventTimes: boolean;
}
