
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  checkGoogleCalendarAuth, 
  connectGoogleCalendar, 
  fetchGoogleCalendarEvents,
  addGoogleCalendarEvent
} from '@/services/googleCalendar';

export const useGoogleCalendar = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const connected = await checkGoogleCalendarAuth(user.id);
        setIsConnected(connected);
      } catch (err) {
        console.error('Error checking Google Calendar connection:', err);
        setError('Failed to check Google Calendar connection status');
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [user]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const result = await connectGoogleCalendar();
      if (result) {
        setIsConnected(true);
        setError(null);
      } else {
        throw new Error('Failed to connect to Google Calendar');
      }
    } catch (err: any) {
      console.error('Error connecting to Google Calendar:', err);
      setError(err.message || 'Failed to connect to Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async (startDate: Date, endDate: Date) => {
    if (!user) return [];
    
    setIsLoading(true);
    try {
      const events = await fetchGoogleCalendarEvents(user.id, startDate, endDate);
      return events;
    } catch (err) {
      console.error('Error fetching Google Calendar events:', err);
      setError('Failed to fetch events from Google Calendar');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: any) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    setIsLoading(true);
    try {
      const result = await addGoogleCalendarEvent(user.id, eventData);
      return result;
    } catch (err) {
      console.error('Error adding event to Google Calendar:', err);
      setError('Failed to add event to Google Calendar');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    connect: handleConnect,
    fetchEvents,
    addEvent
  };
};
