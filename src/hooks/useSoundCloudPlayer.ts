
import { useState, useEffect } from 'react';

interface SoundCloudTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  albumArt: string;
  duration: number;
  waveformData: number[];
  likes: number;
  plays: number;
  isLiked: boolean;
  genre: string;
  uploadDate: string;
  description: string;
  permalink_url: string;
}

interface SoundCloudPlaylist {
  id: string;
  name: string;
  description: string;
  track_count: number;
  duration: number;
  artwork_url: string;
  permalink_url: string;
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

  const fetchSoundCloudData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching SoundCloud data...');
      
      // Call the edge function without any body since it doesn't expect parameters
      const response = await fetch('/functions/v1/soundcloud-api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('SoundCloud data received:', data);
      
      if (data.playlists && Array.isArray(data.playlists)) {
        console.log('SoundCloud playlists loaded:', data.playlists.length);
        setPlaylists(data.playlists);
        
        // Set first playlist as active if available
        if (data.playlists.length > 0) {
          setActivePlaylist(data.playlists[0]);
        }
      }
      
      if (data.tracks && Array.isArray(data.tracks)) {
        console.log('SoundCloud tracks loaded:', data.tracks.length);
        setTracks(data.tracks);
      }
      
    } catch (err) {
      console.error('Error fetching SoundCloud data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load SoundCloud content');
      
      // Clear any existing data on error
      setPlaylists([]);
      setTracks([]);
      setActivePlaylist(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistSelect = (playlist: SoundCloudPlaylist) => {
    setActivePlaylist(playlist);
  };

  const refetchPlaylists = async () => {
    await fetchSoundCloudData();
  };

  const refetchTracks = async () => {
    await fetchSoundCloudData();
  };

  useEffect(() => {
    fetchSoundCloudData();
  }, []);

  return {
    playlists,
    tracks,
    activePlaylist,
    isLoading,
    error,
    setActivePlaylist: handlePlaylistSelect,
    refetchPlaylists,
    refetchTracks
  };
};
