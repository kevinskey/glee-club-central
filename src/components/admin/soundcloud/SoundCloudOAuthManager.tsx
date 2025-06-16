
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

  // Check for connection success from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'soundcloud') {
      console.log('SoundCloud connection detected from URL');
      
      const savedToken = localStorage.getItem('soundcloud_access_token');
      const savedUser = localStorage.getItem('soundcloud_user');
      
      if (savedToken && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setAccessToken(savedToken);
          setConnectedUser(user);
          loadUserData(savedToken);
          toast.success(`Connected as ${user.display_name}!`);
          
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
        } catch (error) {
          console.error('Error processing connection:', error);
          toast.error('Connection successful but failed to load user data');
        }
      }
    }
  }, []);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    
    try {
      console.log('Starting SoundCloud OAuth flow...');
      
      const soundcloudClientId = 'UixjjV8UKe8mD5jaxrg6nLOjqpB4iYbC'; // This is a public client ID
      const redirectUri = `${window.location.origin}/functions/v1/soundcloud-callback`;
      const state = crypto.randomUUID();
      
      // Build authorization URL
      const authUrl = new URL('https://soundcloud.com/connect');
      authUrl.searchParams.set('client_id', soundcloudClientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'non-expiring');
      authUrl.searchParams.set('state', state);
      
      console.log('Authorization URL:', authUrl.toString());
      console.log('Redirect URI:', redirectUri);

      // Calculate popup position
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      // Open OAuth popup
      const popup = window.open(
        authUrl.toString(),
        'soundcloud-oauth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,location=yes,status=yes,toolbar=no,menubar=no`
      );

      if (!popup) {
        throw new Error('Failed to open popup. Please allow popups and try again.');
      }

      // Monitor popup
      let checkCount = 0;
      const maxChecks = 300; // 5 minutes at 1 second intervals
      
      const checkClosed = setInterval(() => {
        checkCount++;
        
        try {
          if (popup.closed) {
            clearInterval(checkClosed);
            console.log('Popup was closed');
            setIsConnecting(false);
            return;
          }
          
          // Check if we're back at our domain (successful redirect)
          try {
            const currentUrl = popup.location.href;
            if (currentUrl.includes('connected=soundcloud')) {
              clearInterval(checkClosed);
              popup.close();
              console.log('OAuth flow completed successfully');
              setIsConnecting(false);
              // The useEffect will handle the rest
              return;
            }
          } catch (e) {
            // Cross-origin restriction, this is expected during OAuth flow
          }
          
        } catch (error) {
          console.error('Error checking popup status:', error);
        }
        
        if (checkCount >= maxChecks) {
          clearInterval(checkClosed);
          if (!popup.closed) {
            popup.close();
          }
          setIsConnecting(false);
          toast.error('OAuth process timed out after 5 minutes');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to SoundCloud');
    }
  }, []);

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
          <p className="text-xs text-muted-foreground mt-1">
            If you see a white screen, please check if popups are blocked.
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
