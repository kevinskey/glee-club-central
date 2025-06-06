
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreVertical, 
  Search,
  Music,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverArt?: string;
  likes: number;
  plays: number;
  isLiked?: boolean;
  genre?: string;
}

interface PlaylistSidebarProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackSelect?: (index: number) => void;
}

export function PlaylistSidebar({ tracks, currentTrackIndex, onTrackSelect }: PlaylistSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'duration' | 'plays'>('title');

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'duration':
        return a.duration - b.duration;
      case 'plays':
        return b.plays - a.plays;
      default:
        return 0;
    }
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    const total = tracks.reduce((sum, track) => sum + track.duration, 0);
    const hours = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card className="h-fit max-h-[80vh] overflow-hidden flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Playlist
          </CardTitle>
          <Badge variant="secondary">{tracks.length} tracks</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{getTotalDuration()}</span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Sort Options */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'title', label: 'Title' },
            { key: 'artist', label: 'Artist' },
            { key: 'duration', label: 'Duration' },
            { key: 'plays', label: 'Plays' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={sortBy === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(key as any)}
              className="whitespace-nowrap"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-1 p-0">
        {sortedTracks.map((track, index) => {
          const originalIndex = tracks.findIndex(t => t.id === track.id);
          const isCurrentTrack = originalIndex === currentTrackIndex;
          
          return (
            <div
              key={track.id}
              className={cn(
                "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-l-4 transition-colors",
                isCurrentTrack 
                  ? "bg-orange-50 border-l-orange-500 dark:bg-orange-950/20" 
                  : "border-l-transparent"
              )}
              onClick={() => onTrackSelect?.(originalIndex)}
            >
              {/* Track Number/Play Button */}
              <div className="w-8 h-8 flex items-center justify-center">
                {isCurrentTrack ? (
                  <div className="w-4 h-4 bg-orange-500 rounded-sm animate-pulse" />
                ) : (
                  <span className="text-sm text-muted-foreground">{index + 1}</span>
                )}
              </div>
              
              {/* Cover Art */}
              <div className="w-10 h-10 rounded overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0">
                <img 
                  src={track.coverArt || "/placeholder.svg"} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "font-medium truncate text-sm",
                  isCurrentTrack && "text-orange-600"
                )}>
                  {track.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground truncate">
                    {track.artist}
                  </span>
                  {track.genre && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {track.genre}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>{track.plays.toLocaleString()} plays</span>
                  <span>{formatDuration(track.duration)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "w-6 h-6 p-0",
                    track.isLiked && "text-red-500"
                  )}
                >
                  <Heart className={cn(
                    "w-3 h-3",
                    track.isLiked && "fill-current"
                  )} />
                </Button>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
        
        {sortedTracks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No tracks found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
