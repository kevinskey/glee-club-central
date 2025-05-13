
/**
 * Utility function to check if an event will display well on mobile screens
 * 
 * @param title The event title
 * @param location The event location
 * @param description The event description
 * @returns Object with fit status, issues, and suggestions
 */
export function checkEventMobileFit(title: string | undefined, location: string | undefined, description: string | undefined) {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check title length
  if (title && title.length > 60) {
    issues.push("Title is too long for mobile displays");
    suggestions.push("Keep the title under 60 characters");
  }
  
  // Check location length
  if (location && location.length > 80) {
    issues.push("Location text is too long for mobile displays");
    suggestions.push("Consider abbreviating the location");
  }
  
  // Check description length and formatting
  if (description) {
    if (description.length > 500) {
      issues.push("Description is very long for mobile displays");
      suggestions.push("Consider condensing the description or using bullet points");
    }
    
    // Check for long words that might break layout
    const longWords = description.split(' ').filter(word => word.length > 25);
    if (longWords.length > 0) {
      issues.push("Description contains very long words that may break mobile layout");
      suggestions.push("Break up long words or URLs with hyphens");
    }
    
    // Check for excessive line breaks
    if ((description.match(/\n/g) || []).length > 8) {
      issues.push("Description has too many line breaks for mobile display");
      suggestions.push("Reduce the number of line breaks");
    }
  }
  
  return {
    fits: issues.length === 0,
    issues,
    suggestions
  };
}
