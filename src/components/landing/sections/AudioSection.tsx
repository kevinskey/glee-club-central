
import React from "react";
import { AudioPlayerSection } from "@/components/landing/AudioPlayerSection";

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
  return (
    <section className="py-12 md:py-16">
      <AudioPlayerSection 
        tracks={tracks}
        title="Listen to the Sound of GleeWorld"
        subtitle="Experience our latest recordings"
      />
    </section>
  );
}
