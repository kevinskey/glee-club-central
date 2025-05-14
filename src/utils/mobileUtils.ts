
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Checks if an event title, location, and description will fit well on mobile screens
 */
export function checkEventMobileFit(title: string, location: string, description?: string) {
  const result = {
    fits: true,
    issues: [] as string[],
    suggestions: [] as string[],
  };

  // Check title length
  if (title.length > 30) {
    result.fits = false;
    result.issues.push(`Title is ${title.length} characters (recommended: max 30 for mobile)`);
    result.suggestions.push("Consider using a shorter title for better mobile display");
  }

  // Check location length
  if (location && location.length > 25) {
    result.fits = false;
    result.issues.push(`Location is ${location.length} characters (recommended: max 25 for mobile)`);
    result.suggestions.push("Abbreviate the location name for mobile display");
  }

  // Check description length
  if (description && description.length > 100) {
    result.fits = false;
    result.issues.push(`Description is long (${description.length} characters)`);
    result.suggestions.push("Consider shortening the description or using expandable sections");
  }

  return result;
}

/**
 * Returns optimized calendar view settings for mobile devices
 */
export function getMobileCalendarSettings() {
  return {
    views: {
      dayGridMonth: {
        dayHeaderFormat: { weekday: 'narrow' },  // Use single letter for weekdays on mobile
        dayMaxEventRows: 2,
        moreLinkText: count => `+${count}`
      },
      timeGridWeek: {
        dayHeaderFormat: { weekday: 'narrow', day: 'numeric' },
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true
        }
      },
      timeGridDay: {
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true
        }
      },
      listWeek: {
        listDaySideFormat: false,  // Simplify the list view for mobile
        listDayFormat: { weekday: 'short', day: 'numeric' }
      }
    },
    height: 'auto',  // Auto-adjust height based on content
    headerToolbar: false,  // We'll use our custom mobile header
    dayMaxEvents: 2  // Limit events shown per day
  };
}

/**
 * Formats event content for optimal mobile display
 */
export function formatEventForMobile(event: any) {
  const { title, start, end, location, type } = event;
  const formattedTitle = title.length > 20 ? `${title.substring(0, 18)}...` : title;
  
  return {
    formattedTitle,
    isMultiDay: start && end ? new Date(start).getDate() !== new Date(end).getDate() : false,
    location: location && location.length > 15 ? `${location.substring(0, 13)}...` : location
  };
}

/**
 * Returns appropriate sizes for UI elements based on screen size
 */
export function getResponsiveSizes() {
  const isMobile = useIsMobile();
  
  return {
    buttonSize: isMobile ? "default" : "lg",
    iconSize: isMobile ? 18 : 24,
    padding: isMobile ? "p-3 sm:p-4" : "p-4 md:p-6",
    gap: isMobile ? "gap-3" : "gap-4 md:gap-6",
    fontSize: isMobile ? "text-sm" : "text-base",
    headingSize: isMobile ? "text-xl" : "text-2xl md:text-3xl",
    containerWidth: isMobile ? "w-full px-4" : "container",
    imageQuality: isMobile ? "quality-auto" : "quality-high"
  };
}

/**
 * Helper for proper touch handling on mobile
 */
export function addTouchSupport(element: HTMLElement) {
  // Convert mouse events to touch for better mobile experience
  const touchEvents: Record<string, (e: TouchEvent) => void> = {};
  
  // Map mouse events to touch events
  const mapTouch = (mouseHandler: (e: MouseEvent) => void) => {
    return (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          bubbles: true
        });
        mouseHandler(mouseEvent);
      }
    };
  };
  
  // Get all mouse event handlers
  const mouseEvents = element.getEventListeners?.('mousedown') || [];
  
  // Add equivalent touch events
  mouseEvents.forEach(event => {
    const touchHandler = mapTouch(event.listener as (e: MouseEvent) => void);
    element.addEventListener('touchstart', touchHandler);
    touchEvents.touchstart = touchHandler;
  });
  
  // Return cleanup function
  return () => {
    Object.entries(touchEvents).forEach(([event, handler]) => {
      element.removeEventListener(event, handler);
    });
  };
}

/**
 * Function to adjust font size for better mobile readability
 */
export function getResponsiveFontSize(baseSize: number): string {
  return `clamp(${baseSize * 0.85}rem, ${baseSize * 0.65}rem + 1vw, ${baseSize}rem)`;
}
