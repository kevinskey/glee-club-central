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
  const [hasProcessedCallback, setHasProcessedCallback] = useState(false);

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

    // Check for OAuth callback - handle both search params and hash
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const code = urlParams.get('code') || hashParams.get('code');
    const error = urlParams.get('error') || hashParams.get('error');
    const callback = urlParams.get('callback') || hashParams.get('callback');
    
    console.log('OAuth callback check:', { 
      hasCode: !!code,
      error,
      callback,
      search: window.location.search,
      hash: window.location.hash
    });
    
    // Handle error cases
    if (error) {
      console.error('OAuth error from URL:', error);
      toast.error(`SoundCloud authentication failed: ${error}`);
      cleanupUrl();
      return;
    }
    
    // Handle OAuth callback - only if we have code and callback=soundcloud
    if (code && (callback === 'soundcloud' || window.location.pathname.includes('/admin/music'))) {
      console.log('Authorization code detected, processing OAuth callback...');
      if (!hasProcessedCallback) {
        setHasProcessedCallback(true);
        handleOAuthCallback(code);
      }
    }
  }, [hasProcessedCallback]);

  const cleanupUrl = () => {
    try {
      // Create a clean URL without OAuth parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('error');
      url.searchParams.delete('state');
      url.searchParams.delete('callback');
      url.hash = '';
      
      // Use replaceState to avoid triggering navigation
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

      console.log('OAuth authorize response:', { data, error });

      if (error) {
        throw new Error(error.message || 'Failed to invoke OAuth function');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.authUrl) {
        throw new Error('No authorization URL received');
      }

      console.log('Opening SoundCloud OAuth in new tab...');
      
      // Store state for verification
      if (data.state) {
        localStorage.setItem('soundcloud_oauth_state', data.state);
      }
      
      // Open in new tab instead of redirect to avoid CSP issues
      const popup = window.open(
        data.authUrl, 
        'soundcloud-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );
      
      if (!popup) {
        // Fallback: try direct redirect if popup is blocked
        console.log('Popup blocked, trying direct redirect...');
        window.location.href = data.authUrl;
        return;
      }
      
      // Monitor the popup for completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          
          // Check if we got a successful connection after popup closed
          setTimeout(() => {
            const savedToken = localStorage.getItem('soundcloud_access_token');
            if (!savedToken) {
              toast.error('SoundCloud authentication was cancelled or failed');
            }
          }, 1000);
        }
      }, 1000);
      
      // Also listen for messages from the popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'SOUNDCLOUD_OAUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          handleOAuthSuccess(event.data.code);
        } else if (event.data.type === 'SOUNDCLOUD_OAUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          setIsConnecting(false);
          toast.error(`Authentication failed: ${event.data.error}`);
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Cleanup after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        if (!popup.closed) {
          popup.close();
          setIsConnecting(false);
          toast.error('Authentication timed out');
        }
      }, 300000);
      
    } catch (error) {
      console.error('SoundCloud connection error:', error);
      setIsConnecting(false);
      
      if (error instanceof Error) {
        if (error.message.includes('refused to connect')) {
          toast.error('SoundCloud blocked the connection. Please disable ad blockers or try a different browser.');
        } else {
          toast.error(`Connection failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to connect to SoundCloud');
      }
    }
  };

  const handleOAuthSuccess = async (code: string) => {
    await handleOAuthCallback(code);
  };

  const handleOAuthCallback = async (code: string) => {
    setIsConnecting(true);
    
    try {
      console.log('Processing SoundCloud OAuth callback...');
      
      const { data, error } = await supabase.functions.invoke('soundcloud-oauth', {
        body: {
          action: 'callback',
          code: code
        }
      });

      console.log('Token exchange response:', { 
        hasData: !!data, 
        hasError: !!error,
        error 
      });

      if (error) {
        throw new Error(error.message || 'Token exchange failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.accessToken || !data?.user) {
        throw new Error('Invalid response from authentication');
      }

      console.log('Token exchange successful!');

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
      
      // Clean up URL
      cleanupUrl();
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      if (error instanceof Error) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error('Failed to complete SoundCloud authentication');
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
    localStorage.removeItem('soundcloud_oauth_state');
    setAccessToken(null);
    setConnectedUser(null);
    setTracks([]);
    setPlaylists([]);
    setHasProcessedCallback(false);
    
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
          <p className="text-muted-foreground">
            {isConnecting ? 'Connecting to SoundCloud...' : 'Processing authentication...'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            If a popup opened, please complete the authorization there.
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
