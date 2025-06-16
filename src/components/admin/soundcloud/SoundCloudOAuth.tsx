
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
    console.log('SoundCloudOAuth component mounted');
    
    // Check for existing connection first
    const savedToken = localStorage.getItem('soundcloud_access_token');
    const savedUser = localStorage.getItem('soundcloud_user');
    
    if (savedToken && savedUser) {
      console.log('Found existing SoundCloud connection');
      try {
        setAccessToken(savedToken);
        setConnectedUser(JSON.parse(savedUser));
        loadUserData(savedToken);
        return;
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('soundcloud_access_token');
        localStorage.removeItem('soundcloud_user');
      }
    }

    // Check for OAuth callback in current URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const callback = urlParams.get('callback');
    
    if (code && callback === 'soundcloud') {
      console.log('OAuth callback detected in URL, processing...');
      handleOAuthCallback(code);
      return;
    }

    // Listen for popup authentication completion
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message from popup:', event.data, 'from origin:', event.origin);
      
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'SOUNDCLOUD_OAUTH_SUCCESS' && event.data.code) {
          console.log('Popup authentication successful, processing callback...');
          handleOAuthCallback(event.data.code);
        } else if (event.data.type === 'SOUNDCLOUD_OAUTH_ERROR') {
          console.error('Popup authentication failed:', event.data.error);
          setIsConnecting(false);
          toast.error(`Authentication failed: ${event.data.error}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      console.log('Cleaning up message listener');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const cleanupUrl = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('error');
      url.searchParams.delete('state');
      url.searchParams.delete('callback');
      window.history.replaceState({}, document.title, url.toString());
    } catch (error) {
      console.error('Error cleaning up URL:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      console.log('Initiating SoundCloud OAuth connection...');
      
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'authorize' }
      });

      if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Failed to get authorization URL');
      }

      if (!data?.authUrl) {
        throw new Error('No authorization URL received');
      }

      console.log('Opening SoundCloud OAuth in same window...');
      
      // Instead of popup, redirect in same window for better compatibility
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error('SoundCloud connection error:', error);
      setIsConnecting(false);
      
      if (error instanceof Error) {
        toast.error(`Connection failed: ${error.message}`);
      } else {
        toast.error('Failed to connect to SoundCloud');
      }
    }
  };

  const handleOAuthCallback = async (code: string) => {
    console.log('Processing SoundCloud OAuth callback with code:', code.substring(0, 10) + '...');
    setIsConnecting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'callback',
          code: code
        }
      });

      if (error || data?.error) {
        console.error('Token exchange error:', error || data?.error);
        throw new Error(error?.message || data?.error || 'Token exchange failed');
      }

      if (!data?.accessToken || !data?.user) {
        console.error('Invalid authentication response:', data);
        throw new Error('Invalid authentication response');
      }

      console.log('Authentication successful for user:', data.user.username);

      // Store tokens and user data
      setAccessToken(data.accessToken);
      setConnectedUser(data.user);
      
      localStorage.setItem('soundcloud_access_token', data.accessToken);
      localStorage.setItem('soundcloud_user', JSON.stringify(data.user));
      
      if (data.refreshToken) {
        localStorage.setItem('soundcloud_refresh_token', data.refreshToken);
      }

      // Load user data
      await loadUserData(data.accessToken);

      toast.success(`Successfully connected as ${data.user.display_name}!`);
      
      // Clean up URL
      cleanupUrl();
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      if (error instanceof Error) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error('Failed to complete authentication');
      }
      
      cleanupUrl();
    } finally {
      setIsConnecting(false);
    }
  };

  const loadUserData = async (token: string) => {
    setIsLoadingData(true);
    
    try {
      console.log('Loading SoundCloud user data...');
      
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'fetch-data',
          accessToken: token
        }
      });

      if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Data fetch failed');
      }

      setTracks(data.tracks || []);
      setPlaylists(data.playlists || []);
      
      console.log('User data loaded successfully:', {
        tracks: data.tracks?.length || 0,
        playlists: data.playlists?.length || 0
      });
      
    } catch (error) {
      console.error('Error loading user data:', error);
      if (error instanceof Error) {
        toast.error(`Failed to load data: ${error.message}`);
      } else {
        toast.error('Failed to load SoundCloud data');
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('soundcloud_access_token');
    localStorage.removeItem('soundcloud_user');
    localStorage.removeItem('soundcloud_refresh_token');
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

  // Show loading state during OAuth processing
  if (isConnecting && !connectedUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to SoundCloud...</p>
          <p className="text-sm text-muted-foreground mt-2">
            You will be redirected to SoundCloud to authorize the connection.
          </p>
        </div>
      </div>
    );
  }

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
