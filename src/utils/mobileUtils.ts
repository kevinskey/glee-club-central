
/**
 * Mobile utility functions for checking content presentation on smaller screens
 */

const MOBILE_TITLE_MAX_LENGTH = 30; // Max characters for event title on mobile
const MOBILE_LOCATION_MAX_LENGTH = 40; // Max characters for location on mobile
const MOBILE_DESC_MAX_WORDS = 50; // Max words for description preview on mobile

/**
 * Checks if event text content will display well on mobile screens
 * @param title Event title
 * @param location Event location
 * @param description Event description
 * @returns Object with fit status and suggestions
 */
export function checkEventMobileFit(
  title: string,
  location: string,
  description?: string
): {
  fits: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check title length
  if (title.length > MOBILE_TITLE_MAX_LENGTH) {
    issues.push(`Title is too long for mobile (${title.length}/${MOBILE_TITLE_MAX_LENGTH} chars)`);
    suggestions.push(`Consider shortening the title to ${MOBILE_TITLE_MAX_LENGTH} chars or less`);
  }
  
  // Check location length
  if (location.length > MOBILE_LOCATION_MAX_LENGTH) {
    issues.push(`Location is too long for mobile (${location.length}/${MOBILE_LOCATION_MAX_LENGTH} chars)`);
    suggestions.push(`Consider shortening the location to ${MOBILE_LOCATION_MAX_LENGTH} chars or less`);
  }
  
  // Check description length if provided
  if (description && description.trim() !== '') {
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > MOBILE_DESC_MAX_WORDS) {
      issues.push(`Description is too long for mobile (${wordCount}/${MOBILE_DESC_MAX_WORDS} words)`);
      suggestions.push(`Consider shortening the description or using a "Read more" feature`);
    }
  }
  
  return {
    fits: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Truncates text to specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateForMobile(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Detects touch gesture direction and distance
 * @param startX Touch start X position
 * @param endX Touch end X position
 * @param startY Touch start Y position
 * @param endY Touch end Y position
 * @param threshold Minimum distance to consider a swipe
 * @returns Object with swipe information
 */
export function detectSwipe(
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  threshold: number = 50
): {
  direction: 'left' | 'right' | 'up' | 'down' | 'none';
  distance: number;
  isHorizontal: boolean;
} {
  const deltaX = startX - endX;
  const deltaY = startY - endY;
  
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);
  
  // If movement is below threshold, no swipe detected
  if (absDeltaX < threshold && absDeltaY < threshold) {
    return {
      direction: 'none',
      distance: Math.max(absDeltaX, absDeltaY),
      isHorizontal: absDeltaX > absDeltaY
    };
  }
  
  // Determine direction based on which delta is larger
  if (absDeltaX > absDeltaY) {
    return {
      direction: deltaX > 0 ? 'left' : 'right',
      distance: absDeltaX,
      isHorizontal: true
    };
  } else {
    return {
      direction: deltaY > 0 ? 'up' : 'down',
      distance: absDeltaY,
      isHorizontal: false
    };
  }
}

/**
 * Checks if a viewport size is considered mobile
 * @returns Boolean indicating if current viewport is mobile
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // 768px is standard mobile breakpoint
}

/**
 * Gets appropriate margins for mobile navigation elements
 * @returns CSS class string with appropriate margins
 */
export function getMobileNavMargins(): string {
  return "mb-16 pb-4"; // Bottom margin to accommodate mobile nav
}
