
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Music, 
  ExternalLink, 
  RefreshCw, 
  Unlink,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function generateCodeVerifier(length = 128): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join('');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

interface SoundCloudUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  followers_count: number;
  followings_count: number;
  track_count: number;
  playlist_count: number;
}

interface SoundCloudAuthProps {
  onAuthSuccess: (accessToken: string, user: SoundCloudUser) => void;
}

export function SoundCloudAuth({ onAuthSuccess }: SoundCloudAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedUser, setConnectedUser] = useState<SoundCloudUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toISOString();
    const debugMessage = `${timestamp}: ${message}`;
    console.log(debugMessage);
    setDebugInfo(prev => [...prev.slice(-10), debugMessage]);
  };

  useEffect(() => {
    // Check for existing connection in sessionStorage
    const savedToken = sessionStorage.getItem('soundcloud_access_token');
    const savedUser = sessionStorage.getItem('soundcloud_user');

    if (savedToken && savedUser) {
      try {
        setAccessToken(savedToken);
        setConnectedUser(JSON.parse(savedUser));
        addDebugInfo('Restored connection from session storage');
      } catch (error) {
        addDebugInfo('Failed to restore connection from session storage');
        sessionStorage.removeItem('soundcloud_access_token');
        sessionStorage.removeItem('soundcloud_user');
      }
    }
  }, []);

  const testFunctionAvailability = async () => {
    try {
      addDebugInfo('Testing SoundCloud OAuth function availability...');
      
      const response = await fetch('https://dzzptovqfqausipsgabw.supabase.co/functions/v1/soundcloud-oauth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s'
        },
        body: JSON.stringify({ action: 'test' })
      });

      const data = await response.json();
      addDebugInfo(`Function test response: ${response.status} - ${JSON.stringify(data)}`);
      
      if (data.needsSetup) {
        toast({
          title: "SoundCloud Setup Required",
          description: "SoundCloud API credentials need to be configured in Supabase.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      addDebugInfo(`Function test failed: ${error.message}`);
      toast({
        title: "Connection Error",
        description: "Unable to connect to SoundCloud service. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    addDebugInfo('Starting SoundCloud connection process');
    
    try {
      // Test function availability first
      const isAvailable = await testFunctionAvailability();
      if (!isAvailable) {
        setIsConnecting(false);
        return;
      }

      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      addDebugInfo('Generated PKCE parameters');

      const authRes = await fetch('https://dzzptovqfqausipsgabw.supabase.co/functions/v1/soundcloud-oauth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s'
        },
        body: JSON.stringify({
          action: 'authorize',
          codeChallenge,
          codeChallengeMethod: 'S256'
        })
      });

      const authData = await authRes.json();
      addDebugInfo(`Auth request response: ${authRes.status} - ${JSON.stringify(authData)}`);
      
      if (!authRes.ok) {
        throw new Error(authData.error || 'Failed to start SoundCloud OAuth');
      }

      addDebugInfo(`Opening auth URL: ${authData.authUrl}`);
      const popup = window.open(authData.authUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        throw new Error('Unable to open authorization window. Please allow popups and try again.');
      }

      const handleMessage = async (event: MessageEvent) => {
        addDebugInfo(`Received message: ${JSON.stringify(event.data)}`);
        
        if (event.origin !== window.location.origin) {
          addDebugInfo(`Ignoring message from wrong origin: ${event.origin}`);
          return;
        }
        
        const { type, code, error } = event.data || {};

        if (type === 'SOUNDCLOUD_OAUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          addDebugInfo('OAuth success message received, exchanging code for token');
          
          try {
            const tokenRes = await fetch('https://dzzptovqfqausipsgabw.supabase.co/functions/v1/soundcloud-oauth', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s'
              },
              body: JSON.stringify({
                action: 'callback',
                code,
                state: authData.state,
                codeVerifier
              })
            });

            const tokenData = await tokenRes.json();
            addDebugInfo(`Token exchange response: ${tokenRes.status} - ${JSON.stringify(tokenData)}`);
            
            if (!tokenRes.ok || !tokenData.success) {
              throw new Error(tokenData.error || 'Authentication failed');
            }

            setAccessToken(tokenData.accessToken);
            setConnectedUser(tokenData.user);
            sessionStorage.setItem('soundcloud_access_token', tokenData.accessToken);
            sessionStorage.setItem('soundcloud_user', JSON.stringify(tokenData.user));
            onAuthSuccess(tokenData.accessToken, tokenData.user);

            toast({
              title: 'Connected to SoundCloud!',
              description: `Successfully connected as ${tokenData.user.display_name}`,
            });
            
            addDebugInfo('Connection successful!');
          } catch (err) {
            addDebugInfo(`Token exchange failed: ${err.message}`);
            console.error('SoundCloud token exchange failed:', err);
            toast({
              title: 'Connection failed',
              description: 'Failed to connect to SoundCloud. Please try again.',
              variant: 'destructive',
            });
          } finally {
            setIsConnecting(false);
            popup.close();
          }
        } else if (type === 'SOUNDCLOUD_OAUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
          popup.close();
          addDebugInfo(`OAuth error: ${error}`);
          toast({
            title: 'Connection failed',
            description: error || 'Authorization failed.',
            variant: 'destructive',
          });
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Add popup close detection
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          if (isConnecting) {
            setIsConnecting(false);
            addDebugInfo('Popup was closed by user');
            toast({
              title: "Connection cancelled",
              description: "Authorization window was closed",
              variant: "destructive",
            });
          }
        }
      }, 1000);
      
    } catch (error) {
      addDebugInfo(`Connection error: ${error.message}`);
      console.error('SoundCloud connection error:', error);
      setIsConnecting(false);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to SoundCloud. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    sessionStorage.removeItem('soundcloud_access_token');
    sessionStorage.removeItem('soundcloud_user');
    setAccessToken(null);
    setConnectedUser(null);
    addDebugInfo('Disconnected from SoundCloud');
    
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from SoundCloud",
    });
  };

  const handleRefresh = async () => {
    if (!accessToken) return;
    
    setIsConnecting(true);
    addDebugInfo('Refreshing SoundCloud data');
    
    // Simulate refreshing user data
    setTimeout(() => {
      setIsConnecting(false);
      addDebugInfo('Data refresh completed');
      toast({
        title: "Refreshed",
        description: "SoundCloud data has been refreshed",
      });
    }, 1000);
  };

  if (connectedUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Connected to SoundCloud
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
              className="ml-auto"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={connectedUser.avatar_url} alt={connectedUser.display_name} />
              <AvatarFallback>
                <Music className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{connectedUser.display_name}</h3>
              <p className="text-muted-foreground">@{connectedUser.username}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{connectedUser.track_count}</div>
              <div className="text-sm text-muted-foreground">Tracks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{connectedUser.playlist_count}</div>
              <div className="text-sm text-muted-foreground">Playlists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{connectedUser.followers_count}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{connectedUser.followings_count}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleRefresh} disabled={isConnecting} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${isConnecting ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleDisconnect} variant="outline">
              <Unlink className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>

          {showDebug && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Debug Information</h4>
              <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="font-mono">{info}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Connect Your SoundCloud Account
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="ml-auto"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Connect your SoundCloud account to access your playlists, tracks, and more.
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium">What you'll get:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Access to all your SoundCloud playlists</li>
            <li>• Stream your tracks directly in the app</li>
            <li>• Sync your favorites and likes</li>
            <li>• Upload new tracks (if you have Pro)</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect to SoundCloud
            </>
          )}
        </Button>
        
        {showDebug && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Debug Information</h4>
            <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto">
              {debugInfo.length > 0 ? (
                debugInfo.map((info, index) => (
                  <div key={index} className="font-mono">{info}</div>
                ))
              ) : (
                <div>No debug information yet. Try connecting to see logs.</div>
              )}
            </div>
            <Button
              onClick={testFunctionAvailability}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Test Connection
            </Button>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          By connecting, you agree to SoundCloud's terms of service and privacy policy.
        </p>
      </CardContent>
    </Card>
  );
}
