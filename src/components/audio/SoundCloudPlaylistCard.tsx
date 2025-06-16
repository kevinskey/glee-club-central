import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Music, Clock, Users } from 'lucide-react';

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

interface SoundCloudPlaylistCardProps {
  playlist: SoundCloudPlaylist;
  onPlay: () => void;
  isActive?: boolean;
}

export function SoundCloudPlaylistCard({ playlist, onPlay, isActive = false }: SoundCloudPlaylistCardProps) {
  const formatDuration = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
      <CardContent className="p-0">
        {/* Playlist Cover */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
          {playlist.artwork_url ? (
            <img 
              src={playlist.artwork_url} 
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-12 h-12 text-white/80" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              onClick={onPlay}
              size="lg"
              className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 shadow-lg"
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={playlist.is_public ? "default" : "secondary"} className="text-xs">
              {playlist.is_public ? "Public" : "Private"}
            </Badge>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
              {playlist.name}
            </h3>
            {playlist.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {playlist.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              <span>{playlist.track_count} tracks</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(playlist.duration)}</span>
            </div>
          </div>

          {/* Created Date */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Created {formatDate(playlist.created_at)}
          </div>

          {/* Track Preview */}
          {playlist.tracks.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Top tracks:</p>
              <div className="space-y-1">
                {playlist.tracks.slice(0, 3).map((track, index) => (
                  <div key={track.id} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 w-3">{index + 1}</span>
                    <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                      {track.title}
                    </span>
                    <span className="text-gray-500">
                      {Math.floor(track.plays / 1000)}k plays
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
