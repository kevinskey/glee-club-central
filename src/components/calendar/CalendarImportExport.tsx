
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Calendar } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface CalendarImportExportProps {
  onImport?: (events: any[]) => void;
  events?: any[];
}

const CalendarImportExport: React.FC<CalendarImportExportProps> = ({ onImport, events = [] }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { isConnected, connect, isLoading, error, fetchEvents, addEvent } = useGoogleCalendar();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Export events to a file
      const eventsJson = JSON.stringify(events, null, 2);
      const blob = new Blob([eventsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `spelman-glee-events-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${events.length} events exported to JSON file`,
      });
    } catch (error) {
      console.error('Error exporting events:', error);
      toast({
        title: "Export failed",
        description: "Could not export events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    // Implementation would handle file input and parsing
    // Then call onImport with the parsed events
    toast({
      title: "Import feature",
      description: "Import functionality would be implemented here",
    });
  };

  const handleConnectGoogleCalendar = async () => {
    if (isConnected) {
      // Already connected, show toast
      toast({
        title: "Google Calendar",
        description: "Already connected to Google Calendar",
      });
      return;
    }
    
    try {
      await connect();
      toast({
        title: "Google Calendar",
        description: "Successfully connected to Google Calendar",
      });
    } catch (err) {
      console.error('Error connecting to Google Calendar:', err);
      toast({
        title: "Google Calendar",
        description: "Failed to connect to Google Calendar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExport} 
        disabled={isExporting || events.length === 0}
        className="flex items-center gap-1"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : 'Export Events'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleImport} 
        disabled={isImporting}
        className="flex items-center gap-1"
      >
        <Upload className="w-4 h-4" />
        {isImporting ? 'Importing...' : 'Import Events'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleConnectGoogleCalendar} 
        disabled={isLoading}
        className={`flex items-center gap-1 ${isConnected ? 'bg-green-50 text-green-700 border-green-300' : ''}`}
      >
        <Calendar className="w-4 h-4" />
        {isLoading 
          ? 'Connecting...' 
          : isConnected 
            ? 'Google Calendar Connected' 
            : 'Connect Google Calendar'
        }
      </Button>
    </div>
  );
};

export default CalendarImportExport;
