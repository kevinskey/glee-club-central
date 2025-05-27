
import { useState, useEffect } from 'react';
import { 
  isConnected, 
  connectToGoogleCalendar, 
  disconnect, 
  syncWithGoogleCalendar
} from '@/services/googleCalendar';
import { useAuth } from '@/contexts/AuthContext';

export const useGoogleCalendar = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        
        // Only check connection if user is authenticated
        if (!isAuthenticated || !user) {
          console.log("User not authenticated, skipping connection check");
          setIsGoogleConnected(false);
          return;
        }
        
        const connected = await isConnected();
        console.log("Google Calendar connection status:", connected);
        setIsGoogleConnected(connected);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Error checking Google Calendar connection:', err);
        setError(err instanceof Error ? err.message : 'Failed to check Google Calendar connection');
        setIsGoogleConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [isAuthenticated, user]);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Verify user is authenticated
      if (!isAuthenticated || !user) {
        setError('You must be logged in to connect Google Calendar');
        return;
      }
      
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
            try {
              const connected = await isConnected();
              console.log("Connection status after popup closed:", connected);
              setIsGoogleConnected(connected);
              if (connected) {
                setError('');
              } else {
                setError('Connection was not completed. Please try again.');
              }
            } catch (err) {
              console.error("Error checking connection after popup closed:", err);
              setError('Failed to verify connection status');
            }
          }, 1000);
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error connecting to Google Calendar:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const success = await disconnect();
      if (success) {
        setIsGoogleConnected(false);
        setError('');
      } else {
        setError('Failed to disconnect from Google Calendar');
      }
    } catch (err) {
      console.error('Error disconnecting from Google Calendar:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCalendar = async (calendarId = 'primary') => {
    try {
      setIsSyncing(true);
      setError('');
      
      await syncWithGoogleCalendar(calendarId);
      setError('');
    } catch (err) {
      console.error('Error syncing with Google Calendar:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync with Google Calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  // Refresh connection status
  const refreshConnectionStatus = async () => {
    try {
      if (!isAuthenticated || !user) {
        setIsGoogleConnected(false);
        return;
      }
      
      const connected = await isConnected();
      setIsGoogleConnected(connected);
      setError('');
    } catch (err) {
      console.error('Error refreshing connection status:', err);
      setError('Failed to refresh connection status');
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
