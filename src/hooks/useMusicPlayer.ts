
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Track {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
  featured?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  playlist_name: string; // Add this for backward compatibility
  tracks: Track[];
}

interface PlayerSettings {
  default_volume: number;
  autoplay: boolean;
  shuffle_mode: boolean;
  repeat_mode: 'none' | 'track' | 'playlist';
  show_visualizer: boolean;
  analytics_enabled: boolean;
}

export function useMusicPlayer() {
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({
    default_volume: 0.7,
    autoplay: false,
    shuffle_mode: false,
    repeat_mode: 'none',
    show_visualizer: true,
    analytics_enabled: true,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadActivePlaylist();
    loadPlayerSettings();
  }, []);

  const loadPlayerSettings = async () => {
    if (!supabase) {
      console.warn('useMusicPlayer: Supabase not configured, using default settings');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('music_player_settings')
        .select('setting_key, setting_value');

      if (error) {
        console.error('Error loading player settings:', error);
        return;
      }

      if (data) {
        const settings = { ...playerSettings };
        data.forEach((setting) => {
          switch (setting.setting_key) {
            case 'default_volume':
              settings.default_volume = parseFloat(setting.setting_value) || 0.7;
              break;
            case 'autoplay':
              settings.autoplay = setting.setting_value === 'true';
              break;
            case 'shuffle_mode':
              settings.shuffle_mode = setting.setting_value === 'true';
              break;
            case 'repeat_mode':
              settings.repeat_mode = setting.setting_value.replace(/"/g, '') as 'none' | 'track' | 'playlist';
              break;
            case 'show_visualizer':
              settings.show_visualizer = setting.setting_value === 'true';
              break;
            case 'analytics_enabled':
              settings.analytics_enabled = setting.setting_value === 'true';
              break;
          }
        });
        setPlayerSettings(settings);
      }
    } catch (error) {
      console.error('Error in loadPlayerSettings:', error);
    }
  };

  const trackAnalytics = async (trackId: string, eventType: string, duration?: number) => {
    if (!supabase || !playerSettings.analytics_enabled) return;

    try {
      await supabase
        .from('music_analytics')
        .insert({
          audio_file_id: trackId,
          event_type: eventType,
          listen_duration: duration || 0,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  const loadActivePlaylist = async () => {
    try {
      if (!supabase) {
        console.warn('useMusicPlayer: Supabase not configured, using fallback playlist');
        const fallbackPlaylist = {
          id: 'fallback-playlist',
          name: 'Glee Club Favorites',
          playlist_name: 'Glee Club Favorites',
          tracks: [{
            id: 'fallback-track-1',
            title: 'Sample Track',
            audioUrl: '',
            albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
            artist: 'Spelman Glee Club',
            duration: '3:45',
            featured: false
          }]
        };
        setActivePlaylist(fallbackPlaylist);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('get_current_active_playlist');
      
      if (error) {
        console.error('Error loading active playlist:', error);
        setActivePlaylist(null);
      } else if (data && data.length > 0) {
        const playlistData = data[0];
        const playlist: Playlist = {
          id: playlistData.playlist_id,
          name: playlistData.playlist_name,
          playlist_name: playlistData.playlist_name,
          tracks: (playlistData.tracks || []).map((track: any) => ({
            ...track,
            featured: track.featured || false
          }))
        };
        setActivePlaylist(playlist);
        if (playlist.tracks.length > 0) {
          setCurrentTrack(playlist.tracks[0]);
        }
      } else {
        console.log('No active playlist found');
        setActivePlaylist(null);
      }
    } catch (error) {
      console.error('Error in loadActivePlaylist:', error);
      setActivePlaylist(null);
    } finally {
      setIsLoading(false);
    }
  };

  const playTrack = (track: Track) => {
    if (!track.audioUrl) {
      console.warn('No audio URL available for track:', track.title);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(track.audioUrl);
    audioRef.current.addEventListener('loadstart', () => {
      console.log('Loading audio:', track.title);
    });
    
    audioRef.current.addEventListener('canplay', () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    });

    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });

    setCurrentTrack(track);
    setIsPlaying(true);
    trackAnalytics(track.id, 'play');
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    if (currentTrack) {
      trackAnalytics(currentTrack.id, 'pause');
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    if (currentTrack) {
      trackAnalytics(currentTrack.id, 'stop');
    }
  };

  return {
    activePlaylist,
    isLoading,
    currentTrack,
    isPlaying,
    playerSettings,
    trackAnalytics,
    playTrack,
    pauseTrack,
    stopTrack,
    refetch: loadActivePlaylist
  };
}
