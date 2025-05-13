
import React from "react";
import { GoogleCalendarConnect } from "./GoogleCalendarConnect";
import { CalendarImportExport } from "./CalendarImportExport";
import { CalendarShare } from "./CalendarShare";
import { CalendarEvent } from "@/types/calendar";
import { Card } from "@/components/ui/card";
import { usePermissions } from "@/hooks/usePermissions";

interface CalendarToolsProps {
  events: CalendarEvent[];
  onImportEvents: (events: any[]) => Promise<void>;
  className?: string;
}

export function CalendarTools({ events, onImportEvents, className = "" }: CalendarToolsProps) {
  const { isSuperAdmin } = usePermissions();
  
  // Only show admin tools for admins
  if (!isSuperAdmin) {
    return null;
  }
  
  return (
    <Card className={`p-4 space-y-6 ${className}`}>
      <h2 className="text-xl font-bold">Calendar Tools</h2>
      
      <GoogleCalendarConnect />
      
      <CalendarImportExport events={events} onImport={onImportEvents} />
      
      <CalendarShare />
    </Card>
  );
}
