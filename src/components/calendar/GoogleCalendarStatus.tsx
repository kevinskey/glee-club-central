
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GoogleCalendarStatusProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function GoogleCalendarStatus({ onConnectionChange }: GoogleCalendarStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'expired'>('checking');
  const [isLoading, setIsLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("No valid session");
        setStatus('disconnected');
        onConnectionChange?.(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'check_connection' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error("Error checking connection:", error);
        setStatus('disconnected');
        onConnectionChange?.(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast.error("Please log in to connect Google Calendar");
        return;
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'get_auth_url' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (error || !data?.authUrl) {
        toast.error("Failed to get OAuth URL");
        return;
      }

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

      // Check for popup closure
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setTimeout(() => {
            checkConnectionStatus();
          }, 1000);
        }
      }, 1000);

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
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast.error("Please log in to disconnect Google Calendar");
        return;
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'disconnect' },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (error || !data?.success) {
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

  useEffect(() => {
    checkConnectionStatus();
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
          <span>Google Calendar Status</span>
          <Badge variant={getStatusVariant()} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {expiresAt && status === 'connected' && (
          <p className="text-sm text-muted-foreground">
            Token expires: {new Date(expiresAt).toLocaleDateString()}
          </p>
        )}
        
        <div className="flex gap-2">
          {status === 'connected' ? (
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
              {status === 'expired' ? 'Reconnect Calendar' : 'Connect Calendar'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
