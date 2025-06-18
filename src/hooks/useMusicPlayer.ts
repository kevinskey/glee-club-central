
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Track {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

export function useMusicPlayer() {
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadActivePlaylist();
  }, []);

  const loadActivePlaylist = async () => {
    try {
      if (!supabase) {
        console.warn('useMusicPlayer: Supabase not configured, using fallback playlist');
        setActivePlaylist({
          id: 'fallback-playlist',
          name: 'Glee Club Favorites',
          tracks: [{
            id: 'fallback-track-1',
            title: 'Sample Track',
            audioUrl: '',
            albumArt: '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
            artist: 'Spelman Glee Club',
            duration: '3:45'
          }]
        });
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
          tracks: playlistData.tracks || []
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
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return {
    activePlaylist,
    isLoading,
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    stopTrack,
    refetch: loadActivePlaylist
  };
}
