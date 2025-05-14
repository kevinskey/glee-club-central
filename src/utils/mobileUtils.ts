
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarEvent } from "@/types/calendar";
import { isSameDay } from "date-fns";

/**
 * Custom hook that returns optimized event handlers for both touch and mouse
 * Useful for interactive elements that need to work on both mobile and desktop
 */
export const useUnifiedInteractionHandlers = () => {
  const isMobile = useIsMobile();

  const onPointerDown = (mouseHandler: (e: MouseEvent) => void, touchHandler: (e: TouchEvent) => void) => {
    return (e: React.PointerEvent) => {
      if (isMobile && e.pointerType === 'touch') {
        // Convert to a TouchEvent or execute touch-specific logic
        touchHandler(e.nativeEvent as unknown as TouchEvent);
      } else {
        mouseHandler(e.nativeEvent as MouseEvent);
      }
    };
  };

  const onClick = (mouseHandler: (e: MouseEvent) => void, touchHandler: (e: TouchEvent) => void) => {
    return (e: React.MouseEvent | React.TouchEvent) => {
      if (isMobile && e.type === 'touchstart') {
        touchHandler(e.nativeEvent as TouchEvent);
      } else {
        mouseHandler(e.nativeEvent as MouseEvent);
      }
    };
  };

  return {
    onPointerDown,
    onClick,
    isMobile
  };
};

/**
 * Adds mouse event handlers to an element
 * @param element HTML Element to attach handlers to
 * @param eventListeners Object containing event listeners to add
 */
export const addMouseHandlers = (element: HTMLElement, eventListeners: Record<string, EventListener>) => {
  if (!element) return;

  Object.entries(eventListeners).forEach(([event, listener]) => {
    element.addEventListener(event, listener);
  });
};

/**
 * Removes mouse event handlers from an element
 * @param element HTML Element to remove handlers from
 * @param eventListeners Object containing event listeners to remove
 */
export const removeMouseHandlers = (element: HTMLElement, eventListeners: Record<string, EventListener>) => {
  if (!element) return;

  Object.entries(eventListeners).forEach(([event, listener]) => {
    element.removeEventListener(event, listener);
  });
};

/**
 * Adds touch event handlers that mimic mouse events
 * @param element HTML Element to attach handlers to
 * @returns Object containing touch handlers that were added
 */
export const addTouchHandlers = (element: HTMLElement) => {
  const touchEvents: Record<string, EventListener> = {};
  
  if (!element) return touchEvents;
  
  // Convert mouse event to touch event
  const mapTouch = (mouseHandler: (e: MouseEvent) => void) => {
    return (e: TouchEvent) => {
      // Prevent default to avoid double events
      e.preventDefault();
      
      // Create a synthetic mouse event from touch data
      const touch = e.touches[0] || e.changedTouches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: touch.clientX,
        clientY: touch.clientY,
        screenX: touch.screenX,
        screenY: touch.screenY
      });
      
      // Call the original mouse handler with our synthetic event
      mouseHandler(mouseEvent);
    };
  };
  
  // We can't access event listeners directly in standard DOM
  // Instead, let's just add touch handlers for common interactions
  const addCommonTouchHandlers = () => {
    // For elements that might have click handlers
    if (element.onclick) {
      const touchHandler = (e: TouchEvent) => {
        e.preventDefault();
        element.click();
      };
      element.addEventListener('touchend', touchHandler);
      touchEvents.touchend = touchHandler;
    }
  };
  
  addCommonTouchHandlers();
  return touchEvents;
};

/**
 * Removes touch event handlers from an element
 * @param element HTML Element to remove handlers from
 * @param touchEvents Object containing touch event listeners to remove
 */
export const removeTouchHandlers = (element: HTMLElement, touchEvents: Record<string, EventListener>) => {
  if (!element) return;

  Object.entries(touchEvents).forEach(([event, listener]) => {
    element.removeEventListener(event, listener);
  });
};

/**
 * Gets events for a specific date from the events array
 */
export function getEventsForDate(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = event.start instanceof Date ? event.start : new Date(event.start);
    return isSameDay(eventDate, date);
  });
}

/**
 * Formats time text for mobile display
 */
export function formatTimeForMobile(timeStr: string): string {
  if (!timeStr) return "";
  
  // Try to parse time if it's in HH:MM format
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  }
  
  return timeStr;
}

/**
 * Get mobile optimized settings for FullCalendar
 */
export function getMobileCalendarSettings() {
  return {
    headerToolbar: false,
    dayMaxEventRows: 2,
    dayMaxEvents: 2,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    moreLinkText: count => `+${count} more`
  };
}

/**
 * Check if an event's text will fit nicely on mobile displays
 */
export function checkEventMobileFit(title: string, location: string, description?: string): { 
  fits: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check title length
  if (title.length > 30) {
    issues.push(`Title is too long (${title.length} characters) for mobile displays.`);
    suggestions.push('Shorten the title to 30 characters or less for better mobile display.');
  }
  
  // Check location length
  if (location.length > 20) {
    issues.push(`Location is too long (${location.length} characters) for mobile displays.`);
    suggestions.push('Use abbreviations or shorter location names for mobile displays.');
  }
  
  // Check description if provided
  if (description && description.length > 100) {
    issues.push(`Description is too long (${description.length} characters) for mobile displays.`);
    suggestions.push('Keep descriptions concise for mobile users or provide key details only.');
  }
  
  return {
    fits: issues.length === 0,
    issues,
    suggestions
  };
}
