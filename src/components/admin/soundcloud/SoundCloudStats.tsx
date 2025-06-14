
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Play, Users } from 'lucide-react';
import { SoundCloudTrack, SoundCloudPlaylist } from './types';

interface SoundCloudStatsProps {
  tracks: SoundCloudTrack[];
  playlists: SoundCloudPlaylist[];
}

export function SoundCloudStats({ tracks, playlists }: SoundCloudStatsProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const totalPlays = tracks.reduce((sum, track) => sum + track.plays, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Loaded Playlists</span>
          </div>
          <p className="text-2xl font-bold">{playlists.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Loaded Tracks</span>
          </div>
          <p className="text-2xl font-bold">{tracks.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Total Plays</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(totalPlays)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
