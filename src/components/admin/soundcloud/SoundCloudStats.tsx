
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Play, BarChart3, Eye } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverArt?: string;
  likes: number;
  plays: number;
  genre?: string;
  uploadDate: string;
  description?: string;
  isPublic: boolean;
}

interface SoundCloudStatsProps {
  tracks: Track[];
}

export function SoundCloudStats({ tracks }: SoundCloudStatsProps) {
  const getTotalStats = () => {
    const totalTracks = tracks.length;
    const totalPlays = tracks.reduce((sum, track) => sum + track.plays, 0);
    const totalLikes = tracks.reduce((sum, track) => sum + track.likes, 0);
    const publicTracks = tracks.filter(track => track.isPublic).length;
    
    return { totalTracks, totalPlays, totalLikes, publicTracks };
  };

  const stats = getTotalStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalTracks}</p>
              <p className="text-sm text-muted-foreground">Total Tracks</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Play className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalPlays.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Plays</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.publicTracks}</p>
              <p className="text-sm text-muted-foreground">Public Tracks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
