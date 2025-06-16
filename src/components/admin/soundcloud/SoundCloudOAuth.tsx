
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
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('soundcloud_access_token');
        localStorage.removeItem('soundcloud_user');
      }
      return;
    }

    // Check for URL parameters (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    console.log('URL params:', { code: !!code, error });
    
    // Handle error cases
    if (error) {
      console.error('OAuth error from URL:', error);
      toast.error(`SoundCloud authentication failed: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, '/admin/music');
      return;
    }
    
    // Handle OAuth callback with code
    if (code) {
      console.log('Processing OAuth callback with code');
      handleOAuthCallback(code);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      console.log('Initiating SoundCloud connection...');
      
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'authorize' }
      });

      console.log('OAuth response:', { data, error });

      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to invoke OAuth function');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.authUrl) {
        throw new Error('No authorization URL received');
      }

      console.log('Redirecting to SoundCloud OAuth...');
      // Use window.open for better compatibility instead of direct navigation
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
      console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...');
      
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'callback',
          code: code
        }
      });

      console.log('Callback response:', { data, error });

      if (error) {
        console.error('Callback error:', error);
        throw new Error(error.message || 'Callback failed');
      }

      if (data?.error) {
        console.error('Callback data error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.accessToken || !data?.user) {
        console.error('Invalid callback response:', data);
        throw new Error('Invalid response from authentication callback');
      }

      // Store tokens and user data
      setAccessToken(data.accessToken);
      setConnectedUser(data.user);
      
      localStorage.setItem('soundcloud_access_token', data.accessToken);
      localStorage.setItem('soundcloud_user', JSON.stringify(data.user));
      
      if (data.refreshToken) {
        localStorage.setItem('soundcloud_refresh_token', data.refreshToken);
      }

      console.log('SoundCloud connection successful:', data.user.display_name);

      // Load user's tracks and playlists
      await loadUserData(data.accessToken);

      toast.success(`Successfully connected as ${data.user.display_name}!`);
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/admin/music');
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      if (error instanceof Error) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error('Failed to complete SoundCloud authentication.');
      }
      
      // Clean up URL on error
      window.history.replaceState({}, document.title, '/admin/music');
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

      console.log('User data response:', { data, error });

      if (error) {
        throw new Error(error.message || 'Data fetch failed');
      }

      if (data?.error) {
        throw new Error(data.error);
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

  // Show loading state during OAuth processing
  if (isConnecting && !connectedUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to SoundCloud...</p>
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
