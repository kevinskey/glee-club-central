
/**
 * Check if event details will fit well on mobile screens
 */
export const checkEventMobileFit = (
  title?: string, 
  location?: string, 
  description?: string
) => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check title length
  if (title && title.length > 40) {
    issues.push("Title is too long for mobile screens");
    suggestions.push("Keep title under 40 characters");
  }
  
  // Check location length
  if (location && location.length > 35) {
    issues.push("Location is too long for mobile screens");
    suggestions.push("Abbreviate location to under 35 characters");
  }
  
  // Check description length and paragraphs
  if (description) {
    if (description.length > 300) {
      issues.push("Description is quite long for mobile screens");
      suggestions.push("Consider shortening description or breaking into bullet points");
    }
    
    const paragraphs = description.split('\n').filter(p => p.trim().length > 0);
    if (paragraphs.length > 4) {
      issues.push("Too many paragraphs for mobile display");
      suggestions.push("Limit description to 3-4 paragraphs");
    }
  }
  
  return {
    fits: issues.length === 0,
    issues,
    suggestions
  };
};
