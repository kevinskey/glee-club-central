
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Upload, Eye, Edit, Trash2 } from 'lucide-react';

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

interface TrackListProps {
  tracks: SoundCloudTrack[];
  onDeleteTrack: (trackId: string) => void;
  onToggleVisibility: (trackId: string) => void;
  onEditTrack: (track: SoundCloudTrack) => void;
}

export function TrackList({ tracks, onDeleteTrack, onToggleVisibility, onEditTrack }: TrackListProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tracks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-semibold mb-2">No tracks found</h3>
              <p className="mb-4">Upload your first track to get started</p>
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Track
              </Button>
            </div>
          ) : (
            tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="w-16 h-16 rounded overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
                  <img 
                    src={track.albumArt} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline">{track.genre}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {track.plays.toLocaleString()} plays
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(track.duration)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    Public
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleVisibility(track.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTrack(track)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTrack(track.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
