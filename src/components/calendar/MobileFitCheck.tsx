
import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { checkEventMobileFit } from '@/utils/mobileUtils';

interface MobileFitCheckProps {
  title: string;
  location: string;
  description?: string;
  showPreview?: boolean;
}

export function MobileFitCheck({ title, location, description, showPreview = false }: MobileFitCheckProps) {
  const { fits, issues, suggestions } = checkEventMobileFit(title, location, description);
  
  if (fits && !showPreview) return null;
  
  return (
    <div className="mt-4 rounded-md border p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center mb-2">
        <div className="mr-2">
          {fits ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
        </div>
        <h4 className="font-medium text-sm">
          {fits ? "Mobile-friendly content ✓" : "Mobile display issues detected"}
        </h4>
      </div>
      
      {!fits && (
        <div className="space-y-2 ml-7">
          <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
            {issues.map((issue, index) => (
              <li key={`issue-${index}`} className="flex items-start">
                <span className="mr-1">•</span>
                {issue}
              </li>
            ))}
          </ul>
          
          <div className="text-xs text-gray-600 dark:text-gray-300">
            <p className="font-medium">Suggestions:</p>
            <ul className="space-y-1 ml-1">
              {suggestions.map((suggestion, index) => (
                <li key={`suggestion-${index}`} className="flex items-start">
                  <span className="mr-1">-</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {showPreview && fits && (
        <div className="text-xs text-gray-600 dark:text-gray-300 ml-7">
          <p>Your event content will display well on mobile devices.</p>
        </div>
      )}
      
      {showPreview && (
        <div className="mt-3 border rounded-lg p-2 mx-auto max-w-[320px] bg-white dark:bg-gray-900">
          <div className="text-xs text-gray-500 mb-1">Mobile preview:</div>
          <div className="mockup-phone border-2">
            <div className="phone-content p-2 overflow-hidden">
              <div className="text-sm font-medium truncate">{title}</div>
              <div className="text-xs text-gray-500 truncate">{location}</div>
              {description && (
                <div className="text-xs mt-1 line-clamp-2">{description}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
