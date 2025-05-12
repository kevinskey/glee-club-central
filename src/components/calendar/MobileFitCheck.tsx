
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkEventMobileFit } from '@/utils/mobileUtils';

interface MobileFitCheckProps {
  title: string;
  location: string;
  description: string;
  showPreview?: boolean;
}

export function MobileFitCheck({ title, location, description, showPreview = false }: MobileFitCheckProps) {
  const result = checkEventMobileFit(title, location, description);
  
  if (result.fits) {
    return (
      <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
        <p className="text-xs text-green-700 dark:text-green-400">
          ✓ Content will display well on mobile devices
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-2">
      <Alert variant="destructive" className="p-3">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-xs font-medium">Mobile display issues detected</AlertTitle>
        <AlertDescription className="text-xs mt-1">
          {result.issues.length > 0 && (
            <ul className="list-disc pl-4 space-y-1">
              {result.issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          )}
          
          {result.suggestions.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Suggestions:</p>
              <ul className="list-disc pl-4 space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </AlertDescription>
      </Alert>
      
      {showPreview && (
        <div className="mt-3">
          <p className="text-xs font-semibold mb-1">Mobile Preview:</p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 mx-auto" style={{ width: '260px', maxWidth: '100%' }}>
            <div className="text-sm font-semibold truncate">{title || 'Event Title'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{location || 'Location'}</div>
            <div className="text-xs mt-1 line-clamp-2">{description || 'Event description'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
