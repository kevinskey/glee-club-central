
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkEventMobileFit } from "@/utils/calendarMobileUtils";

interface MobileFitCheckProps {
  title: string;
  location: string;
  description?: string;
}

export function MobileFitCheck({ title, location, description }: MobileFitCheckProps) {
  const result = checkEventMobileFit(title, location, description);
  
  if (result.fits) {
    return null;
  }
  
  return (
    <Alert variant="warning">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Mobile display warning</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {result.issues.map((issue, index) => (
            <li key={index} className="text-sm">{issue}</li>
          ))}
        </ul>
        
        <div className="mt-2">
          <h4 className="text-sm font-medium">Suggestions:</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm">{suggestion}</li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}
