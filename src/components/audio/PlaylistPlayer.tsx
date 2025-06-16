
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaPlayer } from './MediaPlayer';
import { 
  List, 
  Shuffle, 
  Repeat,
  Music
} from 'lucide-react';

interface PlaylistTrack {
  id: string;
  title: string;
  artist?: string;
  audioUrl: string;
  duration?: number;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  albumArt?: string;
  tracks: PlaylistTrack[];
}

interface PlaylistPlayerProps {
  playlist: Playlist;
  className?: string;
}

export function PlaylistPlayer({ playlist, className = "" }: PlaylistPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'track' | 'playlist'>('none');
  const [showTrackList, setShowTrackList] = useState(false);

  const currentTrack = playlist.tracks[currentTrackIndex];

  const handleTrackEnd = () => {
    if (repeatMode === 'track') {
      // Replay current track - the MediaPlayer will handle this
      return;
    }
    
    let nextIndex = currentTrackIndex + 1;
    
    if (nextIndex >= playlist.tracks.length) {
      if (repeatMode === 'playlist') {
        nextIndex = 0;
      } else {
        return; // End of playlist
      }
    }
    
    setCurrentTrackIndex(nextIndex);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setShowTrackList(false);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    // TODO: Implement shuffle logic
  };

  const cycleRepeatMode = () => {
    const modes: Array<'none' | 'track' | 'playlist'> = ['none', 'track', 'playlist'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  if (!currentTrack) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No tracks in playlist</p>
        </CardContent>
      </Card>
    );
  }

  // Convert playlist track to MediaPlayer track format
  const mediaTrack = {
    ...currentTrack,
    albumArt: playlist.albumArt,
    artist: currentTrack.artist || 'Spelman College Glee Club'
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Playlist Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {playlist.name}
                <Badge variant="secondary">{playlist.tracks.length} tracks</Badge>
              </CardTitle>
              {playlist.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {playlist.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShuffle}
                className={isShuffled ? "text-orange-500" : ""}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleRepeatMode}
                className={repeatMode !== 'none' ? "text-orange-500" : ""}
              >
                <Repeat className="h-4 w-4" />
                {repeatMode === 'track' && <span className="text-xs ml-1">1</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTrackList(!showTrackList)}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Track Player */}
      <MediaPlayer 
        track={mediaTrack} 
        onTrackEnd={handleTrackEnd}
      />

      {/* Track List */}
      {showTrackList && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Track List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleTrackSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {track.artist || 'Spelman College Glee Club'}
                        </p>
                      </div>
                    </div>
                    {index === currentTrackIndex && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
