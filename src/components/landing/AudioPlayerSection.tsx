
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioTrack {
  id: string;
  title: string;
  albumArt?: string;
  audioUrl: string;
  artist?: string;
  duration?: string;
}

interface AudioPlayerSectionProps {
  tracks: AudioTrack[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AudioPlayerSection({
  tracks = [],
  title = "Featured Recordings",
  subtitle = "Listen to our latest performances",
  className = ""
}: AudioPlayerSectionProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayPause = (track: AudioTrack) => {
    if (currentlyPlaying === track.id) {
      // Pause current track
      if (audioElement) {
        audioElement.pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Stop previous track
      if (audioElement) {
        audioElement.pause();
      }
      
      // Play new track
      const audio = new Audio(track.audioUrl);
      audio.play();
      setAudioElement(audio);
      setCurrentlyPlaying(track.id);
      
      // Handle track end
      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
        setAudioElement(null);
      });
    }
  };

  if (tracks.length === 0) {
    return (
      <section className={`py-12 bg-muted/50 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground">No recordings available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 bg-muted/50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-playfair font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-4 md:gap-6 max-w-4xl mx-auto">
          {tracks.map((track) => (
            <Card key={track.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Album Art */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={track.albumArt || "/placeholder.svg"}
                        alt={`${track.title} album art`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Play/Pause Button Overlay */}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                      onClick={() => handlePlayPause(track)}
                    >
                      {currentlyPlaying === track.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                  </div>

                  {/* Track Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-1">{track.title}</h3>
                    {track.artist && (
                      <p className="text-muted-foreground text-sm">{track.artist}</p>
                    )}
                    {track.duration && (
                      <p className="text-muted-foreground text-xs mt-1">{track.duration}</p>
                    )}
                  </div>

                  {/* Volume Icon */}
                  <div className="flex-shrink-0">
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
