
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
    console.log('SoundCloud OAuth component initialized');
    
    // Check for existing connection
    const savedToken = localStorage.getItem('soundcloud_access_token');
    const savedUser = localStorage.getItem('soundcloud_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Found existing connection:', user.username);
        setAccessToken(savedToken);
        setConnectedUser(user);
        loadUserData(savedToken);
      } catch (error) {
        console.error('Invalid saved user data:', error);
        localStorage.removeItem('soundcloud_access_token');
        localStorage.removeItem('soundcloud_user');
      }
      return;
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('OAuth callback detected');
      handleOAuthCallback(code);
    }
  }, []);

  const handleConnect = async () => {
    console.log('Starting SoundCloud connection...');
    setIsConnecting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'authorize' }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.authUrl) {
        throw new Error('No authorization URL received');
      }

      console.log('Redirecting to SoundCloud OAuth...');
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to SoundCloud');
    }
  };

  const handleOAuthCallback = async (code: string) => {
    console.log('Processing OAuth callback...');
    setIsConnecting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'callback',
          code: code
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.accessToken || !data?.user) {
        throw new Error('Invalid authentication response');
      }

      console.log('Authentication successful:', data.user.username);

      setAccessToken(data.accessToken);
      setConnectedUser(data.user);
      
      localStorage.setItem('soundcloud_access_token', data.accessToken);
      localStorage.setItem('soundcloud_user', JSON.stringify(data.user));
      
      if (data.refreshToken) {
        localStorage.setItem('soundcloud_refresh_token', data.refreshToken);
      }

      await loadUserData(data.accessToken);
      
      toast.success(`Connected as ${data.user.display_name}!`);
      
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('callback');
      window.history.replaceState({}, document.title, url.toString());
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const loadUserData = async (token: string) => {
    console.log('Loading user data...');
    setIsLoadingData(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'fetch-data',
          accessToken: token
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setTracks(data.tracks || []);
      setPlaylists(data.playlists || []);
      
      console.log('Data loaded:', {
        tracks: data.tracks?.length || 0,
        playlists: data.playlists?.length || 0
      });
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load SoundCloud data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnecting SoundCloud...');
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

  // Show connected state
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

  // Show connection button
  return (
    <div className="max-w-md mx-auto">
      <SoundCloudConnectionButton 
        isConnecting={isConnecting}
        onConnect={handleConnect}
      />
    </div>
  );
}
