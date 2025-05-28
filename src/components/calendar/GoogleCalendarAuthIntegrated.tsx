import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GoogleCalendarAuthIntegratedProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function GoogleCalendarAuthIntegrated({ onConnectionChange }: GoogleCalendarAuthIntegratedProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'expired'>('checking');
  const [isLoading, setIsLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      // First check if we have a stored Google token
      const storedToken = localStorage.getItem('google_access_token');
      console.log("Stored Google token found:", !!storedToken);
      setGoogleToken(storedToken);

      if (storedToken) {
        // Test the stored token by making a direct API call
        try {
          const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            console.log("Google token is valid");
            setStatus('connected');
            onConnectionChange?.(true);
            setIsLoading(false);
            return;
          } else {
            console.log("Google token is invalid, removing from storage");
            localStorage.removeItem('google_access_token');
            setGoogleToken(null);
          }
        } catch (error) {
          console.error("Error testing Google token:", error);
          localStorage.removeItem('google_access_token');
          setGoogleToken(null);
        }
      }

      // Fallback to checking with Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error("No valid session for Google Calendar check:", sessionError);
        setStatus('disconnected');
        onConnectionChange?.(false);
        return;
      }

      console.log("Checking Google Calendar connection with valid session");
      
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', { 
        body: { action: 'check_connection' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error("Error checking connection:", error);
        setStatus('disconnected');
        onConnectionChange?.(false);
        toast.error("Failed to check Google Calendar connection");
        return;
      }

      if (data?.connected) {
        setStatus('connected');
        setExpiresAt(data.expires_at);
        onConnectionChange?.(true);
      } else {
        const errorMessage = data?.error || 'Not connected';
        if (errorMessage.includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('disconnected');
        }
        onConnectionChange?.(false);
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
      setStatus('disconnected');
      onConnectionChange?.(false);
      toast.error("Failed to check connection status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        toast.error("Please log in to connect Google Calendar");
        return;
      }

      console.log("Getting Google OAuth URL with session");

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', { 
        body: { action: 'generate_oauth_url' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error("Error getting auth URL:", error);
        toast.error("Failed to get OAuth URL: " + (error.message || 'Unknown error'));
        return;
      }

      if (data?.error) {
        console.error("API error:", data.error);
        toast.error(data.error);
        return;
      }

      if (!data?.authUrl) {
        console.error("No auth URL returned:", data);
        toast.error("Failed to get OAuth URL - no URL returned");
        return;
      }

      console.log("Successfully got auth URL, opening popup...");

      // Open OAuth popup
      const popup = window.open(
        data.authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        toast.error('Failed to open popup window. Please allow popups for this site.');
        return;
      }

      // Listen for popup messages
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          console.log("Received OAuth success message with token");
          const { access_token } = event.data;
          
          // Store the Google access token
          localStorage.setItem('google_access_token', access_token);
          setGoogleToken(access_token);
          console.log("Stored Google token in localStorage");
          
          // Close popup and check connection
          popup.close();
          window.removeEventListener('message', handleMessage);
          
          setTimeout(() => {
            checkConnectionStatus();
            toast.success("Google Calendar connected successfully!");
          }, 1000);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check for popup closure as fallback
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          console.log("Popup closed, checking connection status...");
          setTimeout(() => {
            checkConnectionStatus();
          }, 2000);
        }
      }, 500);

    } catch (error) {
      console.error("Error connecting:", error);
      toast.error("Failed to connect to Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      
      // Remove stored Google token
      localStorage.removeItem('google_access_token');
      setGoogleToken(null);
      console.log("Removed Google token from localStorage");
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        toast.error("Please log in to disconnect Google Calendar");
        return;
      }

      console.log("Disconnecting Google Calendar with session");

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', { 
        body: { action: 'disconnect' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });

      if (error || !data?.success) {
        console.error("Error disconnecting:", error);
        toast.error("Failed to disconnect Google Calendar");
        return;
      }

      toast.success("Google Calendar disconnected successfully");
      setStatus('disconnected');
      setExpiresAt(null);
      onConnectionChange?.(false);
    } catch (error) {
      console.error("Error disconnecting:", error);
      toast.error("Failed to disconnect Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const callSupabaseWithStoredToken = async () => {
    const token = googleToken || localStorage.getItem('google_access_token');
    console.log("Attempting to call Supabase with token:", !!token);
    
    if (!token) {
      toast.error("No Google access token found. Please reconnect.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Calling Supabase with stored Google token...");
      
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'list_calendars' },
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (error) {
        console.error("Supabase call failed:", error);
        
        // If token is invalid, remove it and ask user to reconnect
        if (error.message?.includes('401') || error.message?.includes('invalid')) {
          localStorage.removeItem('google_access_token');
          setGoogleToken(null);
          setStatus('disconnected');
          toast.error("Google token expired. Please reconnect.");
        } else {
          toast.error("Error calling Supabase function");
        }
        return;
      }

      console.log("Supabase response:", data);
      toast.success("Successfully called Supabase with Google token!");
      
      if (data?.calendars) {
        console.log(`Found ${data.calendars.length} calendars`);
      }
    } catch (error) {
      console.error("Error calling Supabase:", error);
      toast.error("Failed to call Supabase function");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check for stored Google token first
      const storedToken = localStorage.getItem('google_access_token');
      setGoogleToken(storedToken);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token || storedToken) {
        checkConnectionStatus();
      } else {
        setStatus('disconnected');
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'expired':
        return 'Token Expired';
      case 'disconnected':
        return 'Not Connected';
      default:
        return 'Checking...';
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'connected':
        return 'default' as const;
      case 'expired':
        return 'secondary' as const;
      case 'disconnected':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Google Calendar Integration</span>
          <Badge variant={getStatusVariant()} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {googleToken && (
          <p className="text-sm text-muted-foreground">
            Token stored: {googleToken.substring(0, 20)}...
          </p>
        )}
        
        {expiresAt && status === 'connected' && (
          <p className="text-sm text-muted-foreground">
            Token expires: {new Date(expiresAt).toLocaleDateString()}
          </p>
        )}
        
        <div className="flex gap-2 flex-wrap">
          {status === 'connected' || googleToken ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={checkConnectionStatus}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={callSupabaseWithStoredToken}
                disabled={isLoading}
              >
                Test API Call
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {status === 'expired' ? 'Reconnect Calendar' : 'Connect Google Calendar'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
