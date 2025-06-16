
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
    
    // Check for existing connection first
    const savedToken = localStorage.getItem('soundcloud_access_token');
    const savedUser = localStorage.getItem('soundcloud_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Found existing connection:', user.username);
        setAccessToken(savedToken);
        setConnectedUser(user);
        loadUserData(savedToken);
        return;
      } catch (error) {
        console.error('Invalid saved user data:', error);
        localStorage.removeItem('soundcloud_access_token');
        localStorage.removeItem('soundcloud_user');
      }
    }

    // Set up message listener for popup callback
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message event:', event);
      
      // Only accept messages from our own origin for security
      if (event.origin !== window.location.origin) {
        console.log('Message from different origin, ignoring:', event.origin);
        return;
      }
      
      if (event.data.type === 'SOUNDCLOUD_OAUTH_SUCCESS' && event.data.code) {
        console.log('OAuth success message received with code');
        handleOAuthCallback(event.data.code);
      } else if (event.data.type === 'SOUNDCLOUD_OAUTH_ERROR') {
        console.error('OAuth error message received:', event.data.error);
        toast.error(`OAuth error: ${event.data.error}`);
        setIsConnecting(false);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleConnect = async () => {
    console.log('Starting SoundCloud connection...');
    setIsConnecting(true);
    
    try {
      console.log('Calling soundcloud-oauth function with authorize action');
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: { action: 'authorize' }
      });

      console.log('OAuth authorize response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data?.authUrl) {
        console.error('No authorization URL received:', data);
        throw new Error('No authorization URL received');
      }

      console.log('Opening SoundCloud OAuth popup with URL:', data.authUrl);
      
      // Calculate popup position (center of screen)
      const width = 600;
      const height = 700;
      const left = (screen.width / 2) - (width / 2);
      const top = (screen.height / 2) - (height / 2);
      
      // Open OAuth in a popup window with better positioning
      const popup = window.open(
        data.authUrl,
        'soundcloud-oauth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes,location=yes`
      );

      if (!popup) {
        throw new Error('Failed to open popup window. Please allow popups for this site and try again.');
      }

      console.log('Popup opened successfully');

      // Monitor popup for closure and focus
      let pollTimer: NodeJS.Timeout;
      const checkClosed = () => {
        if (popup.closed) {
          console.log('Popup was closed by user');
          clearInterval(pollTimer);
          setIsConnecting(false);
          return;
        }
        
        // Check if popup has been redirected to our callback
        try {
          if (popup.location && popup.location.pathname === '/soundcloud-callback.html') {
            console.log('Popup redirected to callback page');
          }
        } catch (e) {
          // Cross-origin error is expected when popup navigates to SoundCloud
          console.log('Popup navigated (cross-origin access blocked, this is normal)');
        }
      };

      // Check popup status every second
      pollTimer = setInterval(checkClosed, 1000);
      
      // Set a timeout to close the popup if no response after 5 minutes
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
          clearInterval(pollTimer);
          setIsConnecting(false);
          toast.error('OAuth process timed out. Please try again.');
        }
      }, 300000); // 5 minutes
      
    } catch (error) {
      console.error('Connection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to SoundCloud';
      setIsConnecting(false);
      toast.error(errorMessage);
    }
  };

  const handleOAuthCallback = async (code: string) => {
    console.log('Processing OAuth callback with code...');
    setIsConnecting(true);
    
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
        throw new Error(error.message);
      }

      if (!data?.accessToken || !data?.user) {
        console.error('Invalid authentication response:', data);
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
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      toast.error(errorMessage);
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
        console.error('Data loading error:', error);
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to load SoundCloud data';
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
          <p className="text-xs text-muted-foreground mt-2">
            Complete the authorization in the popup window.
          </p>
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
    </div>
  );
}
