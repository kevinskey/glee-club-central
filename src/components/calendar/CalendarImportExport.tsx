
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { exportCalendarToIcal, importCalendarFromIcal } from "@/services/googleCalendar";
import { CalendarEvent } from "@/types/calendar";

interface CalendarImportExportProps {
  events: CalendarEvent[];
  onImport: (events: any[]) => Promise<void>;
}

export function CalendarImportExport({ events, onImport }: CalendarImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const handleExportClick = () => {
    if (events.length === 0) {
      toast.warning("There are no events to export");
      return;
    }
    
    exportCalendarToIcal(events);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      const importedEvents = await importCalendarFromIcal(file);
      await onImport(importedEvents);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import calendar");
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium">Calendar Import/Export</h3>
      
      <p className="text-sm text-muted-foreground">
        Export your calendar to iCal format or import events from an iCal file.
      </p>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleExportClick} 
          variant="outline" 
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Export (.ics)
        </Button>
        
        <Button 
          onClick={handleImportClick} 
          variant="outline" 
          size="sm"
          disabled={isImporting}
        >
          <Upload className={`mr-2 h-4 w-4 ${isImporting ? 'animate-spin' : ''}`} />
          {isImporting ? 'Importing...' : 'Import (.ics)'}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".ics"
          className="hidden"
        />
      </div>
    </div>
  );
}
