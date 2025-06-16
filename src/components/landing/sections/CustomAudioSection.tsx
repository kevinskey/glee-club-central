
import React, { useState, useEffect } from "react";
import { WaveSurferPlayer } from "@/components/audio/WaveSurferPlayer";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { useSoundCloudPlayer } from "@/hooks/useSoundCloudPlayer";
import { AudioFile } from "@/types/audio";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

interface CustomAudioSectionProps {
  tracks?: AudioTrack[];
  useSoundCloud?: boolean;
}

export function CustomAudioSection({ tracks = [], useSoundCloud = true }: CustomAudioSectionProps) {
  const { audioFiles } = useAudioFiles();
  const { tracks: soundCloudTracks, isLoading: soundCloudLoading, error: soundCloudError, refetchTracks } = useSoundCloudPlayer();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Determine which tracks to display
  let displayTracks: any[] = [];
  let isLoading = false;
  let hasError = false;
  
  if (useSoundCloud) {
    displayTracks = soundCloudTracks.slice(0, 5);
    isLoading = soundCloudLoading;
    hasError = !!soundCloudError;
  } else if (tracks.length > 0) {
    displayTracks = tracks;
  } else {
    displayTracks = audioFiles.slice(0, 5);
  }
  
  const currentTrack = displayTracks[currentTrackIndex];

  // Helper function to get track properties
  const getTrackUrl = (track: any) => {
    return 'audioUrl' in track ? track.audioUrl : track.file_url;
  };

  const getTrackArtist = (track: any) => {
    return 'artist' in track ? track.artist : track.description || 'Spelman College Glee Club';
  };

  const getTrackTitle = (track: any) => {
    return track.title || 'Untitled Track';
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Listen to the Sound of GleeWorld
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience our latest recordings and performances
            </p>
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
              <span className="ml-3 text-muted-foreground">Loading tracks from SoundCloud...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentTrack) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Listen to the Sound of GleeWorld
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience our latest recordings and performances
            </p>
            {hasError ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Unable to load tracks from SoundCloud at the moment.
                </p>
                <Button 
                  onClick={refetchTracks}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No audio tracks available at the moment.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Convert current track to AudioFile format for WaveSurferPlayer
  const currentAudioFile: AudioFile = {
    id: currentTrack.id,
    title: getTrackTitle(currentTrack),
    description: getTrackArtist(currentTrack),
    file_url: getTrackUrl(currentTrack),
    file_path: getTrackUrl(currentTrack),
    category: 'recordings',
    is_backing_track: false,
    uploaded_by: '',
    created_at: new Date().toISOString(),
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Listen to the Sound of GleeWorld
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our latest recordings and performances
          </p>
          {useSoundCloud && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                onClick={refetchTracks}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <a href="https://soundcloud.com/spelman-glee" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Visit SoundCloud
                </a>
              </Button>
            </div>
          )}
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Player */}
          <WaveSurferPlayer
            audio={currentAudioFile}
            className="mb-6"
          />

          {/* Current Track Info */}
          <div className="text-center py-4">
            <h3 className="text-xl font-semibold">{getTrackTitle(currentTrack)}</h3>
            <p className="text-muted-foreground">{getTrackArtist(currentTrack)}</p>
            {useSoundCloud && currentTrack.plays && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentTrack.plays.toLocaleString()} plays • {currentTrack.likes?.toLocaleString() || 0} likes
              </p>
            )}
          </div>

          {/* Track List */}
          {displayTracks.length > 1 && (
            <div className="grid gap-3">
              <h3 className="text-lg font-semibold text-center mb-4">
                More Tracks ({displayTracks.length})
              </h3>
              {displayTracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    index === currentTrackIndex
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setCurrentTrackIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{getTrackTitle(track)}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTrackArtist(track)}
                      </p>
                      {useSoundCloud && track.genre && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {track.genre}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {useSoundCloud && track.permalink_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a href={track.permalink_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {index === currentTrackIndex && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
