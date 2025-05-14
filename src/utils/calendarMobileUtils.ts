
import { CalendarEvent } from "@/types/calendar";

export interface MobileFitCheckResult {
  fits: boolean;
  issues: string[];
  suggestions: string[];
}

export function checkEventMobileFit(
  title: string,
  description?: string,
  location?: string
): MobileFitCheckResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let fits = true;
  
  // Check title length
  if (title.length > 30) {
    fits = false;
    issues.push("Title is too long for mobile view");
    suggestions.push("Shorten the title to under 30 characters");
  }
  
  // Check description length
  if (description && description.length > 150) {
    fits = false;
    issues.push("Description is too long for mobile view");
    suggestions.push("Shorten the description or break it into sections");
  }
  
  // Check location length
  if (location && location.length > 30) {
    fits = false;
    issues.push("Location name is too long for mobile view");
    suggestions.push("Use abbreviations or a shorter location name");
  }
  
  // Everything looks good
  if (issues.length === 0) {
    suggestions.push("Event details look good for mobile view!");
  }
  
  return {
    fits,
    issues,
    suggestions
  };
}

// Helper function to get mobile calendar settings
export function getMobileCalendarSettings() {
  return {
    headerToolbar: false,
    height: 'auto',
    contentHeight: 'auto',
    aspectRatio: 0.5,
    expandRows: true,
    dayMaxEventRows: 2,
    views: {
      listWeek: {
        listDayFormat: { weekday: 'short' as const, month: 'short' as const, day: 'numeric' as const },
        listDaySideFormat: false
      }
    }
  };
}
