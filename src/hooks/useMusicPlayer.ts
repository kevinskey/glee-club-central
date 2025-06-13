import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MusicPlayerSettings {
  default_volume: number;
  autoplay: boolean;
  shuffle_mode: boolean;
  repeat_mode: 'none' | 'track' | 'playlist';
  show_visualizer: boolean;
  analytics_enabled: boolean;
}

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  albumArt: string;
  duration: string;
  order: number;
  featured: boolean;
}

interface ActivePlaylist {
  playlist_id: string;
  playlist_name: string;
  tracks: PlaylistTrack[];
}

export const useMusicPlayer = () => {
  const [activePlaylist, setActivePlaylist] = useState<ActivePlaylist | null>(null);
  const [playerSettings, setPlayerSettings] = useState<MusicPlayerSettings>({
    default_volume: 0.7,
    autoplay: false,
    shuffle_mode: false,
    repeat_mode: 'none',
    show_visualizer: true,
    analytics_enabled: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = useRef(crypto.randomUUID());
  const { user } = useAuth();

  // Load player settings
  const loadPlayerSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('music_player_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settings = data?.reduce((acc, setting) => {
        let value = setting.setting_value;
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch {
            // Keep as string if not JSON
          }
        }
        acc[setting.setting_key] = value;
        return acc;
      }, {} as any);

      if (settings) {
        setPlayerSettings({
          default_volume: parseFloat(settings.default_volume) || 0.7,
          autoplay: settings.autoplay === 'true',
          shuffle_mode: settings.shuffle_mode === 'true',
          repeat_mode: settings.repeat_mode || 'none',
          show_visualizer: settings.show_visualizer !== 'false',
          analytics_enabled: settings.analytics_enabled !== 'false'
        });
      }
    } catch (error) {
      console.error('Error loading player settings:', error);
    }
  };

  // Load active playlist
  const loadActivePlaylist = async () => {
    try {
      const { data, error } = await supabase.rpc('get_current_active_playlist');

      if (error) throw error;

      if (data && data.length > 0) {
        const playlist = data[0];
        setActivePlaylist({
          playlist_id: playlist.playlist_id,
          playlist_name: playlist.playlist_name,
          tracks: Array.isArray(playlist.tracks) ? playlist.tracks : []
        });
      } else {
        // Fallback to individual audio files if no playlist is active
        const { data: audioFiles } = await supabase
          .from('audio_files')
          .select('*')
          .eq('category', 'recordings')
          .limit(5);

        if (audioFiles) {
          setActivePlaylist({
            playlist_id: 'fallback',
            playlist_name: 'Featured Tracks',
            tracks: audioFiles.map((track, index) => ({
              id: track.id,
              title: track.title,
              artist: track.description || 'Spelman Glee Club',
              audioUrl: track.file_url,
              albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
              duration: '3:45',
              order: index,
              featured: false
            }))
          });
        }
      }
    } catch (error) {
      console.error('Error loading active playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Track analytics
  const trackAnalytics = async (
    audioFileId: string,
    eventType: 'play' | 'pause' | 'skip' | 'complete',
    listenDuration: number = 0
  ) => {
    if (!playerSettings.analytics_enabled) return;

    try {
      await supabase
        .from('music_analytics')
        .insert({
          user_id: user?.id || null,
          audio_file_id: audioFileId,
          event_type: eventType,
          session_id: sessionId.current,
          listen_duration: listenDuration,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    loadPlayerSettings();
    loadActivePlaylist();

    // Subscribe to playlist changes
    const playlistChannel = supabase
      .channel('playlist-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'playlists'
      }, () => {
        loadActivePlaylist();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'playlist_tracks'
      }, () => {
        loadActivePlaylist();
      })
      .subscribe();

    // Subscribe to settings changes
    const settingsChannel = supabase
      .channel('settings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'music_player_settings'
      }, () => {
        loadPlayerSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(playlistChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  return {
    activePlaylist,
    playerSettings,
    isLoading,
    trackAnalytics,
    refreshPlaylist: loadActivePlaylist,
    refreshSettings: loadPlayerSettings
  };
};
