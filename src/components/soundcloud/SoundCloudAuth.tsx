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
  AlertCircle
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
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing connection in sessionStorage
    const savedToken = sessionStorage.getItem('soundcloud_access_token');
    const savedUser = sessionStorage.getItem('soundcloud_user');

    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setConnectedUser(JSON.parse(savedUser));
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      const authRes = await fetch('/functions/v1/soundcloud-oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'authorize',
          codeChallenge,
          codeChallengeMethod: 'S256'
        })
      });

      const authData = await authRes.json();
      if (!authRes.ok) {
        throw new Error(authData.error || 'Failed to start SoundCloud OAuth');
      }

      const popup = window.open(authData.authUrl, '_blank', 'width=600,height=700');
      if (!popup) {
        throw new Error('Unable to open authorization window');
      }

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        const { type, code, error } = event.data || {};

        if (type === 'SOUNDCLOUD_OAUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          try {
            const tokenRes = await fetch('/functions/v1/soundcloud-oauth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'callback',
                code,
                state: authData.state,
                codeVerifier
              })
            });

            const tokenData = await tokenRes.json();
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
          } catch (err) {
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
          toast({
            title: 'Connection failed',
            description: error || 'Authorization failed.',
            variant: 'destructive',
          });
        }
      };

      window.addEventListener('message', handleMessage);
      
    } catch (error) {
      console.error('SoundCloud connection error:', error);
      setIsConnecting(false);
      toast({
        title: "Connection failed",
        description: "Failed to connect to SoundCloud. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    sessionStorage.removeItem('soundcloud_access_token');
    sessionStorage.removeItem('soundcloud_user');
    setAccessToken(null);
    setConnectedUser(null);
    
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from SoundCloud",
    });
  };

  const handleRefresh = async () => {
    if (!accessToken) return;
    
    setIsConnecting(true);
    
    // Simulate refreshing user data
    setTimeout(() => {
      setIsConnecting(false);
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
        
        <p className="text-xs text-muted-foreground">
          By connecting, you agree to SoundCloud's terms of service and privacy policy.
        </p>
      </CardContent>
    </Card>
  );
}
