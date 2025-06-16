
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SoundCloudConnectionButton } from './SoundCloudConnectionButton';
import { SoundCloudUserProfile } from './SoundCloudUserProfile';
import { SoundCloudStats } from './SoundCloudStats';
import { SoundCloudTracks } from './SoundCloudTracks';
import { SoundCloudPlaylists } from './SoundCloudPlaylists';
import { SoundCloudUser, SoundCloudTrack, SoundCloudPlaylist } from './types';

export function SoundCloudOAuthManager() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedUser, setConnectedUser] = useState<SoundCloudUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<SoundCloudTrack[]>([]);
  const [playlists, setPlaylists] = useState<SoundCloudPlaylist[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('soundcloud_access_token');
    const savedUser = localStorage.getItem('soundcloud_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAccessToken(savedToken);
        setConnectedUser(user);
        loadUserData(savedToken);
      } catch (error) {
        console.error('Invalid saved user data:', error);
        localStorage.removeItem('soundcloud_access_token');
        localStorage.removeItem('soundcloud_user');
      }
    }
  }, []);

  // Set up message listener for OAuth callback
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'SOUNDCLOUD_OAUTH_SUCCESS' && event.data.code) {
        handleOAuthCallback(event.data.code);
      } else if (event.data.type === 'SOUNDCLOUD_OAUTH_ERROR') {
        toast.error(`OAuth error: ${event.data.error}`);
        setIsConnecting(false);
        if (authWindow) {
          authWindow.close();
          setAuthWindow(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [authWindow]);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'authorize' }
      });

      if (error) throw new Error(error.message);
      if (!data?.authUrl) throw new Error('No authorization URL received');

      // Close any existing auth window
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }

      // Calculate popup position
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      // Open OAuth popup
      const popup = window.open(
        data.authUrl,
        'soundcloud-oauth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        throw new Error('Failed to open popup. Please allow popups and try again.');
      }

      setAuthWindow(popup);

      // Monitor popup closure
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          setAuthWindow(null);
        }
      }, 1000);

      // Auto-close after 5 minutes
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
          clearInterval(checkClosed);
          setIsConnecting(false);
          setAuthWindow(null);
          toast.error('OAuth process timed out');
        }
      }, 300000);
      
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to SoundCloud');
    }
  }, [authWindow]);

  const handleOAuthCallback = useCallback(async (code: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'callback', code }
      });

      if (error) throw new Error(error.message);
      if (!data?.accessToken || !data?.user) throw new Error('Invalid authentication response');

      setAccessToken(data.accessToken);
      setConnectedUser(data.user);
      
      localStorage.setItem('soundcloud_access_token', data.accessToken);
      localStorage.setItem('soundcloud_user', JSON.stringify(data.user));
      
      if (data.refreshToken) {
        localStorage.setItem('soundcloud_refresh_token', data.refreshToken);
      }

      await loadUserData(data.accessToken);
      
      toast.success(`Connected as ${data.user.display_name}!`);
      
      if (authWindow) {
        authWindow.close();
        setAuthWindow(null);
      }
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsConnecting(false);
    }
  }, [authWindow]);

  const loadUserData = useCallback(async (token: string) => {
    setIsLoadingData(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'fetch-data', accessToken: token }
      });

      if (error) throw new Error(error.message);

      setTracks(data.tracks || []);
      setPlaylists(data.playlists || []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load SoundCloud data');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    localStorage.removeItem('soundcloud_access_token');
    localStorage.removeItem('soundcloud_user');
    localStorage.removeItem('soundcloud_refresh_token');
    setAccessToken(null);
    setConnectedUser(null);
    setTracks([]);
    setPlaylists([]);
    toast.success('Disconnected from SoundCloud');
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!accessToken) return;
    await loadUserData(accessToken);
  }, [accessToken, loadUserData]);

  if (isConnecting) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to SoundCloud...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Complete the authorization in the popup window.
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
    <div className="max-w-md mx-auto">
      <SoundCloudConnectionButton 
        isConnecting={isConnecting}
        onConnect={handleConnect}
      />
    </div>
  );
}
