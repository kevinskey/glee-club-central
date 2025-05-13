
import React from "react";
import { checkEventMobileFit } from "@/utils/mobileUtils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MobileFitCheckProps {
  title: string | undefined;
  location: string | undefined;
  description: string | undefined;
}

export function MobileFitCheck({ title, location, description }: MobileFitCheckProps) {
  const mobileFitCheck = checkEventMobileFit(title, location, description);
  
  if (mobileFitCheck.fits) {
    return null;
  }
  
  return (
    <Alert className="mt-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20">
      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-300">Mobile Display Warning</AlertTitle>
      <AlertDescription className="text-sm">
        <p className="text-yellow-700 dark:text-yellow-300 mb-2">
          This event may not display optimally on mobile devices.
        </p>
        
        {mobileFitCheck.issues.length > 0 && (
          <div className="mb-2">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Issues:</p>
            <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-300 text-xs space-y-1">
              {mobileFitCheck.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
        
        {mobileFitCheck.suggestions.length > 0 && (
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Suggestions:</p>
            <ul className="list-disc pl-5 text-yellow-700 dark:text-yellow-300 text-xs space-y-1">
              {mobileFitCheck.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
