
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SoundCloudTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  albumArt: string;
  duration: number;
  waveformData?: number[];
  likes: number;
  plays: number;
  isLiked: boolean;
  genre: string;
  uploadDate: string;
  description: string;
  permalink_url?: string;
}

interface SoundCloudPlaylist {
  id: string;
  name: string;
  description: string;
  track_count: number;
  duration: number;
  artwork_url?: string;
  permalink_url?: string;
  is_public: boolean;
  created_at: string;
  tracks: SoundCloudTrack[];
}

export const useSoundCloudPlayer = () => {
  const [playlists, setPlaylists] = useState<SoundCloudPlaylist[]>([]);
  const [tracks, setTracks] = useState<SoundCloudTrack[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<SoundCloudPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSoundCloudPlaylists = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('soundcloud-api', {
        body: { action: 'get_user_playlists' }
      });

      if (error) throw error;

      console.log('SoundCloud playlists fetched:', data.playlists);
      setPlaylists(data.playlists || []);
      
      // Set the first public playlist as active by default
      const publicPlaylists = data.playlists?.filter((p: SoundCloudPlaylist) => p.is_public && p.tracks.length > 0);
      if (publicPlaylists && publicPlaylists.length > 0) {
        setActivePlaylist(publicPlaylists[0]);
      }
    } catch (err) {
      console.error('Error fetching SoundCloud playlists:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch playlists');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSoundCloudTracks = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('soundcloud-api', {
        body: { action: 'get_user_tracks' }
      });

      if (error) throw error;

      console.log('SoundCloud tracks fetched:', data.tracks);
      setTracks(data.tracks || []);
    } catch (err) {
      console.error('Error fetching SoundCloud tracks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks');
    }
  };

  useEffect(() => {
    fetchSoundCloudPlaylists();
    fetchSoundCloudTracks();
  }, []);

  return {
    playlists,
    tracks,
    activePlaylist,
    isLoading,
    error,
    setActivePlaylist,
    refetchPlaylists: fetchSoundCloudPlaylists,
    refetchTracks: fetchSoundCloudTracks
  };
};
