
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
  Play,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

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

interface SoundCloudTrack {
  id: string;
  title: string;
  artist: string;
  permalink_url: string;
  artwork_url: string;
  duration: number;
  likes: number;
  plays: number;
  genre: string;
  uploadDate: string;
  description: string;
  embeddable_by: string;
  stream_url: string;
}

interface SoundCloudPlaylist {
  id: string;
  name: string;
  description: string;
  track_count: number;
  duration: number;
  artwork_url: string;
  permalink_url: string;
  is_public: boolean;
  created_at: string;
  tracks: any[];
}

export function SoundCloudOAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedUser, setConnectedUser] = useState<SoundCloudUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<SoundCloudTrack[]>([]);
  const [playlists, setPlaylists] = useState<SoundCloudPlaylist[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    // Check for existing connection
    const savedToken = localStorage.getItem('soundcloud_access_token');
    const savedUser = localStorage.getItem('soundcloud_user');
    
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setConnectedUser(JSON.parse(savedUser));
      loadUserData(savedToken);
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const callback = urlParams.get('callback');
    
    if (code && callback === 'soundcloud') {
      handleOAuthCallback(code);
      // Clean up URL
      window.history.replaceState({}, document.title, '/admin/music');
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      console.log('Initiating SoundCloud connection...');
      
      const response = await fetch(`/functions/v1/soundcloud-oauth?action=authorize`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Request failed:', errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Authorization response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Store state for security verification
      localStorage.setItem('soundcloud_oauth_state', data.state);
      
      console.log('Redirecting to SoundCloud OAuth...');
      // Redirect to SoundCloud OAuth
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error('SoundCloud connection error:', error);
      setIsConnecting(false);
      
      if (error instanceof Error) {
        toast.error(`Connection failed: ${error.message}`);
      } else {
        toast.error('Failed to connect to SoundCloud. Please check your network connection and try again.');
      }
    }
  };

  const handleOAuthCallback = async (code: string) => {
    setIsConnecting(true);
    
    try {
      const redirectUri = `${window.location.origin}/admin/music?callback=soundcloud`;
      
      const response = await fetch(`/functions/v1/soundcloud-oauth?action=exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirectUri
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Store tokens and user data
      setAccessToken(data.accessToken);
      setConnectedUser(data.user);
      
      localStorage.setItem('soundcloud_access_token', data.accessToken);
      localStorage.setItem('soundcloud_user', JSON.stringify(data.user));
      
      if (data.refreshToken) {
        localStorage.setItem('soundcloud_refresh_token', data.refreshToken);
      }

      // Load user's tracks and playlists
      await loadUserData(data.accessToken);

      toast.success(`Successfully connected as ${data.user.display_name}!`);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      if (error instanceof Error) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error('Failed to complete SoundCloud authentication.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const loadUserData = async (token: string) => {
    setIsLoadingData(true);
    
    try {
      const response = await fetch(`/functions/v1/soundcloud-oauth?action=fetch-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: token
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Data fetch failed: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTracks(data.tracks || []);
      setPlaylists(data.playlists || []);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      if (error instanceof Error) {
        toast.error(`Failed to load data: ${error.message}`);
      } else {
        toast.error('Failed to load SoundCloud data.');
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('soundcloud_access_token');
    localStorage.removeItem('soundcloud_user');
    localStorage.removeItem('soundcloud_refresh_token');
    localStorage.removeItem('soundcloud_oauth_state');
    setAccessToken(null);
    setConnectedUser(null);
    setTracks([]);
    setPlaylists([]);
    
    toast.success('Disconnected from SoundCloud');
  };

  const handleRefresh = async () => {
    if (!accessToken) return;
    await loadUserData(accessToken);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (connectedUser) {
    return (
      <div className="space-y-6">
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
              <Button onClick={handleRefresh} disabled={isLoadingData} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button onClick={handleDisconnect} variant="outline">
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Loaded Playlists</span>
              </div>
              <p className="text-2xl font-bold">{playlists.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Loaded Tracks</span>
              </div>
              <p className="text-2xl font-bold">{tracks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Total Plays</span>
              </div>
              <p className="text-2xl font-bold">
                {formatNumber(tracks.reduce((sum, track) => sum + track.plays, 0))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tracks with oEmbed widgets */}
        {tracks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tracks.slice(0, 5).map((track) => (
                  <div key={track.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{track.title}</h4>
                        <p className="text-sm text-muted-foreground">by {track.artist}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{formatNumber(track.plays)} plays</span>
                          <span>{formatNumber(track.likes)} likes</span>
                          {track.genre && <Badge variant="outline" className="text-xs">{track.genre}</Badge>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={track.permalink_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                    
                    {/* SoundCloud oEmbed widget */}
                    <div className="mt-4">
                      <iframe
                        width="100%"
                        height="166"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(track.permalink_url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playlists */}
        {playlists.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{playlist.name}</h4>
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {playlist.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={playlist.is_public ? "default" : "secondary"}>
                          {playlist.is_public ? "Public" : "Private"}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <a href={playlist.permalink_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{playlist.track_count} tracks</span>
                      <span>{formatDuration(Math.floor(playlist.duration / 1000))}</span>
                      <span>Created: {new Date(playlist.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {/* SoundCloud playlist oEmbed widget */}
                    <div className="mt-4">
                      <iframe
                        width="100%"
                        height="300"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist.permalink_url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                      ></iframe>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Connect Your SoundCloud Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Connect your SoundCloud account to access your tracks, playlists, and manage your music content.
        </p>
        
        <div className="space-y-2">
          <h4 className="font-medium">What you'll get:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Access to all your SoundCloud tracks and playlists</li>
            <li>• Embedded SoundCloud players for seamless playback</li>
            <li>• Real-time sync with your SoundCloud account</li>
            <li>• Admin controls for managing your music content</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="w-full bg-orange-500 hover:bg-orange-600"
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
          By connecting, you'll be redirected to SoundCloud to authorize this application.
        </p>
      </CardContent>
    </Card>
  );
}
