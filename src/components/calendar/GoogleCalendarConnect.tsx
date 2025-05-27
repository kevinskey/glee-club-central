
import React, { useState } from "react";
import { CalendarSelector } from "./CalendarSelector";
import { GoogleUpcomingEvents } from "./GoogleUpcomingEvents";
import { GoogleCalendarStatus } from "./GoogleCalendarStatus";
import { useAuth } from "@/contexts/AuthContext";

export function GoogleCalendarConnect() {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState('primary');
  
  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-4 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium">Google Calendar</h3>
          
          <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mt-4">
            <span className="text-sm">Please log in to connect Google Calendar</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <GoogleCalendarStatus 
        onConnectionChange={setIsConnected}
      />
      
      {/* Calendar Selector - only show when connected */}
      {isConnected && (
        <CalendarSelector
          selectedCalendarId={selectedCalendarId}
          onCalendarSelect={setSelectedCalendarId}
          isConnected={isConnected}
        />
      )}
      
      {/* Show upcoming Google Calendar events when connected */}
      <GoogleUpcomingEvents 
        isConnected={isConnected} 
        selectedCalendarId={selectedCalendarId}
      />
    </div>
  );
}
