
/**
 * Utility functions for mobile calendar display
 */
import { EventContentArg } from '@fullcalendar/core';

// Interface for mobile calendar display settings
export interface MobileCalendarSettings {
  initialView: string;
  headerToolbar: {
    left: string;
    center: string;
    right: string;
  };
  footerToolbar: {
    left: string;
    center: string;
    right: string;
  } | null;
  height: string | number;
}

/**
 * Get calendar settings optimized for mobile view
 */
export const getMobileCalendarSettings = (isMobile: boolean): MobileCalendarSettings => {
  if (isMobile) {
    return {
      initialView: 'listMonth',
      headerToolbar: {
        left: 'title',
        center: '',
        right: 'prev,next today'
      },
      footerToolbar: {
        left: 'dayGridMonth,listMonth',
        center: '',
        right: ''
      },
      height: 'auto'
    };
  } else {
    return {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      footerToolbar: null,
      height: 'auto'
    };
  }
};

/**
 * Check if an event will fit properly on mobile devices
 */
export const checkEventMobileFit = (eventInfo: EventContentArg): boolean => {
  const { event } = eventInfo;
  const start = event.start;
  const end = event.end;
  
  // If we don't have both start and end times, no issue with fit
  if (!start || !end) return true;
  
  // Calculate duration in hours
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  // For mobile views, events less than 1.5 hours might be too small to display well
  return durationHours >= 1.5;
};
