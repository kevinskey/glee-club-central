
import React from 'react';
import { SoundCloudPlaylistCard } from './SoundCloudPlaylistCard';

interface SoundCloudPlaylist {
  id: string;
  name: string;
  description: string;
  track_count: number;
  duration: number;
  artwork_url?: string;
  is_public: boolean;
  created_at: string;
  tracks: any[];
}

interface SoundCloudPlaylistGridProps {
  playlists: SoundCloudPlaylist[];
  activePlaylistId?: string;
  onPlaylistSelect: (playlist: SoundCloudPlaylist) => void;
}

export function SoundCloudPlaylistGrid({ 
  playlists, 
  activePlaylistId, 
  onPlaylistSelect 
}: SoundCloudPlaylistGridProps) {
  // Filter to show only public playlists with tracks
  const publicPlaylists = playlists.filter(playlist => 
    playlist.is_public && playlist.tracks.length > 0
  );

  if (publicPlaylists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No public playlists available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {publicPlaylists.map((playlist) => (
        <SoundCloudPlaylistCard
          key={playlist.id}
          playlist={playlist}
          isActive={playlist.id === activePlaylistId}
          onPlay={() => onPlaylistSelect(playlist)}
        />
      ))}
    </div>
  );
}
