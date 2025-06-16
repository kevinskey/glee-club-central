
import { useState, useEffect, useRef } from 'react';
import { SoundCloudTrack, SoundCloudPlaylist } from '@/components/admin/soundcloud/types';

interface LegacySoundCloudTrack {
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

interface LegacySoundCloudPlaylist {
  id: string;
  name: string;
  description: string;
  track_count: number;
  duration: number;
  artwork_url: string;
  permalink_url: string;
  is_public: boolean;
  created_at: string;
  tracks: LegacySoundCloudTrack[];
}

export const useSoundCloudPlayer = () => {
  const [playlists, setPlaylists] = useState<SoundCloudPlaylist[]>([]);
  const [tracks, setTracks] = useState<LegacySoundCloudTrack[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<SoundCloudPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchSoundCloudData = async () => {
    // Prevent multiple simultaneous requests
    if (fetchedRef.current) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      fetchedRef.current = true;
      
      console.log('Fetching SoundCloud data from API...');
      
      const response = await fetch(`https://dzzptovqfqausipsgabw.supabase.co/functions/v1/soundcloud-api`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 500));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('SoundCloud data received:', data);
      
      if (data.error || data.status === 'error') {
        throw new Error(data.message || 'Failed to load SoundCloud content');
      }
      
      if (data.playlists && Array.isArray(data.playlists)) {
        console.log('SoundCloud playlists loaded:', data.playlists.length);
        setPlaylists(data.playlists);
        
        if (data.playlists.length > 0) {
          setActivePlaylist(data.playlists[0]);
        }
      }
      
      if (data.tracks && Array.isArray(data.tracks)) {
        console.log('SoundCloud tracks loaded:', data.tracks.length);
        // Convert API tracks to legacy format for compatibility
        const legacyTracks: LegacySoundCloudTrack[] = data.tracks.map((track: SoundCloudTrack) => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          audioUrl: track.stream_url || '',
          albumArt: track.artwork_url,
          duration: track.duration,
          waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1),
          likes: track.likes,
          plays: track.plays,
          isLiked: false,
          genre: track.genre,
          uploadDate: track.uploadDate,
          description: track.description,
          permalink_url: track.permalink_url
        }));
        setTracks(legacyTracks);
      }

      // Show success message based on data status
      if (data.status === 'demo_mode') {
        console.warn('Running in demo mode with sample data');
      } else if (data.status === 'success') {
        console.log('Successfully loaded real SoundCloud data');
      }
      
    } catch (err) {
      console.error('Error fetching SoundCloud data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load SoundCloud content');
      setPlaylists([]);
      setTracks([]);
      setActivePlaylist(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistSelect = (playlist: SoundCloudPlaylist) => {
    console.log('Selecting playlist:', playlist.name);
    setActivePlaylist(playlist);
  };

  const refetchPlaylists = async () => {
    console.log('Refetching SoundCloud playlists...');
    fetchedRef.current = false;
    await fetchSoundCloudData();
  };

  const refetchTracks = async () => {
    console.log('Refetching SoundCloud tracks...');
    fetchedRef.current = false;
    await fetchSoundCloudData();
  };

  useEffect(() => {
    fetchSoundCloudData();
  }, []); // Empty dependency array to prevent multiple calls

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
