
import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { checkEventMobileFit, MobileFitCheckResult } from "@/utils/calendarMobileUtils";

interface MobileFitCheckProps {
  title: string;
  description?: string;
  location?: string;
}

export function MobileFitCheck({ title, description, location }: MobileFitCheckProps) {
  const [result, setResult] = useState<MobileFitCheckResult>({ fits: true, issues: [], suggestions: [] });
  
  useEffect(() => {
    const checkResult = checkEventMobileFit(title, description, location);
    setResult(checkResult);
  }, [title, description, location]);
  
  if (result.fits) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-400">Mobile Ready</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-500">
          This event will display well on mobile devices.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="default" className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-400">Mobile View Issues</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-500">
        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
          {result.issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
        
        <div className="mt-2 font-medium text-sm">Suggestions:</div>
        <ul className="list-disc list-inside text-sm space-y-1">
          {result.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
