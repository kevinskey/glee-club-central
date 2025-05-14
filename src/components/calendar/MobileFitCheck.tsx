
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkEventMobileFit, MobileFitCheckResult } from '@/utils/calendarMobileUtils';

interface MobileFitCheckProps {
  title: string;
  description?: string;
  location?: string;
  className?: string;
}

export const MobileFitCheck: React.FC<MobileFitCheckProps> = ({
  title,
  description,
  location,
  className = ''
}) => {
  // Call the checkEventMobileFit function from calendarMobileUtils
  const result = checkEventMobileFit(title, description, location);

  if (!result.issues.length) {
    return (
      <Alert className={`bg-green-50 border-green-200 ${className}`}>
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">Looks good on mobile!</AlertTitle>
        <AlertDescription className="text-green-700">
          This event will display well on mobile devices.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`bg-amber-50 border-amber-200 ${className}`}>
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800">Mobile display issues detected</AlertTitle>
      <AlertDescription className="text-amber-700 mt-2">
        <ul className="list-disc list-inside space-y-1">
          {result.issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
        {result.suggestions.length > 0 && (
          <>
            <p className="font-medium mt-2">Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              {result.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};
