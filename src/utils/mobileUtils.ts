
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
