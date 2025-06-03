
import React from "react";
import { SoundCloudPlayer } from "@/components/audio/SoundCloudPlayer";

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

interface AudioSectionProps {
  tracks: AudioTrack[];
}

export function AudioSection({ tracks }: AudioSectionProps) {
  // Transform tracks to match SoundCloudPlayer format
  const soundCloudTracks = tracks.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]) || 180,
    audioUrl: track.audioUrl,
    coverArt: track.albumArt,
    likes: Math.floor(Math.random() * 500) + 50,
    plays: Math.floor(Math.random() * 5000) + 500,
    isLiked: Math.random() > 0.7,
    genre: 'Classical',
    uploadDate: '2024-01-15',
    description: `A beautiful performance by the Spelman College Glee Club featuring ${track.title}.`,
    waveformData: Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1)
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
        
        <SoundCloudPlayer 
          tracks={soundCloudTracks}
          currentTrackIndex={0}
          onTrackChange={(index) => console.log('Track changed to:', index)}
        />
      </div>
    </section>
  );
}
