
import { useState, useCallback, useEffect } from 'react';
import { 
  checkGoogleCalendarConnection, 
  getGoogleCalendarAuthUrl, 
  disconnectGoogleCalendar,
  syncWithGoogleCalendar
} from '@/services/googleCalendar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from './usePermissions';

export const useGoogleCalendar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  const { isSuperAdmin } = usePermissions();

  // Check if connected when the hook loads
  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user]);

  // Function to check connection status
  const checkConnection = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const connected = await checkGoogleCalendarConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error("Error checking Google Calendar connection:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Function to connect to Google Calendar
  const connectToGoogleCalendar = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to connect Google Calendar");
      return;
    }

    if (!isSuperAdmin) {
      toast.error("Only administrators can connect Google Calendar");
      return;
    }

    try {
      setIsLoading(true);
      const authUrl = await getGoogleCalendarAuthUrl();
      
      if (authUrl) {
        // Open the auth URL in a new window
        const authWindow = window.open(authUrl, "_blank", "width=800,height=600");
        
        // Check periodically if the window is closed
        const checkWindowClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkWindowClosed);
            checkConnection();
          }
        }, 1000);
      } else {
        toast.error("Failed to get Google Calendar authorization URL");
      }
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
      toast.error("Failed to connect to Google Calendar");
    } finally {
      setIsLoading(false);
    }
  }, [user, isSuperAdmin, checkConnection]);

  // Function to disconnect from Google Calendar
  const disconnect = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to disconnect Google Calendar");
      return;
    }

    if (!isSuperAdmin) {
      toast.error("Only administrators can disconnect Google Calendar");
      return;
    }

    try {
      setIsLoading(true);
      const success = await disconnectGoogleCalendar();
      
      if (success) {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error disconnecting Google Calendar:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isSuperAdmin]);

  // Function to sync with Google Calendar
  const syncCalendar = useCallback(async () => {
    if (!user) {
      toast.error("You must be logged in to sync with Google Calendar");
      return false;
    }

    if (!isSuperAdmin) {
      toast.error("Only administrators can sync with Google Calendar");
      return false;
    }

    if (!isConnected) {
      toast.error("Please connect Google Calendar first");
      return false;
    }

    try {
      setIsSyncing(true);
      const success = await syncWithGoogleCalendar();
      return success;
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error);
      toast.error("Failed to sync with Google Calendar");
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user, isSuperAdmin, isConnected]);

  return {
    isConnected,
    isLoading,
    isSyncing,
    checkConnection,
    connectToGoogleCalendar,
    disconnect,
    syncCalendar
  };
};
