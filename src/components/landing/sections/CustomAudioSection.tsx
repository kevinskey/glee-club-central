
import React, { useState } from "react";
import { CustomAudioPlayer } from "@/components/audio/CustomAudioPlayer";

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

interface CustomAudioSectionProps {
  tracks: AudioTrack[];
}

export function CustomAudioSection({ tracks }: CustomAudioSectionProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Transform tracks to match CustomAudioPlayer format
  const customTracks = tracks.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    audioUrl: track.audioUrl,
    coverArt: track.albumArt,
    duration: parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]) || 180
  }));

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Listen to the Sound of GleeWorld
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our latest recordings and performances
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <CustomAudioPlayer 
            tracks={customTracks}
            currentTrackIndex={currentTrackIndex}
            onTrackChange={setCurrentTrackIndex}
          />
        </div>
      </div>
    </section>
  );
}
