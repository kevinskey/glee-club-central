
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface MobileFitCheckProps {
  title?: string;
  location?: string;
  description?: string;
}

export function MobileFitCheck({ title, location, description }: MobileFitCheckProps) {
  const { fits, issues, suggestions } = checkEventMobileFit(title, location, description);
  
  if (fits) {
    return null;
  }
  
  return (
    <Alert className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-900">
      <InfoIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-sm font-medium">Mobile Display Concerns</AlertTitle>
      <AlertDescription className="text-xs">
        <ul className="list-disc pl-4 mt-2 mb-2">
          {issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
        <p className="font-medium mt-2 mb-1">Suggestions:</p>
        <ul className="list-disc pl-4">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

// Import the utility function
function checkEventMobileFit(
  title?: string, 
  location?: string, 
  description?: string
) {
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
}
