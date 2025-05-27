
// Re-export all functionality from the services file for backward compatibility
export {
  isConnected,
  connect,
  connectToGoogleCalendar, 
  disconnect, 
  syncCalendar,
  syncWithGoogleCalendar,
  fetchGoogleCalendarToken,
  fetchGoogleCalendarEvents,
  handleGoogleCalendarCallback
} from "@/services/googleCalendar";
