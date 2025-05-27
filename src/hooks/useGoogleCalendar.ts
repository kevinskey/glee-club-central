
import { useState, useEffect } from 'react';
import { 
  isConnected, 
  connectToGoogleCalendar, 
  disconnect, 
  syncWithGoogleCalendar
} from '@/services/googleCalendar';

export const useGoogleCalendar = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const connected = await isConnected();
        console.log("Google Calendar connection status:", connected);
        setIsGoogleConnected(connected);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check Google Calendar connection');
        console.error('Error checking Google Calendar connection:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log("Starting Google Calendar connection...");
      
      const authUrl = await connectToGoogleCalendar();
      console.log("Got auth URL, opening popup...");
      
      // Open the OAuth URL in a new popup window
      const popup = window.open(
        authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Failed to open popup window. Please allow popups for this site.');
      }

      // Listen for the popup to close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          console.log("Popup closed, checking connection status...");
          // Check if connection was successful
          setTimeout(async () => {
            const connected = await isConnected();
            console.log("Connection status after popup closed:", connected);
            setIsGoogleConnected(connected);
            if (connected) {
              setError('');
            }
          }, 1000);
        }
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Google Calendar');
      console.error('Error connecting to Google Calendar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      const success = await disconnect();
      if (success) {
        setIsGoogleConnected(false);
        setError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Google Calendar');
      console.error('Error disconnecting from Google Calendar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCalendar = async (calendarId = 'primary') => {
    try {
      setIsSyncing(true);
      await syncWithGoogleCalendar(calendarId);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with Google Calendar');
      console.error('Error syncing with Google Calendar:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Refresh connection status
  const refreshConnectionStatus = async () => {
    try {
      const connected = await isConnected();
      setIsGoogleConnected(connected);
    } catch (err) {
      console.error('Error refreshing connection status:', err);
    }
  };

  return {
    isConnected: isGoogleConnected,
    isLoading,
    isSyncing,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
    connectToGoogleCalendar: handleConnect,
    syncCalendar: handleSyncCalendar,
    refreshConnectionStatus
  };
};

export default useGoogleCalendar;
