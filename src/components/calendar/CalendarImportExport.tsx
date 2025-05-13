
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Upload, MoreHorizontal } from "lucide-react";
import { CalendarEvent } from "@/types/calendar";

export interface CalendarImportExportProps {
  events: CalendarEvent[];
  onImport: (events: any[]) => Promise<void>;
}

export const CalendarImportExport: React.FC<CalendarImportExportProps> = ({ events, onImport }) => {
  const handleExportEvents = () => {
    console.log("Exporting events:", events);
    // Export implementation would go here
  };

  const handleImportEvents = async () => {
    console.log("Importing events");
    // For now, just import some mock events
    const mockEvents = [
      {
        id: "mock-event-1",
        title: "Mock Event 1",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      }
    ];
    
    await onImport(mockEvents);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Import/Export Calendar</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleImportEvents}
        >
          <Upload className="h-4 w-4" /> Import Events
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExportEvents()}>
              Export as iCal (.ics)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportEvents()}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportEvents()}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CalendarImportExport;
