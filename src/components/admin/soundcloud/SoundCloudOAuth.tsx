
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SoundCloudConnectionButton } from './SoundCloudConnectionButton';
import { SoundCloudUserProfile } from './SoundCloudUserProfile';
import { SoundCloudStats } from './SoundCloudStats';
import { SoundCloudTracks } from './SoundCloudTracks';
import { SoundCloudPlaylists } from './SoundCloudPlaylists';
import { SoundCloudUser, SoundCloudTrack, SoundCloudPlaylist } from './types';

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
      
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'authorize' }
      });

      console.log('Response:', data);

      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to invoke OAuth function');
      }

      if (data?.error) {
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
      
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'exchange',
          code,
          redirectUri
        }
      });

      if (error) {
        throw new Error(error.message || 'Token exchange failed');
      }

      if (data?.error) {
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
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'fetch-data',
          accessToken: token
        }
      });

      if (error) {
        throw new Error(error.message || 'Data fetch failed');
      }

      if (data?.error) {
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

  if (connectedUser) {
    return (
      <div className="space-y-6">
        <SoundCloudUserProfile 
          user={connectedUser}
          isLoadingData={isLoadingData}
          onRefresh={handleRefresh}
          onDisconnect={handleDisconnect}
        />

        <SoundCloudStats tracks={tracks} playlists={playlists} />

        <SoundCloudTracks tracks={tracks} />

        <SoundCloudPlaylists playlists={playlists} />
      </div>
    );
  }

  return (
    <SoundCloudConnectionButton 
      isConnecting={isConnecting}
      onConnect={handleConnect}
    />
  );
}
