
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, RefreshCw, ExternalLink, Play, Users } from 'lucide-react';
import { useSoundCloudPlayer } from '@/hooks/useSoundCloudPlayer';
import { toast } from 'sonner';

export function SoundCloudPlaylistManager() {
  const { playlists, tracks, isLoading, error, refetchPlaylists, refetchTracks } = useSoundCloudPlayer();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchPlaylists(), refetchTracks()]);
      toast.success('SoundCloud data refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh SoundCloud data');
    } finally {
      setRefreshing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Loading SoundCloud content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Music className="w-5 h-5" />
            SoundCloud Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">SoundCloud Integration</h3>
          <p className="text-sm text-muted-foreground">
            Manage playlists and tracks from https://soundcloud.com/doctorkj
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Playlists</span>
            </div>
            <p className="text-2xl font-bold">{playlists.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Tracks</span>
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
            <p className="text-2xl font-bold">
              {formatNumber(tracks.reduce((sum, track) => sum + track.plays, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Playlists */}
      <Card>
        <CardHeader>
          <CardTitle>SoundCloud Playlists</CardTitle>
        </CardHeader>
        <CardContent>
          {playlists.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No playlists found from SoundCloud account.
            </p>
          ) : (
            <div className="space-y-4">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{playlist.name}</h4>
                      {playlist.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={playlist.is_public ? "default" : "secondary"}>
                        {playlist.is_public ? "Public" : "Private"}
                      </Badge>
                      {playlist.permalink_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={playlist.permalink_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{playlist.track_count} tracks</span>
                    <span>{formatDuration(Math.floor(playlist.duration / 1000))}</span>
                    <span>Created: {new Date(playlist.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Preview tracks:</p>
                    <div className="space-y-1">
                      {playlist.tracks.slice(0, 3).map((track) => (
                        <div key={track.id} className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          <span className="font-medium">{track.title}</span>
                          <span className="text-muted-foreground ml-2">
                            {formatNumber(track.plays)} plays
                          </span>
                        </div>
                      ))}
                      {playlist.tracks.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{playlist.tracks.length - 3} more tracks
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
