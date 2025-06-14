
import React, { useState, useEffect } from "react";
import { WaveSurferPlayer } from "@/components/audio/WaveSurferPlayer";
import { useAudioFiles } from "@/hooks/useAudioFiles";

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
}

export function CustomAudioSection({ tracks = [] }: CustomAudioSectionProps) {
  const { audioFiles } = useAudioFiles();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Use either provided tracks or fetch from Supabase
  const displayTracks = tracks.length > 0 ? tracks : audioFiles.slice(0, 5);
  const currentTrack = displayTracks[currentTrackIndex];

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
            <p className="text-gray-600 dark:text-gray-400">
              No audio tracks available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Helper function to get track properties
  const getTrackUrl = (track: any) => {
    return 'audioUrl' in track ? track.audioUrl : track.file_url;
  };

  const getTrackArtist = (track: any) => {
    return 'artist' in track ? track.artist : track.description || 'Unknown Artist';
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
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Player */}
          <WaveSurferPlayer
            audioUrl={getTrackUrl(currentTrack)}
            title={currentTrack.title}
            artist={getTrackArtist(currentTrack)}
            autoLoad={false}
            className="mb-6"
          />

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
                    <div>
                      <h4 className="font-medium">{track.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTrackArtist(track)}
                      </p>
                    </div>
                    {index === currentTrackIndex && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
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
