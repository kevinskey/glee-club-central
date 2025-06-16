
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, RefreshCw, ExternalLink, Play, Users, AlertCircle, Key } from 'lucide-react';
import { useSoundCloudPlayer } from '@/hooks/useSoundCloudPlayer';
import { toast } from 'sonner';

export function SoundCloudPlaylistManager() {
  const { playlists, tracks, isLoading, error, refetchPlaylists, refetchTracks } = useSoundCloudPlayer();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchPlaylists(), refetchTracks()]);
      toast.success('SoundCloud data refreshed');
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
            <p className="text-muted-foreground">Connecting to SoundCloud...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state with no data
  if (error || (playlists.length === 0 && tracks.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">SoundCloud Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect to SoundCloud account: https://soundcloud.com/doctorkj
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>

        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <div className="space-y-2">
              <p className="font-medium">No SoundCloud data available</p>
              {error?.includes('Client ID') ? (
                <p>SoundCloud Client ID may be missing or invalid. Please check your API credentials.</p>
              ) : error?.includes('OAuth') || error?.includes('authentication') ? (
                <div>
                  <p>SoundCloud now requires OAuth authentication for API access.</p>
                  <p className="text-sm mt-1">To display real data, you would need to:</p>
                  <ul className="text-sm list-disc list-inside mt-1 space-y-1">
                    <li>Implement OAuth 2.0 flow for user consent</li>
                    <li>Use SoundCloud's Connect API</li>
                    <li>Or embed SoundCloud widgets for public content</li>
                  </ul>
                </div>
              ) : (
                <p>Unable to fetch data from SoundCloud API. This may be due to API limitations or network issues.</p>
              )}
            </div>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              SoundCloud API Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">API Connection</h4>
                  <p className="text-sm text-muted-foreground">Status of SoundCloud API connectivity</p>
                </div>
                <Badge variant="destructive">Disconnected</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Issue:</strong> {error || 'No data available from SoundCloud API'}</p>
                
                <div className="mt-4">
                  <p className="font-medium mb-2">Recommended Solutions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Verify SoundCloud Client ID in admin settings</li>
                    <li>Consider implementing OAuth 2.0 for authenticated access</li>
                    <li>Use SoundCloud embed widgets as an alternative</li>
                    <li>Contact SoundCloud support for API access requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">SoundCloud Integration</h3>
          <p className="text-sm text-muted-foreground">
            Live data from https://soundcloud.com/doctorkj
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

      {/* Success indicator for real data */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
        <Music className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          Successfully connected to SoundCloud! Showing {tracks.length} tracks and {playlists.length} playlists from live data.
        </AlertDescription>
      </Alert>

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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracks */}
      {tracks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tracks.slice(0, 10).map((track) => (
                <div key={track.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gradient-to-br from-blue-400 to-blue-500">
                    <img 
                      src={track.albumArt} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{formatNumber(track.plays)} plays</span>
                      <span>{formatNumber(track.likes)} likes</span>
                      {track.genre && <Badge variant="outline" className="text-xs">{track.genre}</Badge>}
                    </div>
                  </div>
                  {track.permalink_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={track.permalink_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
