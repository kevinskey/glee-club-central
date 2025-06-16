
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
    const connected = urlParams.get('connected');
    const accessTokenParam = urlParams.get('access_token');
    const userParam = urlParams.get('user');
    const error = urlParams.get('error');
    const errorDetails = urlParams.get('details');
    
    if (error) {
      console.error('SoundCloud OAuth error:', error, errorDetails);
      toast.error(`SoundCloud connection failed: ${error}${errorDetails ? ` - ${errorDetails}` : ''}`);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    
    if (connected === 'soundcloud' && accessTokenParam && userParam) {
      console.log('SoundCloud connection detected from URL');
      
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store in localStorage
        localStorage.setItem('soundcloud_access_token', accessTokenParam);
        localStorage.setItem('soundcloud_user', JSON.stringify(user));
        
        setAccessToken(accessTokenParam);
        setConnectedUser(user);
        loadUserData(accessTokenParam);
        toast.success(`Connected as ${user.display_name}!`);
        
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        console.error('Error processing connection:', error);
        toast.error('Connection successful but failed to parse user data');
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    
    try {
      console.log('Starting SoundCloud OAuth flow...');
      
      const soundcloudClientId = 'UixjjV8UKe8mD5jaxrg6nLOjqpB4iYbC'; // This is a public client ID
      const redirectUri = `${window.location.origin}/functions/v1/api-soundcloud-callback`;
      
      // Build authorization URL
      const authUrl = new URL('https://soundcloud.com/connect');
      authUrl.searchParams.set('client_id', soundcloudClientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'non-expiring');
      
      console.log('Authorization URL:', authUrl.toString());
      console.log('Redirect URI:', redirectUri);

      // Redirect to SoundCloud OAuth
      window.location.href = authUrl.toString();
      
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
            You will be redirected to SoundCloud to authorize access.
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
