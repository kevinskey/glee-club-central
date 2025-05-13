
import { useState, useEffect } from 'react';
import { 
  isConnected, 
  connect, 
  connectToGoogleCalendar, 
  disconnect, 
  syncCalendar
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
      await connect();
      setIsGoogleConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Google Calendar');
      console.error('Error connecting to Google Calendar:', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsGoogleConnected(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Google Calendar');
      console.error('Error disconnecting from Google Calendar:', err);
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setIsSyncing(true);
      await syncCalendar();
      // Success would be handled here, possibly with a toast notification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with Google Calendar');
      console.error('Error syncing with Google Calendar:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isConnected: isGoogleConnected,
    isLoading,
    isSyncing,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
    connectToGoogleCalendar: handleConnect,  // Alias for backward compatibility
    syncCalendar: handleSyncCalendar
  };
};

export default useGoogleCalendar;
