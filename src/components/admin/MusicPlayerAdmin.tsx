
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Settings, BarChart3, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { EnhancedCustomAudioPlayer } from '@/components/audio/EnhancedCustomAudioPlayer';
import { AudioFileSelector } from '@/components/audio/AudioFileSelector';
import { useAudioFiles, AudioFileData } from '@/hooks/useAudioFiles';

export function MusicPlayerAdmin() {
  const { activePlaylist, playerSettings, isLoading } = useMusicPlayer();
  const { audioFiles } = useAudioFiles();
  const [selectedAudioFile, setSelectedAudioFile] = useState<AudioFileData | null>(null);
  const [showFileSelector, setShowFileSelector] = useState(false);

  const handleSelectAudioFile = (file: AudioFileData) => {
    setSelectedAudioFile(file);
    setShowFileSelector(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading music player data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Audio Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Music Player
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFileSelector(!showFileSelector)}
            >
              {showFileSelector ? 'Hide' : 'Select'} Audio Files
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showFileSelector ? (
            <AudioFileSelector
              onSelectFile={handleSelectAudioFile}
              selectedFileId={selectedAudioFile?.id}
              showPlayer={false}
            />
          ) : (
            <>
              {activePlaylist || selectedAudioFile ? (
                <EnhancedCustomAudioPlayer className="w-full" />
              ) : (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No active playlist configured
                  </p>
                  <Button onClick={() => setShowFileSelector(true)}>
                    Browse Audio Files
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Active Playlist Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Active Playlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activePlaylist ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{activePlaylist.playlist_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {activePlaylist.tracks.length} tracks
                </p>
              </div>
              
              {activePlaylist.tracks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent Tracks:</h4>
                  {activePlaylist.tracks.slice(0, 3).map((track, index) => (
                    <div key={track.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                      {track.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                  ))}
                  {activePlaylist.tracks.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{activePlaylist.tracks.length - 3} more tracks
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">No active playlist configured</p>
              <p className="text-sm text-muted-foreground">
                Available audio files: {audioFiles.length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Player Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Default Volume</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(playerSettings.default_volume * 100)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Autoplay</p>
              <Badge variant={playerSettings.autoplay ? "default" : "secondary"}>
                {playerSettings.autoplay ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Repeat Mode</p>
              <Badge variant="outline">{playerSettings.repeat_mode}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Analytics</p>
              <Badge variant={playerSettings.analytics_enabled ? "default" : "secondary"}>
                {playerSettings.analytics_enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Music Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Total Audio Files:</span> {audioFiles.length}
            </p>
            <p className="text-sm">
              <span className="font-medium">Active Tracks:</span> {activePlaylist?.tracks.length || 0}
            </p>
            <p className="text-muted-foreground text-sm">
              Detailed analytics and player management features available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
