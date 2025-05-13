
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface MobileFitCheckProps {
  title: string;
  location: string;
  description: string;
}

export function MobileFitCheck({
  title,
  location,
  description,
}: MobileFitCheckProps) {
  const issues = [];

  if (title.length > 40) issues.push(`Title is ${title.length} characters long, which may be too long for mobile displays.`);
  if (location.length > 35) issues.push(`Location is ${location.length} characters long, which may be too long for mobile displays.`);
  if (description.length > 280) issues.push(`Description is ${description.length} characters long, which may be too long for mobile displays.`);

  if (issues.length === 0) return null;

  return (
    <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-900">
      <Info className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Mobile display warning</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <ul className="list-disc pl-4 mt-2 space-y-1">
          {issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
