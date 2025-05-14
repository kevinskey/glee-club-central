
import { EventInput } from '@fullcalendar/core';

// Interface for the mobile fit check result
export interface MobileFitCheckResult {
  fits: boolean;
  issues: string[];
  suggestions: string[];
}

/**
 * Check if an event will fit well on mobile displays
 * @param title Event title
 * @param description Event description
 * @param location Event location
 * @returns Object with fit status, issues and suggestions
 */
export function checkEventMobileFit(
  title: string,
  description?: string,
  location?: string
): MobileFitCheckResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check title length
  if (title && title.length > 30) {
    issues.push("Title is too long for mobile view");
    suggestions.push("Consider shortening the title to 30 characters or less");
  }
  
  // Check description length
  if (description && description.length > 200) {
    issues.push("Description is too long for mobile view");
    suggestions.push("Consider shortening the description to improve mobile experience");
  }
  
  // Check location length
  if (location && location.length > 40) {
    issues.push("Location text is too long for mobile view");
    suggestions.push("Consider using a shorter location or abbreviation");
  }
  
  return {
    fits: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Get optimal calendar settings for mobile view
 * @returns Object with mobile-optimized calendar settings
 */
export function getMobileCalendarSettings() {
  return {
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },
    dayMaxEventRows: 2,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    views: {
      timeGridDay: {
        slotDuration: '00:30:00',
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true,
          meridiem: 'short'
        }
      },
      listWeek: {
        listDayFormat: { weekday: 'short' },
        listDayAltFormat: { month: 'short', day: 'numeric' }
      }
    }
  };
}
