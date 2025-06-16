
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
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    console.log('SoundCloud OAuth component initialized');
    setDebugInfo('Component initialized');
    
    // Check for existing connection first
    const savedToken = localStorage.getItem('soundcloud_access_token');
    const savedUser = localStorage.getItem('soundcloud_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Found existing connection:', user.username);
        setDebugInfo(`Found existing connection: ${user.username}`);
        setAccessToken(savedToken);
        setConnectedUser(user);
        loadUserData(savedToken);
        return;
      } catch (error) {
        console.error('Invalid saved user data:', error);
        setDebugInfo(`Error parsing saved user data: ${error}`);
        localStorage.removeItem('soundcloud_access_token');
        localStorage.removeItem('soundcloud_user');
      }
    }

    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');
    
    console.log('URL params check:', { 
      code: !!code, 
      error, 
      state: !!state,
      fullUrl: window.location.href 
    });
    
    setDebugInfo(`URL check - Code: ${!!code}, Error: ${error}, State: ${!!state}`);
    
    if (error) {
      console.error('OAuth error:', error);
      setDebugInfo(`OAuth error: ${error}`);
      toast.error(`OAuth error: ${error}`);
      cleanupUrl();
      return;
    }
    
    if (code) {
      console.log('OAuth callback detected with code');
      setDebugInfo('OAuth callback detected, processing...');
      handleOAuthCallback(code);
    } else {
      setDebugInfo('No OAuth callback detected');
    }
  }, []);

  const cleanupUrl = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('error');
      url.searchParams.delete('state');
      window.history.replaceState({}, document.title, url.toString());
      console.log('URL cleaned up');
    } catch (error) {
      console.error('Error cleaning up URL:', error);
    }
  };

  const handleConnect = async () => {
    console.log('Starting SoundCloud connection...');
    setIsConnecting(true);
    setDebugInfo('Starting connection...');
    
    try {
      console.log('Calling soundcloud-oauth function with authorize action');
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'authorize' }
      });

      console.log('OAuth authorize response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        setDebugInfo(`Function error: ${error.message}`);
        throw new Error(error.message);
      }

      if (!data?.authUrl) {
        console.error('No authorization URL received:', data);
        setDebugInfo('No authorization URL received');
        throw new Error('No authorization URL received');
      }

      console.log('Redirecting to SoundCloud OAuth:', data.authUrl);
      setDebugInfo('Redirecting to SoundCloud...');
      
      // Add a small delay to ensure state is saved
      setTimeout(() => {
        window.location.href = data.authUrl;
      }, 100);
      
    } catch (error) {
      console.error('Connection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to SoundCloud';
      setDebugInfo(`Connection error: ${errorMessage}`);
      setIsConnecting(false);
      toast.error(errorMessage);
    }
  };

  const handleOAuthCallback = async (code: string) => {
    console.log('Processing OAuth callback with code...');
    setIsConnecting(true);
    setDebugInfo('Processing OAuth callback...');
    
    try {
      console.log('Calling soundcloud-oauth function with callback action');
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'callback',
          code: code
        }
      });

      console.log('OAuth callback response:', { data, error });

      if (error) {
        console.error('Callback function error:', error);
        setDebugInfo(`Callback error: ${error.message}`);
        throw new Error(error.message);
      }

      if (!data?.accessToken || !data?.user) {
        console.error('Invalid authentication response:', data);
        setDebugInfo('Invalid authentication response');
        throw new Error('Invalid authentication response');
      }

      console.log('Authentication successful:', data.user.username);
      setDebugInfo(`Authentication successful: ${data.user.username}`);

      setAccessToken(data.accessToken);
      setConnectedUser(data.user);
      
      localStorage.setItem('soundcloud_access_token', data.accessToken);
      localStorage.setItem('soundcloud_user', JSON.stringify(data.user));
      
      if (data.refreshToken) {
        localStorage.setItem('soundcloud_refresh_token', data.refreshToken);
      }

      await loadUserData(data.accessToken);
      
      toast.success(`Connected as ${data.user.display_name}!`);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setDebugInfo(`OAuth callback error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
      cleanupUrl();
    }
  };

  const loadUserData = async (token: string) => {
    console.log('Loading user data...');
    setIsLoadingData(true);
    setDebugInfo('Loading user data...');
    
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'fetch-data',
          accessToken: token
        }
      });

      if (error) {
        console.error('Data loading error:', error);
        setDebugInfo(`Data loading error: ${error.message}`);
        throw new Error(error.message);
      }

      setTracks(data.tracks || []);
      setPlaylists(data.playlists || []);
      
      console.log('Data loaded:', {
        tracks: data.tracks?.length || 0,
        playlists: data.playlists?.length || 0
      });
      
      setDebugInfo(`Data loaded: ${data.tracks?.length || 0} tracks, ${data.playlists?.length || 0} playlists`);
      
    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load SoundCloud data';
      setDebugInfo(`Data loading error: ${errorMessage}`);
      toast.error(errorMessage);
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
    setDebugInfo('Disconnected');
    toast.success('Disconnected from SoundCloud');
  };

  const handleRefresh = async () => {
    if (!accessToken) return;
    await loadUserData(accessToken);
  };

  // Show loading state during connection process
  if (isConnecting) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to SoundCloud...</p>
          {debugInfo && (
            <p className="text-xs text-muted-foreground mt-2">{debugInfo}</p>
          )}
        </div>
      </div>
    );
  }

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
      {debugInfo && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">Debug: {debugInfo}</p>
        </div>
      )}
    </div>
  );
}
