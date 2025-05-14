
/**
 * Checks if event content will display well on mobile devices
 */
export function checkEventMobileFit(
  title: string, 
  location: string, 
  description?: string
) {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check title length
  if (title && title.length > 30) {
    issues.push("Title is too long for small screens");
    suggestions.push("Consider shortening the title to 30 characters or less");
  }
  
  // Check location length
  if (location && location.length > 25) {
    issues.push("Location name is too long for small screens");
    suggestions.push("Consider using abbreviations or shorter location name");
  }
  
  // Check description
  if (description && description.length > 100) {
    issues.push("Long description might not display well on mobile");
    suggestions.push("Consider using shorter descriptions or formatting with line breaks");
  }
  
  return {
    fits: issues.length === 0,
    issues,
    suggestions
  };
}
