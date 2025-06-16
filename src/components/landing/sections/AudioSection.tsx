
import React from "react";
import { NewAudioSection } from "./NewAudioSection";

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

interface AudioSectionProps {
  tracks?: AudioTrack[];
  useSoundCloud?: boolean;
}

export function AudioSection({ tracks, useSoundCloud = false }: AudioSectionProps) {
  // Always use the new audio section now
  return <NewAudioSection />;
}
