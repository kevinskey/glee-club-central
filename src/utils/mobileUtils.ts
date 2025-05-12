
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
